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
  
  // Handle file attachments
  const attachmentCount = parseInt(formData.get('attachmentCount') as string) || 0;
  const attachments: string[] = [];
  
  for (let i = 0; i < attachmentCount; i++) {
    const file = formData.get(`attachment-${i}`) as File;
    if (file) {
      try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `quote-attachments/${fileName}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('File upload error:', uploadError);
          // Fallback to filename only if upload fails
          attachments.push(`${file.name} (${Math.round(file.size / 1024)}KB) - 업로드 실패`);
        } else {
          // Store the file path and original name
          attachments.push(JSON.stringify({
            originalName: file.name,
            filePath: filePath,
            size: file.size,
            uploadedAt: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('File processing error:', error);
        attachments.push(`${file.name} (${Math.round(file.size / 1024)}KB) - 처리 실패`);
      }
    }
  }

  // 2. Save data using Supabase client directly
  try {
    const { data, error } = await supabase
      .from('Quote')
      .insert({
        id: crypto.randomUUID(), // Generate unique ID
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
        attachments: attachments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase error:', error);
      return { error: 'Failed to create quote' };
    }

    console.log('Quote created successfully:', data);
    
    // 3. Revalidate path and return success
    revalidatePath('/quote');
    return { success: true, message: 'Quote created successfully' };
  } catch (error) {
    console.error('Failed to create quote with Supabase:', error);
    return { error: 'Failed to create quote' };
  }
}

export { createQuoteSupabase }; 