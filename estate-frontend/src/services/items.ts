import { supabase } from "../lib/supabaseClient";

export type ScanResponse = {
  item_id: string;
  ai_status: string;
  image_url: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

//verify requests once get_current_user is no longer a stub
async function authHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  return { Authorization: `Bearer ${session?.access_token ?? ""}` };
}


export async function scanItem(imageblob: blob): Promise<ScanResponse> {
  const formData = new FormData();
  formData.append("file", imageblob, "capture.jpg");

  const res = await fetch(`${API_BASE}/items/scan`, {
    method: "POST",
    headers: await authHeaders(),
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Scan failed: ${res.status}`);
  }
  return res.json();
}