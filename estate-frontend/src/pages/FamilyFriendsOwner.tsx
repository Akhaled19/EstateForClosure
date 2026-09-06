import { useState, useEffect } from "react";
import { getFamilyView, claimInterest, type OwnerItem } from "../services/family";
import FamilyOwnerTable from "../components/FamilyFriends/FamilyOwnerTable";
import FamilyViewPopup from "../components/FamilyFriends/FamilyViewPopup";


type InterestedPerson = {
  id: string;
  item_id: string;
  family_friend_user_id: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;


export default function FamilyFriends() {
  const [items, setItems] = useState<OwnerItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedItem, setSelectedItem] = useState<OwnerItem | null>(null);
  const [interestedPeople, setInterestedPeople] = useState<InterestedPerson[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);

  useEffect(() => {
    getFamilyView()
      .then(setItems)
      .catch((err) => console.log("Failed to load items", err))
      .finally(() => setLoadingItems(false))
  })

  async function viewItem( item: OwnerItem) {
    setSelectedItem(item);
    setLoadingPeople(true);

    try {
      const response = await fetch(`${API_BASE}/item-interest/${item.id}`);
    
      if (!response.ok) {
        throw new Error("Failed to fetch interested people");
      }

      const people = await response.json();
      setInterestedPeople(people);

    } catch (error) {
        console.error("Error fetching interested people:", error);
        setInterestedPeople([]);

    } finally {
        setLoadingPeople(false);
    }
  }

  async function handleClaim(familyFriendUserId: string){
    if(!selectedItem) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to give this item to this person? Everyone else who expressed interest will be marked as not selected."
    );

    if(!confirmed) return;

    try {
      await claimInterest(selectedItem.id, familyFriendUserId);
      await viewItem(selectedItem);  // refetch to show updated claimed/rejected states

    } catch (err) {
      alert("Couldn't claim this interest. Please try again.");
    }
  }

  return (
    <div className = "h-full overflow-auto bg-gray-100">
      <div className = "w-full max-w-7xl mx-auto pt-5 px-6 "> 
        <h1 className = "text-2xl font-bold text-[#1b2a4a]">
          Family & Friends Item List
        </h1>

        <p className = "mb-6 mt-3">
         Owner's View
         </p>

        <div className = "family-owner-view-container shadow-lg rounded-xl">
          {loadingItems ? (
            <p>Loading items...</p>
          ) : (
            <FamilyOwnerTable items={items} onView={viewItem} />
          )}
        </div>
      </div> 

      {selectedItem && (
        <FamilyViewPopup
          itemTitle={selectedItem.title}
          itemImage={selectedItem.image_url}
          date={selectedItem.date}
          status={selectedItem.status as "Unclaimed" | "Claimed"}
          people={interestedPeople}
          loading={loadingPeople}
          onClose={() => {
            setSelectedItem(null)
            setInterestedPeople([])
          }}
          onClaim={handleClaim}
        />
      )}

    </div>
  )
}
