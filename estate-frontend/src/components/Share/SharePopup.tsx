import { XMarkIcon } from "@heroicons/react/24/outline";

type Prop = {
  show: boolean;
  shareUrl: string;
  onClose: () => void;
  onCopy: () => void;
};


export default function SharePopup({ show, shareUrl, onClose, onCopy }: Prop) { 
  if (!show) return null;

  return (
    <div className = "fixed inset-0 flex items-center justify-center bg-black/40 z-50">

      <div className = "relative bg-white rounded-xl shadow-xl p-6 w-[400px]">

        <button
          onClick={onClose}

          className = "absolute top-3 right-3 cursor-pointer"
        >

          <XMarkIcon className="w-6 h-6" />

        </button>

        <h2 className = "text-xl font-bold mb-3 text-[#1b2a4a]">
          Share List
        </h2>


        <p className = "text-[#d4621a] mb-4">
          Share this link to family & friends
        </p>


        <div className = "flex gap-2">

          <input
            value={shareUrl}
            readOnly
            className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
          />

          <button
            onClick={onCopy}
            className="copy-button"
          >
            Copy
          </button>

        </div>


      </div>

    </div>

  )

}