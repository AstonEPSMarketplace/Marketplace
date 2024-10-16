import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ptgxoqishsatvhumlmzb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z3hvcWlzaHNhdHZodW1sbXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyOTU5MTksImV4cCI6MjA0Mzg3MTkxOX0.2rxqZLXYUICYJJczMSdJlAaFSAMkQC6cldA_8qakPpc'
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;