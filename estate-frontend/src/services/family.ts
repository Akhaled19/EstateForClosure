import {supabase} from "../lib/supabaseClient"

export type ShareLinkResponse = {
    share_token: String;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function authHeaders(): Promise<HeadersInit> {
    const {data : {session}} = await supabase.auth.getSession();
    return { Authorization: `Bearer ${session?.access_token ?? ""}`};
}

export async function getShareLink(): Promise<ShareLinkResponse> {
    const res = await fetch(`${API_BASE}/family-friend-users/share-link`, {
        headers: await authHeaders(),
    });

    if (!res.ok) {
        throw new Error(`Failed to load share link: ${res.status}`);
    }
    return res.json();
}