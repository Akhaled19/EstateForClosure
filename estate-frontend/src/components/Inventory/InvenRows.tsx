import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { Item, Status } from "./InvenTable"




type Property = {
  item: Item;
  openDropdown: string | null;
  setOpenDropdown: (v: string | null) => void;
  toggleFamilyShare: (id: string) => void;
  updateItemStatus: (id: string, status: Status) => void;
};

export default function InvenRows({item, openDropdown, setOpenDropdown, toggleFamilyShare, updateItemStatus}: Property) {
  
  const showActions = (openDropdown === item.id);
  const [listing, setListing] = useState(false);

  async function createEbayListing(itemId: string) {
    try {
      setListing(true);

      const response = await fetch(`http://localhost:8000/ebay/list/${itemId}`, {method: "POST"});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create eBay listing");
      }
      console.log("eBay listing created:", data);
      updateItemStatus(itemId, "Listed");
      return data;
    } catch (error) {
      console.error("eBay listing failed:", error);
      return null;
    } finally {
      setListing(false);
    }
  }


  
  return (
    <>
      <tr className = "table-row border-t border-gray-200">

        <td className = "p-4">
          <div className = "relative">

            <button 
              onClick = {() => setOpenDropdown(showActions ? null : item.id) }
              className="px-3 py-2 bg-gray-300 rounded-full cursor-pointer">
            
            <ChevronDownIcon className="w-4 h-4 ml-0.5" />
            </button>

            {showActions && (
              <div className = "absolute mt-1 w-max min-w-32 bg-white rounded-xl shadow-xl border border-gray-400 z-50">
                
                <button className = "actions-buttons"> 
                  Edit
                </button>

                <button 
                  className = "actions-buttons" 
                  onClick = {() => {
                    toggleFamilyShare(item.id);
                    setOpenDropdown(null);
                  }}
                >
                  {item.sharedWithFamily ? "Unshare from F&F" : "Share to F&F"}
                </button>

                <button 
                  className = "actions-buttons"
                  onClick = {async () => { 
                    const data = await createEbayListing(item.id);
                    setOpenDropdown(null);

                    if (data) {
                      console.log("Listing ID:", data.ebay_listing_id);
                    }
                  }}
                  disabled = {listing}
                >
                  { listing ? "Creating listing..." : "Create eBay Listing" }
                </button>

                <button className = "actions-buttons">
                  Delete
                </button>
                
              </div>
            )}

          </div>
        </td>




        <td className = "p-4">

          <div className = "flex items-center gap-4"> 
            
            <div className = "w-16 h-16 bg-gray-300 rounded-xl shrink-0"> </div> 

            <div className = "min-w-0 flex-1"> 
              <div className = "font-bold truncate max-w-[300px] text-[#1b2a4a] text-sm" title = {item.title}> {item.title} </div>
            
              <div className = "text-sm text-gray-500 mt-1"> Added on {item.date}</div>
            </div>

          </div>

        </td>

        <td className = "p-4 text-[#1b2a4a]"> {item.status} </td>


      </tr>
    


    </>

  );
}