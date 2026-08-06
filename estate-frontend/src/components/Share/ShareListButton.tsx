import { ShareIcon } from "@heroicons/react/24/outline";

type Prop = {
  onClick: () => void;
};


export default function ShareListButton({ onClick }: Prop) {
  return (
  <button
    onClick={onClick}
    className="inventory-button share-button"
  >
  <ShareIcon className="share-icon" />
    Share List
  </button>

  )



}