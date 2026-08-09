'use server';

import { createClient } from '@/utils/supabase/server';
import { verifyRateLimit } from '@/lib/ratelimit';

const MIN_PASSWORD_SCORE = 3;

function getPasswordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export async function signInWithEmailRateLimited(email: string, password: string) {
  const { success } = await verifyRateLimit(email, "sign-in");
  if (!success) throw new Error('Too many login attempts. Try again in a few moments.');

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) throw signInError;

  const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (mfaError) throw mfaError;

  if (mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
    return { success: true, requiresMFA: true };
  }

  return { success: true, requiresMFA: false };
}

export async function signUpWithEmailRateLimited(
  email: string,
  password: string,
  origin: string,
  fullName?: string,
) {
  const { success } = await verifyRateLimit(email, "sign-up");
  if (!success) throw new Error('Too many signup attempts. Try again in a few moments.');
  if (getPasswordScore(password) < MIN_PASSWORD_SCORE) {
    throw new Error('Use a stronger password before creating your account.');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // After user clicks the email link, Supabase will redirect here
      // with ?code=... → our /auth/callback route exchanges it for a session
      // → then redirects to /login (default next)
      emailRedirectTo: `${origin}/auth/callback?next=/login`,
      data: fullName ? { full_name: fullName } : undefined,
    },
  });
  if (error) throw error;
  return { success: true };
}

export async function forgotPasswordRateLimited(email: string, redirectUrl: string) {
  const { success } = await verifyRateLimit(email, "password-reset");
  if (!success) throw new Error('Too many password reset attempts. Try again in a few moments.');

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
  if (error) throw error;
  return { success: true };
}
