import {supabase} from "../lib/supabaseClient"

export type ShareLinkResponse = {
    share_token: String;
};

export type SharedItem = {
    id: string;
    title: string; 
    image_url: string;
    interest_count: number;
    status: string;
};

export type OwnerItem = {
    id: string;
    title: string;
    image_url: string;
    date: string;
    interest_count: number;
    status: string;
    // add other fields as needed
}

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


export async function getSharedItems(shareToken: string): Promise<SharedItem[]> {
    const res = await fetch(`${API_BASE}/items/shared/${shareToken}`);

    if(!res.ok) {
        throw new Error(`Failed to load shared items: ${res.status}`)
    }

    return res.json();
}


export async function getFamilyView(): Promise<OwnerItem[]> {
    const res = await fetch(`${API_BASE}/items/family-view`, {
        headers: await authHeaders(),
    });

    if(!res.ok){
        throw new Error(`Failed to load shared items: ${res.status}`);
    }
    return res.json();
}

export async function claimInterest(itemId: string, familyFriendUserId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/item-interest/${itemId}/claim/${familyFriendUserId}`, {
        method: "PATCH",
        headers: await authHeaders(),   
    });

    if(!res.ok){
        throw new Error(`Failed to claim interest: ${res.status}`);
    }
}