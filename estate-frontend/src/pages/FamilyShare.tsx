import { useState } from "react";
import { useParams } from "react-router-dom";
import FamilyInfoPrompt from "../components/FamilyFriends/FamilyInfoPrompt";
import FamilyGrid from "../components/FamilyFriends/FamilyGrid";


const mockItems = [
  {
    id: "1",
    title: "Couch",
    image_url: "/temp-couch.avif",
    interest_count: 3,
    status: "Unclaimed!"
  },
  {
    id: "2",
    title: "Mattress",
    image_url: "",
    interest_count: 0,
    status: "Claimed!"
  },
  {
    id: "3",
    title: "Wooden chair",
    image_url: "",
    interest_count: 3,
    status: "Unclaimed!"
  },
  {
    id: "4",
    title: "Table",
    image_url: "",
    interest_count: 0,
    status: "Unclaimed!"
  },
  {
    id: "5",
    title: "Vase",
    image_url: "",
    interest_count: 1,
    status: "Unclaimed!"
  },
];




export default function FamilyShare() {

  const { ownerID } = useParams();
  const [enteredInfo, setEnteredInfo] = useState(() => localStorage.getItem("family_friend_user_id") !== null);

  return (
    <div className = "h-[calc(100vh-70px)] bg-gray-100">

      {!enteredInfo ? (
        <div className = "h-full flex justify-center items-center"> 
          <FamilyInfoPrompt onComplete={() => setEnteredInfo(true)}/>
        </div>
      ) : (
        
        <div className = "h-full overflow-auto">
          
          <div className="w-full max-w-7xl mx-auto pt-5 px-6 "> 
            
            <h1 className = "text-2xl font-bold text-[#1b2a4a]">
              Family & Friends Item List
            </h1>

            <p className = "mb-6 mt-3">
              Owner's ID: {ownerID}
            </p>

            <div className = "bg-white rounded-xl shadow-lg p-10 min-h-[calc(100vh-170px)]">
              <FamilyGrid items={mockItems} />
            </div>

          </div>

        </div>
        
      )}

    </div>
  );
}