import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  show: boolean;
  message: string;
  type: "success" | "error";
};

export default function EbayListingToast({ show, message, type }: Props) {

  return (
    <div className = {`review-saved-toast ${show ? "show" : ""}`}>
      
      <div className = "flex items-center gap-3">
        {type === "success" ? (
          <CheckIcon className = "w-6 h-6 text-green-600" />
        ) : (
          <XMarkIcon className = "w-6 h-6 text-red-600" />
        )}

        <div>
          <p className = "font-bold text-[#1b2a4a]">
            {message}
          </p>
        </div>

      </div>

    </div>
  );
}