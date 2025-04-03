
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const apiKey = Deno.env.get("RESEND_API_KEY");

interface EmailPayload {
  email: string;
  firstName: string;
  invitationCode: string;
}

const sendEmail = async (payload: EmailPayload) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Property Agency <onboarding@resend.dev>",
      to: [payload.email],
      subject: "You're invited to join our agency team",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2>Hi ${payload.firstName},</h2>
          <p>You've been invited to join our team at Property Agency.</p>
          <p>Use the following code during registration to join:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0; font-size: 24px; letter-spacing: 2px;">${payload.invitationCode}</h3>
          </div>
          <p>To complete your registration, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('PUBLIC_APP_URL') || 'http://localhost:5173'}/auth/signup?code=${payload.invitationCode}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Register Now
            </a>
          </div>
          <p>This invitation will expire in 7 days.</p>
          <p>If you have any questions, please contact the person who invited you.</p>
          <p>Thank you,<br>Property Agency Team</p>
        </div>
      `,
    }),
  });

  const result = await response.json();
  return result;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const { email, firstName, invitationCode } = await req.json() as EmailPayload;

    // Simple validation
    if (!email || !firstName || !invitationCode) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send the invitation email
    const emailResult = await sendEmail({
      email,
      firstName,
      invitationCode,
    });

    return new Response(
      JSON.stringify({ success: true, data: emailResult }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
