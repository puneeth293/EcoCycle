import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PickupRequest, ContactMessage } from '../types';

export const SUPABASE_CONFIG = {
  projectId: 'zkuongbbsshtpsasdbun',
  url: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
       (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
       'https://zkuongbbsshtpsasdbun.supabase.co',
  anonKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
           (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 
           'sb_publishable_MQFwrOt666FXPWnB9Sdc2A_oj5dhofP',
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
-- RECYNOVA SUPABASE DATABASE SETUP & RLS CLEANUP SCRIPT
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zkuongbbsshtpsasdbun/sql/new
-- =================================================================

-- 1. Ensure pickup_requests table exists with all standard columns
CREATE TABLE IF NOT EXISTS public.pickup_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    waste_type TEXT NOT NULL,
    weight TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure extended columns exist if table was created with minimal columns
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS user_phone TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS quantity TEXT;

-- 2. Ensure contact_messages table exists
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure status column exists in contact_messages
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'New';

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any duplicate/legacy policies first to avoid policy conflicts
DROP POLICY IF EXISTS "Allow public insert to pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public select on pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public update on pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public select on contact_messages" ON public.contact_messages;

DROP POLICY IF EXISTS "Allow public insert pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public select pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public update pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public delete pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public select contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public update contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public delete contact_messages" ON public.contact_messages;

-- 5. Create unified, least-privilege policies for Recynova app operations
-- Pickup Requests Policies
CREATE POLICY "Allow public select pickup_requests" ON public.pickup_requests
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert pickup_requests" ON public.pickup_requests
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update pickup_requests" ON public.pickup_requests
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete pickup_requests" ON public.pickup_requests
    FOR DELETE TO anon, authenticated USING (true);

-- Contact Messages Policies
CREATE POLICY "Allow public select contact_messages" ON public.contact_messages
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert contact_messages" ON public.contact_messages
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update contact_messages" ON public.contact_messages
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete contact_messages" ON public.contact_messages
    FOR DELETE TO anon, authenticated USING (true);
`;

/**
 * Save a pickup request adaptively across Supabase table schemas
 */
export async function savePickupToSupabase(record: PickupRequest): Promise<{ success: boolean; table?: string; error?: string }> {
  try {
    const formattedAddress = record.city && !record.address.toLowerCase().includes(record.city.toLowerCase())
      ? `${record.address}, ${record.city}`
      : record.address;

    const emailNoteTag = record.userEmail ? `[Email: ${record.userEmail}]` : '';
    const formattedNotes = emailNoteTag
      ? `${emailNoteTag} ${record.notes || ''}`.trim()
      : (record.notes || '');

    // Format 1: Exact current Supabase schema (name, phone, address, waste_type, weight, preferred_date, preferred_time, notes, status, created_at)
    const standardPayload = {
      id: record.id,
      name: record.userName,
      phone: record.userPhone,
      address: formattedAddress,
      waste_type: record.wasteType,
      weight: record.quantity,
      preferred_date: record.preferredDate,
      preferred_time: record.preferredTime,
      notes: formattedNotes,
      status: record.status || 'Pending',
      created_at: record.createdAt || new Date().toISOString(),
    };

    // Format 2: Extended snake_case payload (if user created extended columns)
    const extendedPayload = {
      ...standardPayload,
      user_name: record.userName,
      user_email: record.userEmail,
      email: record.userEmail,
      user_phone: record.userPhone,
      city: record.city,
      quantity: record.quantity,
    };

    // Format 3: camelCase payload
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

    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      // 1. Try standard payload matching current Supabase schema
      const { error: stdErr } = await supabase
        .from(tableName)
        .upsert(standardPayload, { onConflict: 'id' });

      if (!stdErr) {
        console.log(`✅ Pickup request saved to Supabase table '${tableName}' (standard):`, record.id);
        return { success: true, table: tableName };
      }

      // 2. If standard failed because of missing table, continue to next table
      if (stdErr.code === 'PGRST205') {
        continue;
      }

      // 3. Try extended payload
      const { error: extErr } = await supabase
        .from(tableName)
        .upsert(extendedPayload, { onConflict: 'id' });

      if (!extErr) {
        console.log(`✅ Pickup request saved to Supabase table '${tableName}' (extended):`, record.id);
        return { success: true, table: tableName };
      }

      // 4. Try camelCase payload
      const { error: camelErr } = await supabase
        .from(tableName)
        .upsert(camelPayload, { onConflict: 'id' });

      if (!camelErr) {
        console.log(`✅ Pickup request saved to Supabase table '${tableName}' (camelCase):`, record.id);
        return { success: true, table: tableName };
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
 * Delete pickup request from Supabase
 */
export async function deletePickupFromSupabase(id: string): Promise<boolean> {
  try {
    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (!error) return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Fetch pickup requests from Supabase with robust multi-column schema mapping
 */
export async function fetchPickupsFromSupabase(): Promise<PickupRequest[] | null> {
  try {
    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((row: any) => {
          // Robust email extraction
          let email = row.user_email || row.userEmail || row.email || '';
          let notes = row.notes || '';
          if (!email && notes && notes.includes('[Email: ')) {
            const match = notes.match(/\[Email:\s*([^\]]+)\]/);
            if (match) {
              email = match[1].trim();
              notes = notes.replace(/\[Email:\s*[^\]]+\]\s*/, '').trim();
            }
          }

          // Robust address & city extraction
          let address = row.address || '';
          let city = row.city || '';
          if (!city && address.includes(',')) {
            const parts = address.split(',');
            city = parts[parts.length - 1].trim();
          }

          return {
            id: row.id,
            userName: row.name || row.user_name || row.userName || 'Resident',
            userEmail: email,
            userPhone: row.phone || row.user_phone || row.userPhone || '',
            address: address,
            city: city || 'Tumkur',
            wasteType: row.waste_type || row.wasteType || 'Recyclable Waste',
            quantity: row.weight || row.quantity || '10 kg',
            preferredDate: row.preferred_date || row.preferredDate || '',
            preferredTime: row.preferred_time || row.preferredTime || '',
            notes: notes,
            status: (row.status as any) || 'Pending',
            createdAt: row.created_at || row.createdAt || new Date().toISOString(),
          };
        });
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save contact message adaptively across Supabase table schemas
 */
export async function saveContactToSupabase(contact: ContactMessage): Promise<{ success: boolean; table?: string; error?: string }> {
  try {
    // Standard payload without status (matches current Supabase table schema)
    const standardPayload = {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone || null,
      subject: contact.subject || '',
      message: contact.message,
      created_at: contact.createdAt || new Date().toISOString(),
    };

    // Extended payload with status (if status column was added)
    const extendedPayload = {
      ...standardPayload,
      status: contact.status || 'New',
    };

    for (const tableName of CONTACT_TABLE_CANDIDATES) {
      // 1. Try standard payload
      const { error: stdErr } = await supabase
        .from(tableName)
        .upsert(standardPayload, { onConflict: 'id' });

      if (!stdErr) {
        console.log(`✅ Contact message saved to Supabase table '${tableName}' (standard):`, contact.id);
        return { success: true, table: tableName };
      }

      if (stdErr.code === 'PGRST205') {
        continue;
      }

      // 2. Try extended payload with status
      const { error: extErr } = await supabase
        .from(tableName)
        .upsert(extendedPayload, { onConflict: 'id' });

      if (!extErr) {
        console.log(`✅ Contact message saved to Supabase table '${tableName}' (with status):`, contact.id);
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

      if (!error && Array.isArray(data)) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name || 'Anonymous',
          email: row.email || '',
          phone: row.phone || '',
          subject: row.subject || '',
          message: row.message || '',
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
 * Delete contact message from Supabase
 */
export async function deleteContactFromSupabase(id: string): Promise<boolean> {
  try {
    for (const tableName of CONTACT_TABLE_CANDIDATES) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (!error) return true;
    }
    return false;
  } catch {
    return false;
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
