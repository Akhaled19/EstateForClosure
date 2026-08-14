import { PlusIcon } from "@heroicons/react/24/outline"
import { Link } from "react-router-dom";
import InvenTable from "../components/Inventory/InvenTable";

import ShareLinkCopied from "../components/Share/ShareLinkCopied"
import ShareListButton from "../components/Share/ShareListButton"
import SharePopup from "../components/Share/SharePopup"

import { useState, useRef } from "react";


export default function Inventory() {
  const [showSharePopup, setShowSharePopup] = useState(false);

  const ownerID = "1";
  const shareUrl = `${window.location.origin}/estateItemsF&F/${ownerID}`;

  const [showCopiedPopup, setShowCopiedPopup] = useState(false);
  const copyTimeout = useRef<number | null>(null);
  

  function copyShareLink() {
    navigator.clipboard.writeText(shareUrl);
    setShowCopiedPopup(true);

    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current);
    }

    copyTimeout.current = window.setTimeout(() => {
      setShowCopiedPopup(false);
    }, 4500);
  }


  return (
    <div className ="flex-1 px-10 pt-6 bg-gray-100 min-h-screen">

      <ShareLinkCopied show = {showCopiedPopup} />

      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">

        <div>

          <h1 className="text-2xl font-bold mb-2">
            Inventory
          </h1>

          <p className="text-gray-500">
            Manage all your items here.
          </p>

        </div>

        <div className = "flex gap-4"> 
          
          <ShareListButton onClick={() => setShowSharePopup(true)} />

          <Link
            to="/scan"
            className="inventory-button inven-scan-button"
          >
            <PlusIcon className="scan-icon" />
            <span className = "text-[#1b2a4a]"> Add Item </span>

          </Link>

        </div>


      </div>

      <InvenTable />


      <SharePopup 
        show = {showSharePopup} 
        shareUrl={shareUrl} 
        onClose={() => {
          setShowSharePopup(false)
          setShowCopiedPopup(false);

          if (copyTimeout.current) {
            clearTimeout(copyTimeout.current);
          }
        }}
        onCopy={copyShareLink} 
        />

    </div>
  );
}