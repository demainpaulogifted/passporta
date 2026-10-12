
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: "Please sign in to verify your payment." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    const reference =
      typeof body?.reference === "string" ? body.reference : "";

    if (!/^PP[a-f0-9]{32}$/i.test(reference)) {
      return NextResponse.json(
        { error: "The payment reference is invalid." },
        { status: 400 }
      );
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!secret || !supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Payment verification is not configured." },
        { status: 503 }
      );
    }

    const admin = createAdminClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: payment, error: paymentError } = await admin
      .from("course_payments")
      .select("*")
      .eq("reference", reference)
      .eq("user_id", user.id)
      .maybeSingle();

    if (paymentError) throw paymentError;

    if (!payment) {
      return NextResponse.json(
        { error: "No payment record matches your account." },
        { status: 404 }
      );
    }

    // Verify with Paystack directly. Never trust the browser's claim.
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        cache: "no-store",
      }
    );

    const result = await response.json();
    const transaction = result?.data;

    const verified =
      response.ok &&
      result?.status === true &&
      transaction?.status === "success" &&
      transaction?.reference === reference &&
      transaction?.amount === 500000 &&
      transaction?.currency === "NGN" &&
      String(transaction?.customer?.email || "").toLowerCase() ===
        user.email.toLowerCase();

    if (!verified) {
      return NextResponse.json(
        {
          error:
            "Payment has not been verified as successful. If you have paid, please retry verification.",
        },
        { status: 400 }
      );
    }

    // Do not grant access if the reference was already attached to another user.
    if (payment.user_id !== user.id) {
      return NextResponse.json(
        { error: "This payment does not belong to your account." },
        { status: 403 }
      );
    }

    const { error: updateError } = await admin
      .from("course_payments")
      .update({ status: "success", paid_at: new Date().toISOString() })
      .eq("reference", reference)
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    const { error: accessError } = await admin
      .from("course_access")
      .upsert(
        {
          user_id: user.id,
          payment_reference: reference,
          access_type: "lifetime",
        },
        { onConflict: "user_id" }
      );

    if (accessError) throw accessError;

    return NextResponse.json({
      success: true,
      lifetimeAccess: true,
      message: "Payment verified. Your lifetime course access is active.",
    });
  } catch (error) {
    console.error("Course payment verification failed:", error);
    return NextResponse.json(
      { error: "Could not verify payment right now. Please try again." },
      { status: 500 }
    );
  }
}
