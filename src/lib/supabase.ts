import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uchnbnkzggyuxqwqdlyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjaG5ibmt6Z2d5dXhxd3FkbHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NTY3MjcsImV4cCI6MjA0NzAzMjcyN30.qT_PKUCuulQSFbfzv6EqkbgfGrMj65V80sl3cvwhmxw';

export const supabase = createClient(supabaseUrl, supabaseKey);