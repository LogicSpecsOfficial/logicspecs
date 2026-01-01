import { supabase } from '@/lib/supabase';

export default async function DevicePage({ params }: { params: { id: string } }) {
  const deviceSlug = params.id;

  // Try to find the phone
  const { data: phone, error } = await supabase
    .from('iPhones')
    .select('*')
    .eq('slug', deviceSlug)
    .single();

  // If it's a 404, we will show WHAT it tried to find
  if (!phone) {
    return (
      <div className="p-20">
        <h1 className="text-red-500 font-bold">Debug: Phone Not Found</h1>
        <p>The URL slug we searched for: <strong>{deviceSlug}</strong></p>
        {error && <p className="mt-4 bg-gray-100 p-2">Supabase Error: {error.message}</p>}
        <p className="mt-4 text-gray-400 text-sm">Check if this slug exists exactly in your Supabase 'slug' column.</p>
      </div>
    );
  }

  return (
    <main className="p-20">
      <h1 className="text-4xl font-bold">{phone.model_name}</h1>
      <p className="text-blue-500 font-mono">Database Match Found: {phone.slug}</p>
    </main>
  );
}