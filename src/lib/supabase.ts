import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PickupRequest, ContactMessage } from '../types';

export const SUPABASE_CONFIG = {
  projectId: 'zkuongbbsshtpsasdbun',
  url: import.meta.env.VITE_SUPABASE_URL || 'https://zkuongbbsshtpsasdbun.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MQFwrOt666FXPWnB9Sdc2A_oj5dhofP',
};

// Global Supabase client singleton
export const supabase: SupabaseClient = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

export const SUPABASE_SQL_SETUP = `-- =================================================================
-- RECYNOVA SUPABASE DATABASE SETUP SCHEMA
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zkuongbbsshtpsasdbun/sql
-- =================================================================

-- 1. Table for Online Waste Pickup Requests
CREATE TABLE IF NOT EXISTS public.pickup_requests (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  waste_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;

-- Allow public and authenticated inserts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pickup_requests' AND policyname = 'Allow public insert pickup_requests'
  ) THEN
    CREATE POLICY "Allow public insert pickup_requests" ON public.pickup_requests FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pickup_requests' AND policyname = 'Allow public select pickup_requests'
  ) THEN
    CREATE POLICY "Allow public select pickup_requests" ON public.pickup_requests FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'pickup_requests' AND policyname = 'Allow public update pickup_requests'
  ) THEN
    CREATE POLICY "Allow public update pickup_requests" ON public.pickup_requests FOR UPDATE USING (true);
  END IF;
END $$;

-- 2. Table for Contact & Support Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public and authenticated inserts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Allow public insert contact_messages'
  ) THEN
    CREATE POLICY "Allow public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'contact_messages' AND policyname = 'Allow public select contact_messages'
  ) THEN
    CREATE POLICY "Allow public select contact_messages" ON public.contact_messages FOR SELECT USING (true);
  END IF;
END $$;
`;

/**
 * Save a pickup request to Supabase pickup_requests table
 */
export async function savePickupToSupabase(record: PickupRequest): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Try snake_case schema (Standard Postgres convention)
    const snakePayload = {
      id: record.id,
      user_name: record.userName,
      user_email: record.userEmail,
      user_phone: record.userPhone,
      address: record.address,
      city: record.city,
      waste_type: record.wasteType,
      quantity: record.quantity,
      preferred_date: record.preferredDate,
      preferred_time: record.preferredTime,
      notes: record.notes || '',
      status: record.status || 'Pending',
      created_at: record.createdAt || new Date().toISOString(),
    };

    const { error: snakeErr } = await supabase
      .from('pickup_requests')
      .upsert(snakePayload, { onConflict: 'id' });

    if (!snakeErr) {
      console.log('✅ Pickup request saved to Supabase pickup_requests:', record.id);
      return { success: true };
    }

    // 2. If snake_case fails due to column name mismatch, try camelCase payload
    if (snakeErr.code !== 'PGRST205') {
      const camelPayload = {
        id: record.id,
        userName: record.userName,
        userEmail: record.userEmail,
        userPhone: record.userPhone,
        address: record.address,
        city: record.city,
        wasteType: record.wasteType,
        quantity: record.quantity,
        preferredDate: record.preferredDate,
        preferredTime: record.preferredTime,
        notes: record.notes || '',
        status: record.status || 'Pending',
        createdAt: record.createdAt || new Date().toISOString(),
      };

      const { error: camelErr } = await supabase
        .from('pickup_requests')
        .upsert(camelPayload, { onConflict: 'id' });

      if (!camelErr) {
        console.log('✅ Pickup request saved to Supabase (camelCase):', record.id);
        return { success: true };
      }
    }

    console.warn('⚠️ Supabase pickup_requests insert notice:', snakeErr.message);
    return { success: false, error: snakeErr.message };
  } catch (err: any) {
    console.warn('⚠️ Exception saving to Supabase pickup_requests:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Update pickup status in Supabase
 */
export async function updatePickupStatusInSupabase(id: string, status: PickupRequest['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pickup_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.warn('Could not update status in Supabase:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetch pickup requests from Supabase
 */
export async function fetchPickupsFromSupabase(): Promise<PickupRequest[] | null> {
  try {
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    // Map rows to PickupRequest objects
    return data.map((row: any) => ({
      id: row.id,
      userName: row.user_name || row.userName || 'Resident',
      userEmail: row.user_email || row.userEmail || '',
      userPhone: row.user_phone || row.userPhone || '',
      address: row.address || '',
      city: row.city || '',
      wasteType: row.waste_type || row.wasteType || 'Recyclable Waste',
      quantity: row.quantity || '',
      preferredDate: row.preferred_date || row.preferredDate || '',
      preferredTime: row.preferred_time || row.preferredTime || '',
      notes: row.notes || '',
      status: (row.status as any) || 'Pending',
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

/**
 * Save contact message to Supabase contact_messages table
 */
export async function saveContactToSupabase(contact: ContactMessage): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject || '',
      message: contact.message,
      status: contact.status || 'New',
      created_at: contact.createdAt || new Date().toISOString(),
    };

    const { error } = await supabase
      .from('contact_messages')
      .upsert(payload, { onConflict: 'id' });

    if (!error) {
      console.log('✅ Contact message saved to Supabase contact_messages:', contact.id);
      return { success: true };
    }

    console.warn('⚠️ Supabase contact_messages notice:', error.message);
    return { success: false, error: error.message };
  } catch (err: any) {
    console.warn('⚠️ Exception saving to Supabase contact_messages:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Fetch contact messages from Supabase
 */
export async function fetchContactsFromSupabase(): Promise<ContactMessage[] | null> {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject || '',
      message: row.message,
      status: row.status || 'New',
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return null;
  }
}

/**
 * Test Supabase connectivity and table presence
 */
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  projectId: string;
  url: string;
  pickupTableReady: boolean;
  contactTableReady: boolean;
  message: string;
}> {
  let pickupTableReady = false;
  let contactTableReady = false;
  let connected = false;

  try {
    const { error: pErr } = await supabase.from('pickup_requests').select('id').limit(1);
    connected = true;
    if (!pErr) {
      pickupTableReady = true;
    }

    const { error: cErr } = await supabase.from('contact_messages').select('id').limit(1);
    if (!cErr) {
      contactTableReady = true;
    }

    return {
      connected,
      projectId: SUPABASE_CONFIG.projectId,
      url: SUPABASE_CONFIG.url,
      pickupTableReady,
      contactTableReady,
      message: pickupTableReady && contactTableReady 
        ? 'Connected & All Tables Ready in Supabase!'
        : 'Connected to Supabase. SQL tables setup ready to execute in dashboard.',
    };
  } catch (e: any) {
    return {
      connected: false,
      projectId: SUPABASE_CONFIG.projectId,
      url: SUPABASE_CONFIG.url,
      pickupTableReady: false,
      contactTableReady: false,
      message: e?.message || 'Unable to connect to Supabase endpoint',
    };
  }
}
