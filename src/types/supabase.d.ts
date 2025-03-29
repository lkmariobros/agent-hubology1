
// This is a simplified type definition for the Supabase database
// In a real app, this would be generated from the Supabase schema

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          name: string;
          email: string;
          // Add other columns as needed
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          // Add other columns as needed
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          // Add other columns as needed
        };
      };
      // Add other tables as needed
    };
    Views: {
      // Add views if needed
    };
    Functions: {
      // Add functions if needed
    };
  };
};
