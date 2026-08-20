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


export async function scanItem(imageblob: Blob): Promise<ScanResponse> {
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

export type ItemDetail = {
  id: string;
  is_finalized: boolean;
  status: string;
  image_url: string;
  title: string | null;
  description: string | null;
  category: string | null;
  condition: string | null;
  brand: string | null;
  dimensions: string | null;
  asking_price: number | null;
  ai_status: string | null;
  ai_title_suggestion: string | null;
  ai_description_draft: string | null;
  ai_category: string | null;
  ai_condition: string | null;
  ai_brand: string | null;
  ai_estimated_value_low: number | null;
  ai_estimated_value_high: number | null;
  ai_dimensions_estimate: string | null;
  ai_confidence: string | null;
  ai_error: string | null;
};

export async function getItem(itemId: string): Promise<ItemDetail> {
  const res = await fetch(`${API_BASE}/items/${itemId}`, {
    headers: await authHeaders(),
  });
  if(!res.ok){
    throw new Error(`Failed to load item: ${res.status}`);
  }
  return res.json();
}

export type ItemFinalizePayLoad = {
  title: string;
  description: string;
  category: string;
  condition: string;
  brand?: string;
  dimensions?: string;
  price: number
}

export async function finalizeItem(itemId: string, payload: ItemFinalizePayLoad): Promise<ItemDetail> {
  const res = await fetch(`${API_BASE}/items/${itemId}/finalize`, {
    method: "PATCH",
    headers : {
      ...(await authHeaders()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if(!res.ok) {
    throw new Error(`Failed to save item: ${res.status}`);
  }

  return res.json();
}