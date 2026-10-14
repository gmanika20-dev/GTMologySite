// Data store: Supabase when configured (production), local JSONL files in development.
import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let sb: SupabaseClient | null = null;
function supabase() {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  sb = sb ?? createClient(url, key, { auth: { persistSession: false } });
  return sb;
}

export const storeMode = () => (supabase() ? 'supabase' : 'local');

async function localInsert(table: string, row: Record<string, unknown>) {
  const dir = path.join(process.cwd(), '.data');
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(path.join(dir, `${table}.jsonl`), JSON.stringify(row) + '\n');
}

export async function insert(table: 'leads' | 'lab_sessions' | 'bookings' | 'email_log', row: Record<string, unknown>) {
  const id = (row.id as string) ?? crypto.randomUUID();
  const full = { id, created_at: new Date().toISOString(), ...row };
  const db = supabase();
  if (db) {
    const { error } = await db.from(table).upsert(full); // upsert: a Lab session can be saved more than once
    if (error) throw new Error(`${table}: ${error.message}`);
  } else if (process.env.NODE_ENV !== 'production') {
    await localInsert(table, full);
  } else {
    console.warn(`[store] Supabase not configured — ${table} row not persisted`, { id });
  }
  return id;
}

export async function upsertLead(lead: { email: string; name?: string; company?: string; website?: string; role?: string; company_stage?: string; industry?: string; utm?: Record<string, string>; consent_marketing?: boolean }) {
  const db = supabase();
  const row = { ...lead, email: lead.email.toLowerCase(), updated_at: new Date().toISOString() };
  if (db) {
    const { data, error } = await db.from('leads').upsert(row, { onConflict: 'email' }).select('id').single();
    if (error) throw new Error(`leads: ${error.message}`);
    return data.id as string;
  }
  return insert('leads', row);
}
