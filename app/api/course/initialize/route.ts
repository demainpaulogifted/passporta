
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const COURSE_AMOUNT_KOBO = 500000;

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email || !user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Please sign in with a verified email first." },
        { status: 401 }
      );
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!secret || !supabaseUrl || !serviceKey || !siteUrl) {
      return NextResponse.json(
        { error: "Payment is not configured yet. Please try again later." },
        { status: 503 }
      );
    }

    const admin = createAdminClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: existingAccess, error: accessError } = await admin
      .from("course_access")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (accessError) throw accessError;

    if (existingAccess) {
      return NextResponse.json({
        alreadyEnrolled: true,
        message: "Your lifetime access is already active.",
      });
    }

    const reference = `PP${randomUUID().replace(/-/g, "")}`;

    const { error: insertError } = await admin
      .from("course_payments")
      .insert({
        user_id: user.id,
        email: user.email,
        reference,
        amount_kobo: COURSE_AMOUNT_KOBO,
        currency: "NGN",
        status: "pending",
      });

    if (insertError) throw insertError;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: COURSE_AMOUNT_KOBO,
          currency: "NGN",
          reference,
          callback_url: `${siteUrl.replace(/\/$/, "")}/course`,
          metadata: {
            user_id: user.id,
            product: "passporta_lifetime_training",
          },
        }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status || !result.data?.authorization_url) {
      await admin
        .from("course_payments")
        .update({ status: "failed" })
        .eq("reference", reference);

      return NextResponse.json(
        { error: "Paystack could not start checkout. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      authorizationUrl: result.data.authorization_url,
    });
  } catch (error) {
    console.error("Course payment initialization failed:", error);
    return NextResponse.json(
      { error: "Unable to start payment. Please try again." },
      { status: 500 }
    );
  }
}
