import { supabaseAdmin } from '../../config/supabase';

export const findOrCreateUser = async (mobile: string) => {
  const { data: existingUser, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('mobile_number', mobile)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // not "No rows" error
    throw new Error('User lookup failed');
  }

  if (existingUser) return existingUser;

  const { data: newUser, error: insertError } = await supabaseAdmin
    .from('users')
    .insert([{ mobile_number: mobile }])
    .select()
    .single();

  if (insertError) {
    console.error('Supabase Insert Error:', insertError);
    throw new Error('User creation failed');
  }

  return newUser;
};
