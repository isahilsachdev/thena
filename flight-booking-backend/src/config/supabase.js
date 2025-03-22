const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL || 'https://ufkghuwkefddufgiiaxu.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVma2dodXdrZWZkZHVmZ2lpYXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxOTkwNjIsImV4cCI6MjA1Nzc3NTA2Mn0.UbTFw4NKPvMaZrxeKpMex93YnjBEBHtij71zQ6GriWk';

if (!supabaseUrl || !supabaseKey) {
  logger.error('Supabase URL or key is missing in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true }
});

module.exports = supabase;
