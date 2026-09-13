import { XMarkIcon } from "@heroicons/react/24/outline";

type Prop = {
  show: boolean;
  shareUrl: string;
  shareLinkError: boolean;
  onClose: () => void;
  onCopy: () => void;
  onRetry: () => void;
};


export default function SharePopup({ show, shareUrl, shareLinkError, onClose, onCopy, onRetry }: Prop) { 
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-[400px]">
        <button onClick={onClose} className="absolute top-3 right-3 cursor-pointer">
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-3 text-[#1b2a4a]">Share List</h2>

        {shareLinkError ? (
          <div>
            <p className="text-red-500 text-sm">
              Couldn't generate your share link. Please try again.
            </p>
            <button onClick={onRetry} className="copy-button">
              Try Again
            </button>
          </div>
        ) : !shareUrl ? (
          <p className="text-gray-500 text-sm">Generating your link...</p>
        ) : (
          <>
            <p className="text-[#d4621a] mb-4">Share this link to family & friends</p>
            <div className="flex gap-2">
              <input value={shareUrl} readOnly className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none" />
              <button onClick={onCopy} className="copy-button">
                Copy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}