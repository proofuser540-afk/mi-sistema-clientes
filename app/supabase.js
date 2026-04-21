import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xkpymziygiujirvwmvvo.supabase.co'
const supabaseKey = 'sb_publishable_CuuMXp7g9Re6532hhWXn5w_GzFqFuPa'

export const supabase = createClient(supabaseUrl, supabaseKey)