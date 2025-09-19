import { createClient } from '@supabase/supabase-js';

// Set these in your .env file at the project root
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helper functions
export async function signUp(email: string, password: string) {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  return supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`
    }
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

// Resend confirmation email
export async function resendConfirmation(email: string) {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  return supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`
    }
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

// Get current user
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Update user profile
export async function updateProfile(updates: Record<string, any>) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', (await getUser()).id);
  if (error) throw error;
  return data;
}

// Password reset
export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

// Social login (Google example)
export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({ provider: 'google' });
}
