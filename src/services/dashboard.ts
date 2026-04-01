import { createClient } from '@supabase/supabase-js';

// Initialize a standard server-side client for fetching initial mock data
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getVibeCheckData() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(3);
      
    if (error) {
      console.warn("Vibe Check Error: Table 'profiles' likely does not exist yet.", error.message);
      return [];
    }
    
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function getUserSession() {
  // Mock basic server wrapper check using our anon key config via vanilla supabase-js 
  try {
     const { data: { session } } = await supabase.auth.getSession();
     return session?.user || null;
  } catch (err) {
    return null;
  }
}
