// Type definitions for Deno Edge Functions

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): { [key: string]: string };
  }

  export const env: Env;
}

declare module "https://deno.land/std@0.177.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2.7.1" {
  export * from "@supabase/supabase-js";
  export function createClient(url: string, key: string, options?: any): any;
}

declare module "https://esm.sh/date-fns@2.30.0" {
  export function format(date: Date | number, format: string, options?: any): string;
  export function addDays(date: Date | number, amount: number): Date;
}
