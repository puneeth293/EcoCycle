import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PickupRequest, ContactMessage, EnvironmentalReportRecord } from '../types';

export const SUPABASE_CONFIG = {
  projectId: 'angabwovocwptexemdvd',
  url:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    'https://angabwovocwptexemdvd.supabase.co',
  anonKey:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
    'sb_publishable_AqDD9m56dOjBXBuJ-kZ21A_2aUCx8NV',
  sqlEditorUrl: 'https://supabase.com/dashboard/project/angabwovocwptexemdvd/sql/new',
  tableEditorUrl: 'https://supabase.com/dashboard/project/angabwovocwptexemdvd/editor',
};

// Global Supabase client singleton
export const supabase: SupabaseClient = createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

const PICKUP_TABLE_CANDIDATES = [
  'pickup_requests',
  'pickuprequests',
  'pickup_request',
  'pickuprequest',
  'pickups',
  'pickup',
];

const CONTACT_TABLE_CANDIDATES = [
  'contact_messages',
  'contactmessages',
  'contact_message',
  'contactmessage',
  'contacts',
  'contact',
];

const WASTE_REPORT_TABLE_CANDIDATES = [
  'waste_reports',
  'environmental_reports',
  'waste_pollution_reports',
  'reports',
];

export const SUPABASE_SQL_SETUP = `-- =================================================================
-- RECYNOVA SUPABASE DATABASE SETUP & RLS SCRIPT
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/angabwovocwptexemdvd/sql/new
-- =================================================================

-- 1. Create Waste & Pollution Reports Table (Upload Waste & Report Pollution)
CREATE TABLE IF NOT EXISTS public.waste_reports (
    id TEXT PRIMARY KEY,
    report_type TEXT NOT NULL,
    detected_title TEXT NOT NULL,
    category_or_domain TEXT NOT NULL,
    bin_color TEXT,
    bin_name TEXT,
    confidence_score INTEGER,
    severity_level TEXT,
    source_of_pollution TEXT,
    aqi_impact TEXT,
    contaminants_identified JSONB,
    condition_notes TEXT,
    action_steps JSONB,
    remedial_advice TEXT,
    points_awarded INTEGER,
    co2_saved_kg NUMERIC,
    ticket_id TEXT,
    location TEXT,
    user_note TEXT,
    user_name TEXT,
    user_email TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Pickup Requests Table (Schedule Online Waste Pickup)
CREATE TABLE IF NOT EXISTS public.pickup_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    waste_type TEXT NOT NULL,
    weight TEXT NOT NULL,
    preferred_date TEXT,
    preferred_time TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Contact Messages Table (Contact Recynova Support)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.waste_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 5. Clean existing policies if re-running
DROP POLICY IF EXISTS "Allow public select waste_reports" ON public.waste_reports;
DROP POLICY IF EXISTS "Allow public insert waste_reports" ON public.waste_reports;
DROP POLICY IF EXISTS "Allow public update waste_reports" ON public.waste_reports;
DROP POLICY IF EXISTS "Allow public delete waste_reports" ON public.waste_reports;

DROP POLICY IF EXISTS "Allow public select pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public insert pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public update pickup_requests" ON public.pickup_requests;
DROP POLICY IF EXISTS "Allow public delete pickup_requests" ON public.pickup_requests;

DROP POLICY IF EXISTS "Allow public select contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public update contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public delete contact_messages" ON public.contact_messages;

-- 6. Waste Reports Policies
CREATE POLICY "Allow public select waste_reports" ON public.waste_reports
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert waste_reports" ON public.waste_reports
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update waste_reports" ON public.waste_reports
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete waste_reports" ON public.waste_reports
    FOR DELETE TO anon, authenticated USING (true);

-- 7. Pickup Requests Policies
CREATE POLICY "Allow public select pickup_requests" ON public.pickup_requests
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert pickup_requests" ON public.pickup_requests
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update pickup_requests" ON public.pickup_requests
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete pickup_requests" ON public.pickup_requests
    FOR DELETE TO anon, authenticated USING (true);

-- 8. Contact Messages Policies
CREATE POLICY "Allow public select contact_messages" ON public.contact_messages
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert contact_messages" ON public.contact_messages
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update contact_messages" ON public.contact_messages
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete contact_messages" ON public.contact_messages
    FOR DELETE TO anon, authenticated USING (true);
`;

// ==========================================
// WASTE & POLLUTION REPORTS OPERATIONS
// ==========================================

export async function saveWasteReportToSupabase(
  report: EnvironmentalReportRecord & { userNote?: string; userName?: string; userEmail?: string }
): Promise<{ success: boolean; table?: string; error?: string }> {
  try {
    const standardPayload = {
      id: report.id,
      report_type: report.reportType,
      detected_title: report.detectedTitle,
      category_or_domain: report.categoryOrDomain,
      bin_color: report.binColor || null,
      bin_name: report.binName || null,
      confidence_score: report.confidenceScore ?? 95,
      severity_level: report.severityLevel || 'Low',
      source_of_pollution: report.sourceOfPollution || null,
      aqi_impact: report.aqiImpact || null,
      contaminants_identified: report.contaminantsIdentified || [],
      condition_notes: report.conditionNotes || '',
      action_steps: report.actionSteps || [],
      remedial_advice: report.remedialAdvice || '',
      points_awarded: report.pointsAwarded ?? 0,
      co2_saved_kg: report.co2SavedKg ?? null,
      ticket_id: report.ticketId || null,
      location: report.location || null,
      user_note: report.userNote || null,
      user_name: report.userName || null,
      user_email: report.userEmail || null,
      image_url: report.imageUrl || null,
      created_at: new Date().toISOString(),
    };

    const minimalPayload = {
      id: report.id,
      report_type: report.reportType,
      detected_title: report.detectedTitle,
      category_or_domain: report.categoryOrDomain,
      bin_color: report.binColor || null,
      bin_name: report.binName || null,
      confidence_score: report.confidenceScore ?? 95,
      severity_level: report.severityLevel || 'Low',
      condition_notes: report.conditionNotes || '',
      remedial_advice: report.remedialAdvice || '',
      points_awarded: report.pointsAwarded ?? 0,
      ticket_id: report.ticketId || null,
      location: report.location || null,
      image_url: report.imageUrl || null,
      created_at: new Date().toISOString(),
    };

    for (const tableName of WASTE_REPORT_TABLE_CANDIDATES) {
      const { error: stdErr } = await supabase
        .from(tableName)
        .upsert(standardPayload, { onConflict: 'id' });

      if (!stdErr) {
        return { success: true, table: tableName };
      }

      if (stdErr.code === 'PGRST205') {
        continue;
      }

      const { error: minErr } = await supabase
        .from(tableName)
        .upsert(minimalPayload, { onConflict: 'id' });

      if (!minErr) {
        return { success: true, table: tableName };
      }
    }

    return {
      success: false,
      error: "Table 'waste_reports' not found in Supabase schema cache. Run the SQL schema in Supabase SQL editor.",
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

export async function fetchWasteReportsFromSupabase(): Promise<EnvironmentalReportRecord[] | null> {
  try {
    for (const tableName of WASTE_REPORT_TABLE_CANDIDATES) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((row: any) => ({
          id: row.id,
          reportType: row.report_type || row.reportType || 'waste',
          imageUrl: row.image_url || row.imageUrl || '',
          detectedTitle: row.detected_title || row.detectedTitle || 'Waste Report',
          categoryOrDomain: row.category_or_domain || row.categoryOrDomain || 'Recyclable Waste',
          binColor: row.bin_color || row.binColor || undefined,
          binName: row.bin_name || row.binName || undefined,
          confidenceScore: row.confidence_score ?? row.confidenceScore ?? 95,
          severityLevel: row.severity_level || row.severityLevel || 'Low',
          sourceOfPollution: row.source_of_pollution || row.sourceOfPollution || undefined,
          aqiImpact: row.aqi_impact || row.aqiImpact || undefined,
          contaminantsIdentified: Array.isArray(row.contaminants_identified) ? row.contaminants_identified : undefined,
          conditionNotes: row.condition_notes || row.conditionNotes || '',
          actionSteps: Array.isArray(row.action_steps) ? row.action_steps : [],
          remedialAdvice: row.remedial_advice || row.remedialAdvice || '',
          pointsAwarded: row.points_awarded ?? row.pointsAwarded ?? 0,
          co2SavedKg: row.co2_saved_kg !== null && row.co2_saved_kg !== undefined ? Number(row.co2_saved_kg) : undefined,
          ticketId: row.ticket_id || row.ticketId || undefined,
          timestamp: row.created_at ? String(row.created_at).split('T')[0] : new Date().toISOString().split('T')[0],
          location: row.location || undefined,
        }));
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteWasteReportFromSupabase(id: string): Promise<boolean> {
  try {
    for (const tableName of WASTE_REPORT_TABLE_CANDIDATES) {
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

// ==========================================
// PICKUP REQUESTS OPERATIONS
// ==========================================

export async function savePickupToSupabase(record: PickupRequest): Promise<{ success: boolean; table?: string; error?: string }> {
  try {
    const formattedAddress =
      record.city && !record.address.toLowerCase().includes(record.city.toLowerCase())
        ? `${record.address}, ${record.city}`
        : record.address;

    const emailNoteTag = record.userEmail ? `[Email: ${record.userEmail}]` : '';
    const formattedNotes = emailNoteTag
      ? `${emailNoteTag} ${record.notes || ''}`.trim()
      : record.notes || '';

    const fullPayload = {
      id: record.id,
      name: record.userName,
      email: record.userEmail || '',
      phone: record.userPhone,
      address: formattedAddress,
      city: record.city || '',
      waste_type: record.wasteType,
      weight: record.quantity,
      preferred_date: record.preferredDate,
      preferred_time: record.preferredTime,
      notes: record.notes || '',
      status: record.status || 'Pending',
      created_at: record.createdAt || new Date().toISOString(),
    };

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

    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      const { error: fullErr } = await supabase
        .from(tableName)
        .upsert(fullPayload, { onConflict: 'id' });

      if (!fullErr) {
        return { success: true, table: tableName };
      }

      if (fullErr.code === 'PGRST205') {
        continue;
      }

      const { error: stdErr } = await supabase
        .from(tableName)
        .upsert(standardPayload, { onConflict: 'id' });

      if (!stdErr) {
        return { success: true, table: tableName };
      }
    }

    return {
      success: false,
      error: "Table 'pickup_requests' not found in Supabase schema cache. Run the SQL schema in Supabase SQL editor.",
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

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

export async function fetchPickupsFromSupabase(): Promise<PickupRequest[] | null> {
  try {
    for (const tableName of PICKUP_TABLE_CANDIDATES) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((row: any) => {
          let email = row.user_email || row.userEmail || row.email || '';
          let notes = row.notes || '';
          if (!email && notes && notes.includes('[Email: ')) {
            const match = notes.match(/\[Email:\s*([^\]]+)\]/);
            if (match) {
              email = match[1].trim();
              notes = notes.replace(/\[Email:\s*[^\]]+\]\s*/, '').trim();
            }
          }

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
            address,
            city: city || 'Tumkur',
            wasteType: row.waste_type || row.wasteType || 'Recyclable Waste',
            quantity: row.weight || row.quantity || '10 kg',
            preferredDate: row.preferred_date || row.preferredDate || '',
            preferredTime: row.preferred_time || row.preferredTime || '',
            notes,
            status: row.status || 'Pending',
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

// ==========================================
// CONTACT MESSAGES OPERATIONS
// ==========================================

export async function saveContactToSupabase(contact: ContactMessage): Promise<{ success: boolean; table?: string; error?: string }> {
  try {
    const extendedPayload = {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone || null,
      subject: contact.subject || '',
      message: contact.message,
      status: contact.status || 'New',
      created_at: contact.createdAt || new Date().toISOString(),
    };

    const standardPayload = {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone || null,
      subject: contact.subject || '',
      message: contact.message,
      created_at: contact.createdAt || new Date().toISOString(),
    };

    for (const tableName of CONTACT_TABLE_CANDIDATES) {
      const { error: extErr } = await supabase
        .from(tableName)
        .upsert(extendedPayload, { onConflict: 'id' });

      if (!extErr) {
        return { success: true, table: tableName };
      }

      if (extErr.code === 'PGRST205') {
        continue;
      }

      const { error: stdErr } = await supabase
        .from(tableName)
        .upsert(standardPayload, { onConflict: 'id' });

      if (!stdErr) {
        return { success: true, table: tableName };
      }
    }

    return {
      success: false,
      error: "Table 'contact_messages' not found in Supabase schema cache. Run the SQL schema in Supabase SQL editor.",
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

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

// ==========================================
// HEALTH CHECK & BULK SYNC
// ==========================================

export async function checkSupabaseHealth(): Promise<{
  connected: boolean;
  projectId: string;
  url: string;
  wasteReportTableReady: boolean;
  pickupTableReady: boolean;
  contactTableReady: boolean;
  message: string;
}> {
  let wasteReportTableReady = false;
  let pickupTableReady = false;
  let contactTableReady = false;

  try {
    for (const table of WASTE_REPORT_TABLE_CANDIDATES) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (!error) {
        wasteReportTableReady = true;
        break;
      }
    }

    for (const table of PICKUP_TABLE_CANDIDATES) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (!error) {
        pickupTableReady = true;
        break;
      }
    }

    for (const table of CONTACT_TABLE_CANDIDATES) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (!error) {
        contactTableReady = true;
        break;
      }
    }

    const allReady = wasteReportTableReady && pickupTableReady && contactTableReady;
    return {
      connected: true,
      projectId: SUPABASE_CONFIG.projectId,
      url: SUPABASE_CONFIG.url,
      wasteReportTableReady,
      pickupTableReady,
      contactTableReady,
      message: allReady
        ? 'Connected & All Tables Active in Supabase!'
        : 'Supabase connected! Run the SQL setup script in SQL Editor to initialize missing tables.',
    };
  } catch (e: any) {
    return {
      connected: false,
      projectId: SUPABASE_CONFIG.projectId,
      url: SUPABASE_CONFIG.url,
      wasteReportTableReady: false,
      pickupTableReady: false,
      contactTableReady: false,
      message: e?.message || 'Unable to connect to Supabase endpoint',
    };
  }
}

export async function syncAllLocalDataToSupabase(
  pickups: PickupRequest[],
  contacts: ContactMessage[],
  wasteReports: EnvironmentalReportRecord[] = []
): Promise<{ syncedWasteReports: number; syncedPickups: number; syncedContacts: number }> {
  let syncedWasteReports = 0;
  let syncedPickups = 0;
  let syncedContacts = 0;

  for (const report of wasteReports) {
    const res = await saveWasteReportToSupabase(report);
    if (res.success) syncedWasteReports++;
  }

  for (const pickup of pickups) {
    const res = await savePickupToSupabase(pickup);
    if (res.success) syncedPickups++;
  }

  for (const contact of contacts) {
    const res = await saveContactToSupabase(contact);
    if (res.success) syncedContacts++;
  }

  return { syncedWasteReports, syncedPickups, syncedContacts };
}
