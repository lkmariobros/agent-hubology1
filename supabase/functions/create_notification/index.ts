
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse request body
    const body: RequestBody = await req.json();
    const { userId, type, title, message, data } = body;

    if (!userId || !type || !title || !message) {
      return new Response(
        JSON.stringify({ error: "userId, type, title, and message are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Insert the notification
    const { data: notificationData, error } = await supabaseClient
      .from("notifications")
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        read: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification created successfully",
        data: notificationData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
