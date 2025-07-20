'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

// Add 'prevState' as the first argument to match useFormState signature
async function createQuote(prevState: any, formData: FormData) {
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

  // TODO: Handle file uploads to Supabase Storage

  // 2. Save data to Supabase using Prisma
  try {
    await prisma.quote.create({
      data: {
        destination,
        startDate,
        endDate,
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
        attachments: [], // Placeholder for file URLs
      },
    });
  } catch (error) {
    console.error('Failed to create quote:', error);
    // TODO: Add user-facing error handling
    return;
  }

  // 3. Revalidate path and redirect
  revalidatePath('/quote');
  redirect('/quote/thank-you');
}

export { createQuote }; 