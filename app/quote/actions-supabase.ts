'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Alternative Server Action using Supabase client directly
async function createQuoteSupabase(prevState: any, formData: FormData) {
  // 1. Get data from formData
  const destination = formData.get('destination') as string;
  const airline = formData.get('airline') as string;
  const hotel = formData.get('hotel') as string;
  const startDate = new Date(formData.get('start-date') as string);
  const endDate = new Date(formData.get('end-date') as string);
  const adults = parseInt(formData.get('adults') as string, 10);
  const children = parseInt(formData.get('children') as string, 10) || 0;
  const infants = parseInt(formData.get('infants') as string, 10) || 0;
  const travelStyle = formData.getAll('travelStyle') as string[];
  const budget = formData.get('budget') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const requests = formData.get('requests') as string;

  // 2. Save data using Supabase client directly
  try {
    const { data, error } = await supabase
      .from('Quote')
      .insert({
        destination,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        adults,
        children,
        infants,
        airline,
        hotel,
        travelStyle,
        budget,
        name,
        phone,
        email,
        requests,
        attachments: [],
      });

    if (error) {
      console.error('Supabase error:', error);
      return;
    }

    console.log('Quote created successfully:', data);
  } catch (error) {
    console.error('Failed to create quote with Supabase:', error);
    return;
  }

  // 3. Revalidate path and redirect
  revalidatePath('/quote');
  redirect('/quote/thank-you');
}

export { createQuoteSupabase }; 