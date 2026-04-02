import { createClient } from '@/utils/supabase/client';

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
