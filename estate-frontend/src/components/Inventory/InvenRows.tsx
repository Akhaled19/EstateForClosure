import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import type { Item, Status } from "./InvenTable"
import EbayAspects from "../EbayAspects";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";



type EbayToastType = "success" | "error";

type Property = {
  item: Item;
  openDropdown: string | null;
  setOpenDropdown: (v: string | null) => void;
  toggleFamilyShare: (id: string) => void;
  updateItemStatus: (id: string, status: Status) => void;
  onEbayToast: (message: string, type: EbayToastType) => void;
};

export default function InvenRows({item, openDropdown, setOpenDropdown, toggleFamilyShare, updateItemStatus, onEbayToast}: Property) {
  
  const showActions = (openDropdown === item.id);
  const [listing, setListing] = useState(false);
  const [showEbayAgreement, setShowEbayAgreement] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showEbayAspects, setShowEbayAspects] = useState(false);
  const [missingAspects, setMissingAspects] = useState<any[]>([]);
  const [ebayAspectValues, setEbayAspectValues] = useState<Record<string, string[]>>({});
  const [ebayAspectErrors, setEbayAspectErrors] = useState("");

  async function createEbayListing(itemId: string) {
    try {
      setListing(true);

      const response = await fetch(`http://localhost:8000/ebay/list/${itemId}`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aspects: ebayAspectValues }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create eBay listing");
      }
      console.log("eBay listing created:", data);
      updateItemStatus(itemId, "Listed");
      return data;
    } catch (error) {
      console.error("eBay listing failed:", error);

      onEbayToast(error instanceof Error ? error.message : "Failed to create eBay Listing", "error");
      return null;
    } finally {
      setListing(false);
    }
  }

  async function cancelEbayListing(itemId: string) {
    try {
      setListing(true);

      const response = await fetch(`http://localhost:8000/ebay/list/${itemId}`, {method: "DELETE"});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to cancel eBay Listing");
      }
      console.log("Cancelled ebay listing:", data);
      updateItemStatus(itemId, "Unlisted");
      return data;

    } catch (error) {
      console.error("eBay listing cancellation failed:", error);
      return null;
    } finally {
      setListing(false);
    }
  }

  async function openEbayAgreement() {
    setOpenDropdown(null);

    try {
      const response = await fetch(`http://localhost:8000/ebay/list/${item.id}/requirements`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get eBay requirements");
      }

      setMissingAspects(data.missing_aspects);
      if (data.missing_aspects.length > 0) {
        setShowEbayAspects(true);
      } else {
        setShowEbayAgreement(true);
      }

    } catch (error) {
      console.error("Failed to get eBay requirements:", error);

      onEbayToast(
        error instanceof Error ? error.message : "Failed to get eBay requirements", "error");
    }
  }

  function openConfirmCancel() {
    setOpenDropdown(null);
    setShowConfirmCancel(true);
  }

  async function agreedToEbayListing() {
    setShowEbayAgreement(false);
    const data = await createEbayListing(item.id);

    if (data) {
      console.log("Listing ID:", data.ebay_listing_id);

      onEbayToast("Item successfully listed on eBay!", "success");
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

                {item.status === "Listed" ? (
                  <button
                    className = "actions-buttons"
                    onClick={openConfirmCancel}
                    disabled = {listing}
                  > 
                    {listing ? "Cancelling listing..." : "Cancel eBay Listing"}
                  </button>
                ) : (
                  <button
                    className = "actions-buttons"
                    onClick={openEbayAgreement}
                    disabled={listing}
                  > 
                    {listing ? "Creating listing..." : "Create eBay Listing"}
                  </button>
                )
                  
                }

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



      {showEbayAgreement && (
        <tr>
          <td colSpan={3}>
            <div className = "fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"> 
              <div className = "bg-white rounded-xl shadow-xl w-full max-w-lg p-6"> 
                
                <p className = "text-gray-500 mb-4"> 
                  By continuing, you agree to comply to eBay's terms and conditions 
                  and by clicking "Agree & Create Listing" you will create a 
                  public eBay listing for your item and make it available for purchases. 
                </p>

                <div className = "flex justify-end gap-3">

                  <button 
                    className = "px-4 py-2 rounded-lg border border-gray-500 hover:opacity-90"
                    onClick = {() => setShowEbayAgreement(false)}
                    disabled={listing}
                  >
                    Cancel
                  </button>

                  <button
                    className = "px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
                    onClick={agreedToEbayListing}
                    disabled={listing}
                  >
                    {listing ? "Creating listing..." : "Agree & Create Listing"}
                  </button>

                </div>

              </div>

            </div> 
          </td>
        </tr>
      )}



      {showEbayAspects && (
        <tr>
          <td colSpan={3}>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
              
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

                <p className="text-gray-500 mb-6 review-warning flex items-start gap-2 text-sm">
                  <ExclamationCircleIcon className = "w-6 h-6 shrink-0"/>
                  eBay requires additional information in order to list the item. Please fill in any missing information.
                </p>

                <EbayAspects 
                  missingAspects = {missingAspects}
                  onAspectsChange = {setEbayAspectValues}
                />
                {ebayAspectErrors && (
                  <p className = "text-sm review-warning flex items-start gap-2 !mt-4"> 
                  <ExclamationCircleIcon className = "w-6 h-6 shrink-0"/>
                  {ebayAspectErrors} 
                  </p>
                )}

                <div className="flex justify-end gap-3 mt-6">

                  <button
                    className="px-4 py-2 rounded-lg border border-gray-500 hover:opacity-90"
                    onClick={() => setShowEbayAspects(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
                    onClick={() => {
                      const missingValues = missingAspects.some((aspect) =>
                        !ebayAspectValues[aspect.name] || ebayAspectValues[aspect.name].length === 0 || ebayAspectValues[aspect.name][0].trim() === ""
                      );
                      
                      if (missingValues) {
                        setEbayAspectErrors("Please fill in all required fields before continuing.");
                        return;
                      }
                      setEbayAspectErrors("");
                      setShowEbayAspects(false);
                      setShowEbayAgreement(true);
                    }}
                  >
                    Continue
                  </button>

                </div>

              </div>

            </div>
          </td>
        </tr>
      )}



      {showConfirmCancel && (
        <tr>
          <td colSpan = {3}>
            <div className = "fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"> 
              <div className = "bg-white rounded-xl shadow-xl w-full max-w-lg p-6"> 
                
                <p className = "text-gray-500 mb-4"> 
                  Are you sure you want to cancel this eBay listing? 
                  By cancelling you agree to end the listing for your item
                  and make it no longer available for purchase.
                </p>

                <div className = "flex justify-end gap-3"> 

                  <button
                    className = "px-4 py-2 rounded-lg border border-gray-500 hover:opacity-90"
                    onClick={() => setShowConfirmCancel(false)}
                    disabled={listing}
                  >
                    No
                  </button>

                  <button
                    className = "px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
                    onClick = {async () => {
                      setShowConfirmCancel(false);
                      const data = await cancelEbayListing(item.id);
                      if (data) {
                        console.log("eBay listing successfully cancelled!")

                        onEbayToast("eBay listing successfully cancelled!", "success");
                      }
                    }}
                    disabled = {listing}
                  >
                    {listing ? "Cancelling listing..." : "Yes, Cancel Listing"}
                  </button>

                </div>

              </div>
            
            </div>
          </td>
        </tr>
      )}


    


    </>

  );
}