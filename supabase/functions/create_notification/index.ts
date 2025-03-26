
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
    console.log("Notification function called");
    
    // Initialize Supabase client with environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Server configuration error" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    let body: RequestBody;
    try {
      body = await req.json();
      console.log("Request body:", JSON.stringify(body));
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid request body" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const { userId, type, title, message, data } = body;

    if (!userId || !type || !title || !message) {
      console.error("Missing required fields:", { userId, type, title, message });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "userId, type, title, and message are required" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Creating notification:", { userId, type, title });

    // Ensure data is valid and serializable before stringifying
    let dataJson = null;
    
    if (data) {
      try {
        // Test if the data is serializable
        const testStr = JSON.stringify(data);
        dataJson = testStr;
        console.log("Data is valid JSON, serialized to:", dataJson);
      } catch (e) {
        console.error("Error serializing data:", e);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Data field is not serializable" 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    // Insert the notification
    try {
      const { data: notificationData, error: insertError } = await supabaseClient
        .from("notifications")
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data: dataJson,
          read: false
        })
        .select()
        .single();

      if (insertError) {
        console.error("Database error:", insertError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: insertError.message 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      console.log("Notification created successfully:", notificationData);

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
    } catch (dbError) {
      console.error("Unexpected database error:", dbError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Database error: ${dbError.message}` 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("Error in create_notification function:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
