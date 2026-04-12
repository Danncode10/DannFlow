import { createClient } from '@/utils/supabase/client';

/**
 * Auth Service
 * Strictly contains all business logic and Supabase queries for authentication.
 */

export async function signInWithEmail(email: string, password: string) {
  const client = createClient();
  
  const { error: signInError } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) throw signInError;

  // Check if MFA is required
  const { data: mfaData, error: mfaError } = await client.auth.mfa.getAuthenticatorAssuranceLevel();

  if (mfaError) throw mfaError;

  if (mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
    return { success: true, requiresMFA: true };
  }

  return { success: true, requiresMFA: false };
}

export async function signUpWithEmail(email: string, password: string) {
  const client = createClient();
  const { error } = await client.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return { success: true };
}

export async function signOut() {
  const client = createClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
  return { success: true };
}

export async function forgotPassword(email: string) {
  const client = createClient();
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
  return { success: true };
}

export async function resetPassword(password: string) {
  const client = createClient();
  const { error } = await client.auth.updateUser({
    password: password,
  });
  if (error) throw error;
  return { success: true };
}

export async function updatePassword(password: string) {
  const client = createClient();
  const { error } = await client.auth.updateUser({
    password: password,
  });
  if (error) throw error;
  return { success: true };
}
