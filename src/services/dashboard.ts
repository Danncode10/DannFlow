import { createClient } from '@/utils/supabase/server';

export async function getVibeCheckData() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(3);
      
    if (error) {
      console.warn("Vibe Check Error. Check your tables:", error.message);
      return [];
    }
    
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function getUserSession() {
  try {
     const supabase = await createClient();
     const { data: { user }, error } = await supabase.auth.getUser();
     if (error) return null;
     return user;
  } catch (err) {
    return null;
  }
}
