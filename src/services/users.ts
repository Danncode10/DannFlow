import { createClient } from '@/utils/supabase/server';

export async function getAllProfiles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Check if current user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    // Regular users might only see public info, but for this demo:
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, role');
    return profiles || [];
  }

  // Admin can see everything
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*');
  return profiles || [];
}

export async function updateProfile(id: string, updates: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id);
    
  if (error) throw error;
  return data;
}
