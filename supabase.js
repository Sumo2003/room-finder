import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://oqhbpjjekclrqfxfeyvz.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xaGJwampla2NscnFmeGZleXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODYzMzAsImV4cCI6MjA4NDA2MjMzMH0.a8s7SyHL9oPrHm_-hczo4t-ctVS2zNr5s8pgi2KwXLg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
