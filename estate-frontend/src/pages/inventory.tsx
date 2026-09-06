import { PlusIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getShareLink } from "../services/family";
import InvenTable from "../components/Inventory/InvenTable";
import ShareLinkCopied from "../components/Share/ShareLinkCopied"
import ShareListButton from "../components/Share/ShareListButton"
import SharePopup from "../components/Share/SharePopup"
import ReviewToast from "../components/ReviewToast"
import { useState, useRef, useEffect } from "react";
import EbayListingToast from "../components/EbayListingToast" 


export default function Inventory() {
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareLinkError, setShareLinkError] = useState(false);
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);
  const copyTimeout = useRef<number | null>(null);
  const [showEbayToast, setShowEbayToast] = useState(false);
  const ebayToastTimeout = useRef<number | null>(null);

  function showEbayListingToast() {
    setShowEbayToast(true);

  
    if (ebayToastTimeout.current) {
      clearTimeout(ebayToastTimeout.current)
    }

    ebayToastTimeout.current = window.setTimeout(() => {
      setShowEbayToast(false);
    }, 4500);
  }
  

  useEffect(() => {
    getShareLink()
      .then(({share_token}) => {
        setShareUrl(`${window.location.origin}/estateItemsF&F/${share_token}`);
      })
      .catch(() => {
        setShareLinkError(true);
      });
   
  }, []);


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

  function loadShareLink() {
    setShareLinkError(false);
    getShareLink()
      .then(({share_token}) => {
        setShareUrl(`${window.location.origin}/estateItemsF&F/${share_token}`);
      })
      .catch(() => {
        setShareLinkError(true);
      });
  }

  useEffect(() => {
    loadShareLink();
  }, []);


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

      <InvenTable onEbayListingSuccess={showEbayListingToast} />

      <ReviewToast show = {showSavedToast} />
      <EbayListingToast show = {showEbayToast} />
      <SharePopup 
        show = {showSharePopup} 
        shareUrl={shareUrl} 
        shareLinkError={shareLinkError}
        onClose={() => {
          setShowSharePopup(false)
          setShowCopiedPopup(false);

          if (copyTimeout.current) {
            clearTimeout(copyTimeout.current);
          }
        }}
        onCopy={copyShareLink} 
        onRetry={loadShareLink}
        />

    </div>
  );
}