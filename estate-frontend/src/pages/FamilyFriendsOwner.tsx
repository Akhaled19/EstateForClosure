import { useState } from "react";
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



const mockOwnerItems = [
  {
    id: "1",
    title: "Couch",
    image_url: "/temp-couch.avif",
    date: "06/24/2026",
    status: "Unclaimed" as const,
    interest_count: 3,
  },
  {
    id: "2",
    title: "Mattress",
    image_url: "",
    date: "06/28/2026",
    status: "Claimed" as const,
    interest_count: 0,
  },
    {
    id: "3",
    title: "Wooden chair",
    image_url: "",
    date: "07/2/2026",
    status: "Claimed" as const,
    interest_count: 3,
  },
    {
    id: "4",
    title: "Table",
    image_url: "",
    date: "07/3/2026",
    status: "Claimed" as const,
    interest_count: 0,
  },
    {
    id: "5",
    title: "Vase",
    image_url: "",
    date: "07/5/2026",
    status: "Claimed" as const,
    interest_count: 1,
  },
];

export default function FamilyFriends() {
  const [selectedItem, setSelectedItem] = useState<typeof mockOwnerItems[0] | null>(null);
  const [interestedPeople, setInterestedPeople] = useState<InterestedPerson[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);

  async function viewItem( item: typeof mockOwnerItems[0]) {
    setSelectedItem(item);
    setLoadingPeople(true);

    try {
      const response = await fetch(`http://localhost:8000/item-interest/${item.id}`);
    

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
          <FamilyOwnerTable items={mockOwnerItems} onView = {viewItem} />
        </div>

      </div> 

      {selectedItem && (
        <FamilyViewPopup
          itemTitle={selectedItem.title}
          itemImage={selectedItem.image_url}
          date={selectedItem.date}
          status={selectedItem.status}
          people={interestedPeople}
          loading={loadingPeople}
          onClose={() => {
            setSelectedItem(null)
            setInterestedPeople([])
          }}
        />
      )}

    </div>
  )
}
