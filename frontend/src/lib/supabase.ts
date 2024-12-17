import { createClient, PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase Config:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
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

// Test the connection immediately
if (typeof window !== 'undefined') {
  console.log('Testing Supabase connection...');
  supabase.from('documents').select('count').single()
    .then(({ data, error }: { data: any; error: PostgrestError | null }) => {
      if (error) {
        console.error('Supabase connection error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('Supabase connection successful:', data);
      }
    })
    .catch((err: Error) => {
      console.error('Unexpected error testing Supabase connection:', err.message);
    });
}

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  try {
    const isConfigured = (
      typeof supabaseUrl === 'string' &&
      typeof supabaseAnonKey === 'string' &&
      supabaseUrl.startsWith('https://') &&
      supabaseAnonKey.length > 0
    );
    console.log('Supabase configuration check:', isConfigured);
    return isConfigured;
  } catch (error) {
    console.error('Error checking Supabase configuration:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// Helper function to validate Supabase connection
export async function validateSupabaseConnection(): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('count')
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase connection error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return { isValid: false, error: error.message };
    }

    return { isValid: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to validate Supabase connection';
    console.error('Validation error:', errorMessage);
    return { isValid: false, error: errorMessage };
  }
}

// Helper function to get database info
export function getDatabaseInfo() {
  const url = supabaseUrl;
  if (!url) return null;

  const projectId = url.match(/https:\/\/(.*?)\.supabase\.co/)?.[1];
  if (!projectId) return null;

  return {
    projectId,
    url,
    isConfigured: isSupabaseConfigured()
  };
} 