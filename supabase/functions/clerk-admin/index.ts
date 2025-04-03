
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLERK_SECRET_KEY = Deno.env.get("CLERK_SECRET_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if CLERK_SECRET_KEY is set
    if (!CLERK_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "CLERK_SECRET_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const { action, data } = await req.json();

    // Authorization check (ensure the request has valid auth)
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let response;

    switch (action) {
      case "getUserRoles":
        // Example endpoint to get user roles from Clerk
        response = await fetch(`https://api.clerk.dev/v1/users/${data.userId}`, {
          headers: {
            Authorization: `Bearer ${CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        });
        break;

      case "assignRole":
        // Example endpoint to assign a role to a user
        response = await fetch(`https://api.clerk.dev/v1/users/${data.userId}/metadata`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publicMetadata: {
              role: data.role
            },
          }),
        });
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const responseData = await response.json();
    console.log("Clerk API response:", responseData);

    return new Response(
      JSON.stringify(responseData),
      { 
        status: response.status, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error in clerk-admin function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
