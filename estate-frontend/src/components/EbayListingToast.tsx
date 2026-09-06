import { CheckIcon } from "@heroicons/react/24/outline";

type Props = {
  show: boolean;
};

export default function EbayListingToast({ show }: Props) {

  return (
    <div className = {`review-saved-toast ${show ? "show" : ""}`}>
      
      <div className = "flex items-center gap-3">
        
        <CheckIcon className = "w-6 h-6 text-green-600" />

        <div>
          <p className = "font-bold text-[#1b2a4a]">
            Item successfully listed on eBay!
          </p>
        </div>

      </div>

    </div>
  );
}