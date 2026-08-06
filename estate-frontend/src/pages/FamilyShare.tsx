import { useState } from "react";
import { useParams } from "react-router-dom";
import FamilyInfoPrompt from "../components/FamilyFriends/FamilyInfoPrompt";
import FamilyGrid from "../components/FamilyFriends/FamilyGrid";


const mockItems = [
  {
    id: "1",
    title: "Samsung Class Crystal UHD U7900F 4K Smart TV",
    image_url: "",
    interest_count: 3,
    status: "Unclaimed!"
  },
  {
    id: "2",
    title: "Lofka Cloud Couch Sectional",
    image_url: "/temp-couch.avif",
    interest_count: 0,
    status: "Claimed!"
  },
  {
    id: "3",
    title: "Samsung Class Crystal UHD U7900F 4K Smart TV",
    image_url: "",
    interest_count: 3,
    status: "Unclaimed!"
  },
  {
    id: "4",
    title: "Lofka Cloud Couch Sectional",
    image_url: "",
    interest_count: 0,
    status: "Unclaimed!"
  },
  {
    id: "5",
    title: "Vizio Quantum 4K QLED HDR Smart TV",
    image_url: "",
    interest_count: 1,
    status: "Unclaimed!"
  },
  {
    id: "6",
    title: "Insignia Class F50 Series LED 4K UHD Smart Fire TV",
    image_url: "",
    interest_count: 0,
    status: "Claimed!"
  }
];


export default function FamilyShare() {

  const { ownerID } = useParams();
  const [enteredInfo, setEnteredInfo] = useState(false);

  return (
    <div className = "h-[calc(100vh-70px)] bg-gray-200">

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