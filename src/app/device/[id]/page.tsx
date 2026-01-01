import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

// We use { params } to grab the [id] from the URL
export default async function DevicePage({ params }: { params: { id: string } }) {
  
  // 1. We grab the ID from the URL (e.g., iPhone17,3)
  const deviceId = params.id;

  // 2. We search Supabase for that ID in the 'model_identifier' column
  const { data: phone, error } = await supabase
    .from('iPhones')
    .select('*')
    .eq('model_identifier', deviceId)
    .single();

  // If Supabase can't find it, or there's an error, show 404
  if (!phone || error) {
    console.error("Supabase Error:", error);
    return notFound();
  }

  return (
    <main className="p-20">
      <h1 className="text-4xl font-bold">{phone.model_name}</h1>
      <p className="text-gray-500">ID found: {phone.model_identifier}</p>
      {/* ... rest of your UI ... */}
    </main>
  );
}