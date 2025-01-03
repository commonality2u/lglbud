import { createClient } from '@supabase/supabase-js';
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
    .then(({ data, error }) => {
      if (error) {
        console.error('Supabase connection error:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('Supabase connection successful:', data);
      }
    })
    .catch(err => {
      console.error('Unexpected error testing Supabase connection:', err);
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
    console.log('Validating Supabase connection...');
    const { data, error } = await supabase.from('documents').select('count');
    if (error) {
      console.error('Validation error:', error);
      return { isValid: false, error: error.message };
    }
    console.log('Validation successful:', data);
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Validation error:', error);
    return { isValid: false, error: errorMessage };
  }
}

// Helper function to get database connection info
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