import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PickupRequest, ContactMessage } from '../types';

export const SUPABASE_CONFIG = {
  projectId: 'zkuongbbsshtpsasdbun',
  url: import.meta.env.VITE_SUPABASE_URL || 'https://zkuongbbsshtpsasdbun.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MQFwrOt666FXPWnB9Sdc2A_oj5dhofP',
  sqlEditorUrl: 'https://supabase.com/dashboard/project/zkuongbbsshtpsasdbun/sql/new',
  tableEditorUrl: 'https://supabase.com/dashboard/project/zkuongbbsshtpsasdbun/editor',
};

// Global Supabase client singleton
export const supabase: SupabaseClient = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

export const PICKUP_TABLE_CANDIDATES = [
  'pickup_requests',
  'pickuprequests',
  'pickup_request',
  'pickuprequest',
  'pickups',
  'pickup'
];

export const CONTACT_TABLE_CANDIDATES = [
  'contact_messages',
  'contactmessages',
  'contact_message',
  'contactmessage',
  'contacts',
  'contact'
];

export const SUPABASE_SQL_SETUP = `-- =================================================================
-- RECYNOVA SUPABASE DATABASE SETUP SCHEMA
-- Run this once in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zkuongbbsshtpsasdbun/sql/new
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

-- Allow public and authenticated inserts & reads
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

-- Allow public and authenticated inserts & reads
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
 * Save a pickup request across candidate table names
 */
export async function savePickupToSupabase(record: PickupRequest): Promise<{ success: boolean; table?: string; error?: string }> {
  try {
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

    // Try primary and variant table names
    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      // 1. Try snake_case
      const { error: snakeErr } = await supabase
        .from(tableName)
        .upsert(snakePayload, { onConflict: 'id' });

      if (!snakeErr) {
        console.log(`✅ Pickup request saved to Supabase table '${tableName}':`, record.id);
        return { success: true, table: tableName };
      }

      // If error is NOT "table not found", try camelCase on this table
      if (snakeErr.code !== 'PGRST205') {
        const { error: camelErr } = await supabase
          .from(tableName)
          .upsert(camelPayload, { onConflict: 'id' });

        if (!camelErr) {
          console.log(`✅ Pickup request saved to Supabase table '${tableName}' (camelCase):`, record.id);
          return { success: true, table: tableName };
        }
      }
    }

    return { 
      success: false, 
      error: "Table 'pickup_requests' not found in Supabase schema cache. Run the SQL schema in Supabase SQL editor to create the table." 
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Update pickup status in Supabase
 */
export async function updatePickupStatusInSupabase(id: string, status: PickupRequest['status']): Promise<boolean> {
  try {
    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      const { error } = await supabase
        .from(tableName)
        .update({ status })
        .eq('id', id);

      if (!error) return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Fetch pickup requests from Supabase
 */
export async function fetchPickupsFromSupabase(): Promise<PickupRequest[] | null> {
  try {
    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
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
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save contact message across candidate table names
 */
export async function saveContactToSupabase(contact: ContactMessage): Promise<{ success: boolean; table?: string; error?: string }> {
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

    for (const tableName of CONTACT_TABLE_CANDIDATES) {
      const { error } = await supabase
        .from(tableName)
        .upsert(payload, { onConflict: 'id' });

      if (!error) {
        console.log(`✅ Contact message saved to Supabase table '${tableName}':`, contact.id);
        return { success: true, table: tableName };
      }
    }

    return { 
      success: false, 
      error: "Table 'contact_messages' not found in Supabase schema cache. Run the SQL schema in Supabase SQL editor to create the table." 
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Fetch contact messages from Supabase
 */
export async function fetchContactsFromSupabase(): Promise<ContactMessage[] | null> {
  try {
    for (const tableName of CONTACT_TABLE_CANDIDATES) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          subject: row.subject || '',
          message: row.message,
          status: row.status || 'New',
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
        }));
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Test Supabase connectivity and table presence across variations
 */
export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  projectId: string;
  url: string;
  pickupTableReady: boolean;
  activePickupTable?: string;
  contactTableReady: boolean;
  activeContactTable?: string;
  message: string;
}> {
  let pickupTableReady = false;
  let activePickupTable: string | undefined;
  let contactTableReady = false;
  let activeContactTable: string | undefined;
  let connected = false;

  try {
    // Test pickups
    for (const table of PICKUP_TABLE_CANDIDATES) {
      const { error } = await supabase.from(table).select('id').limit(1);
      connected = true;
      if (!error) {
        pickupTableReady = true;
        activePickupTable = table;
        break;
      }
    }

    // Test contacts
    for (const table of CONTACT_TABLE_CANDIDATES) {
      const { error } = await supabase.from(table).select('id').limit(1);
      connected = true;
      if (!error) {
        contactTableReady = true;
        activeContactTable = table;
        break;
      }
    }

    return {
      connected,
      projectId: SUPABASE_CONFIG.projectId,
      url: SUPABASE_CONFIG.url,
      pickupTableReady,
      activePickupTable,
      contactTableReady,
      activeContactTable,
      message: pickupTableReady && contactTableReady 
        ? 'Connected & All Tables Active in Supabase!' 
        : 'Supabase connected! Tables need to be created in SQL Editor to store data.',
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

/**
 * Bulk sync all local/pending pickup requests and contact messages to Supabase
 */
export async function syncAllLocalDataToSupabase(
  pickups: PickupRequest[],
  contacts: ContactMessage[]
): Promise<{
  syncedPickups: number;
  syncedContacts: number;
  pickupSuccess: boolean;
  contactSuccess: boolean;
  error?: string;
}> {
  let syncedPickups = 0;
  let syncedContacts = 0;
  let pickupSuccess = false;
  let contactSuccess = false;
  let lastError: string | undefined;

  for (const pickup of pickups) {
    const res = await savePickupToSupabase(pickup);
    if (res.success) {
      syncedPickups++;
      pickupSuccess = true;
    } else {
      lastError = res.error;
    }
  }

  for (const contact of contacts) {
    const res = await saveContactToSupabase(contact);
    if (res.success) {
      syncedContacts++;
      contactSuccess = true;
    } else {
      lastError = res.error;
    }
  }

  return {
    syncedPickups,
    syncedContacts,
    pickupSuccess,
    contactSuccess,
    error: lastError,
  };
}
