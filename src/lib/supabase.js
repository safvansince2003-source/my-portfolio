
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.https://qhhqqzfbfeugeznjokgg.supabase.co/rest/v1/;
const supabaseAnonKey = process.env.sb_publishable_dBA8k9CBxjdsrKbboDmE5A_3_oIv1B4;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
