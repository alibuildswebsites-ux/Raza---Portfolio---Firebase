import { createClient } from '@supabase/supabase-js';

// Fallback credentials since import.meta.env might be undefined in some runtimes (like native browser ESM)
const FALLBACK_URL = 'https://ntzfhqodaupfopngxvmk.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50emZocW9kYXVwZm9wbmd4dm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTUxNDgsImV4cCI6MjA4MTI5MTE0OH0.13v08LjydaLq7LYVlw_qoJVsUkm3HUOl3bjEeqmqU7w';

// Safe access to environment variables
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // Ignore errors
  }
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || FALLBACK_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || FALLBACK_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase keys are missing. Please check .env file or fallback configuration.');
  throw new Error('Missing Supabase keys');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);