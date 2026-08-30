import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FamilyInfoPrompt from "../components/FamilyFriends/FamilyInfoPrompt";
import FamilyGrid from "../components/FamilyFriends/FamilyGrid";
import { getSharedItems, type SharedItem } from "../services/family";


export default function FamilyShare() {

  const { ownerID: shareToken} = useParams();
  const [enteredInfo, setEnteredInfo] = useState(false)
  const [items, setItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enteredInfo || !shareToken) return;

    setLoading(true);
    getSharedItems(shareToken)
      .then(setItems)
      .catch(() => setLoading(true))
      .finally(() => setLoading(false));

  }, [enteredInfo, shareToken]);


  function loadItems() {
    if(!shareToken) return;
    setLoading(true);
    getSharedItems(shareToken)
      .then(setItems)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if(!enteredInfo) return;
    loadItems();
  }, [enteredInfo]);

  return (
    <div className = "h-[calc(100vh-70px)] bg-gray-100">

      {!enteredInfo ? (
        <div className = "h-full flex justify-center items-center"> 
          <FamilyInfoPrompt onComplete={() => setEnteredInfo(true)} shareToken={shareToken ?? ""}/>
        </div>
      ) : (
        
        <div className = "h-full overflow-auto">
          
          <div className="w-full max-w-7xl mx-auto pt-5 px-6 "> 
            
            <h1 className = "text-2xl font-bold text-[#1b2a4a]">
              Family & Friends Item List
            </h1>

            <div className="bg-white rounded-xl shadow-lg p-10 min-h-[calc(100vh-170px)]">
              {loading ? (
                <p> Loading items...</p>
              ) : error ? (
                <p className="text-red-500">Couldn't load items. Please refresh and try again.</p>
              ) : items.length === 0 ? (
                <p>No items have been shared yet.</p>
              ) : (
                <FamilyGrid items = {items} /> 
              )}
            </div>

          </div>

        </div>

      )}

    </div>
  );
}