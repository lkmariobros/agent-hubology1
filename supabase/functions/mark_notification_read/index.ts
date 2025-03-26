
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  notification_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      throw new Error("Server configuration error");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const body: RequestBody = await req.json();
    const { notification_id } = body;

    if (!notification_id) {
      return new Response(
        JSON.stringify({ success: false, error: "notification_id is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Marking notification as read:", notification_id);

    // Update the notification status
    const { data, error } = await supabaseClient
      .from("notifications")
      .update({ read: true })
      .eq("id", notification_id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Notification marked as read:", data);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification marked as read",
        data
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in mark_notification_read function:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
