import { XMarkIcon } from "@heroicons/react/24/outline";


type InterestedPerson = {
    id: string;
    name: string;
    phone: string;
};

type Prop = {
    itemTitle: string;
    itemImage: string;
    date: string;
    status: "Unclaimed" | "Claimed";
    people: InterestedPerson[];
    loading: boolean;
    onClose: () => void;
};

export default function FamilyViewPopup({ itemTitle, itemImage, date, status, people, loading, onClose }: Prop) {

  return (
    <div className = "fixed inset-0 bg-black/40 flex items-center justify-center z-50"> 
        
        <div className = "relative bg-white rounded-xl shadow-xl w-full max-w-[470px] p-8 min-h-[510px]"> 

          <button onClick={onClose} className = "absolute top-3 right-3 cursor-pointer">
            <XMarkIcon className="w-7 h-7" />
          </button>

            <div className = "flex items-center gap-4 border-b border-gray-300 pb-5 "> 

              {itemImage ? (
                <img src={itemImage} alt={itemTitle} className = "w-20 h-20 object-cover rounded-lg shrink-0" />
              ) : (
                <div className = "w-20 h-20 bg-gray-200 rounded-lg shrink-0" />
              )}

              <div> 

                <p className = "text-[#1b2a4a] truncate max-w-[300px] font-['Inter','system-ui','sans-serif']"> {itemTitle} </p>
                <p className = "text-sm text-[#606060] mt-1 font-['Inter','system-ui','sans-serif']"> Added on {date} </p>
                <p className = "text-sm text-[#606060] mt-1 font-['Inter','system-ui','sans-serif']"> Status: {status} </p>
              
              </div>

            </div>

            <div className = "mt-6"> 
              <h3 className = "font-semibold text-[#d4621a] mb-3 font-['Inter','system-ui','sans-serif']"> 
                People Interested 
              </h3>

              {loading ? (
                <p className = "text-gray-500">
                  Loading...
                </p>
              ) : people.length === 0 ? (
                <p className = "text-gray-500">
                  Nobody expressed interested in this item.
                </p>
              ) : (
                <div className = "border border-gray-200 rounded-lg max-h-[250px] overflow-y-auto"> 
                    {people.map((person) => (
                      <div key = {person.id} className = "flex justify-between items-center px-4 py-4 border-b border-gray-200 last:border-b-0">
                        
                        <div>
                          <p className = "text-[14px] text-[#1b2a4a] font-['Inter','system-ui','sans-serif'] "> Name: {person.name} </p>
                          <p className = "text-[14px] text-[#1b2a4a] font-['Inter','system-ui','sans-serif'] "> Phone: {person.phone} </p>
                        </div> 

                        <button className = "px-4 py-2 rounded-full bg-[#1b2a4a] text-white cursor-pointer">
                          Claim
                        </button>

                      </div>
                    ))}
                </div>
              )}

            </div>

        </div>
    </div>
    
  
  );

}