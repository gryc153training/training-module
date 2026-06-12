import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://xpplmanrafhklxazrafp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwcGxtYW5yYWZoa2x4YXpyYWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTUzNzEsImV4cCI6MjA4ODY3MTM3MX0.-jDDI9eoHKBAWgGzi8WyuAWsrPnE-cRwP6unqPAR3hA';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});