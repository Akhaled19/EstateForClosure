type EbayConnectPopupProps = {
  onClose: () => void;
}

export default function EbayConnectPopup({onClose}: EbayConnectPopupProps) {
  return (
    <div className = "fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
        <div className = "bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        <h2 className = "font-bold text-lg text-[#1b2a4a] mb-3"> Connect your eBay account </h2>

        <p className = "text-gray-500 mb-4">
            You'll need to first connect your eBay account before you can publish this listing.
            We'll only use this to publish and manage your eBay listings.
        </p>

        <div className = "flex justify-end gap-3">

            <button
              className = "px-4 py-2 rounded-lg border border-gray-500 hover:opacity-90"
              onClick = {onClose}
            >
            Cancel
            </button>

            <button
              className = "px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
              onClick={() => {
                  window.open("http://localhost:8000/ebay/auth", "_blank");
              }}
            >
            Agree & Connect eBay Account
            </button>

        </div>

      </div>

    </div>
  );
}