import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ljiggtkyvccdjvvwuutc.supabase.co' // Cole sua URL aqui
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqaWdndGt5dmNjZGp2dnd1dXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMzQ1ODMsImV4cCI6MjA2NTYxMDU4M30.rgxVAljmcXLUNmuHHlkkfU_3pd53xTjmvZ8ztKtFge4'   // Cole sua chave 'anon' aqui

export const supabase = createClient(supabaseUrl, supabaseKey)
