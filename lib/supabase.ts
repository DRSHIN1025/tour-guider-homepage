import { createClient } from '@supabase/supabase-js'

// Supabase 설정 - 환경변수 또는 fallback 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://etwukzreozrxdsaouyut.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0d3VrenJlb3pyeGRzYW91eXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyODc0NTYsImV4cCI6MjA1MDg2MzQ1Nn0.5xB7jYQaIrGPxDdZFKr0Wg-dF8gNqzXxOFPWGzJvKbY'

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase 