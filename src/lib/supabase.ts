import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'legal-buddy'
      }
    }
  }
);

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  try {
    return (
      typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
      typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string' &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://') &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0
    );
  } catch (error) {
    console.error('Error checking Supabase configuration:', error);
    return false;
  }
}

// Helper function to validate Supabase connection
export async function validateSupabaseConnection(): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.from('documents').select('count');
    if (error) {
      return { isValid: false, error: error.message };
    }
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Supabase connection error:', error);
    return { isValid: false, error: errorMessage };
  }
}

// Helper function to get database connection info
export function getDatabaseInfo() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  const projectId = url.match(/https:\/\/(.*?)\.supabase\.co/)?.[1];
  if (!projectId) return null;

  return {
    projectId,
    url,
    isConfigured: isSupabaseConfigured()
  };
} 