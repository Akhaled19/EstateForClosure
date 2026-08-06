import { ChevronDownIcon } from "@heroicons/react/24/outline";



type Item = {
  id: string;
  title: string;
  description: string;
  status: string;
  date: string;
  sharedWithFamily: boolean;
};

type Property = {
  item: Item;
  openDropdown: string | null;
  setOpenDropdown: (v: string | null) => void;
  toggleFamilyShare: (id: string) => void;
};

export default function InvenRows({item, openDropdown, setOpenDropdown, toggleFamilyShare}: Property) {

  const showActions = (openDropdown === item.id);
  
  return (
    <>
      <tr className = "table-row border-t border-gray-200">

        <td className = "p-4">
          <div className = "relative">

            <button 
              onClick = {() => setOpenDropdown(showActions ? null : item.id) }
              className="px-3 py-2 bg-gray-300 rounded-full cursor-pointer">
            
            <ChevronDownIcon className="w-4 h-4 ml-0.5" />
            </button>

            {showActions && (
              <div className = "absolute mt-1 w-max min-w-32 bg-white rounded-xl shadow-xl border border-gray-400 z-50">
                
                <button className = "actions-buttons"> 
                  Edit
                </button>

                <button 
                  className = "actions-buttons" 
                  onClick = {() => {
                    toggleFamilyShare(item.id);
                    setOpenDropdown(null);
                  }}
                >
                  {item.sharedWithFamily ? "Unshare from F&F" : "Share to F&F"}
                </button>

                <button className = "actions-buttons">
                  Create listing
                </button>

                <button className = "actions-buttons">
                  Delete
                </button>
                
              </div>
            )}

          </div>
        </td>




        <td className = "p-4">

          <div className = "flex items-center gap-4"> 
            
            <div className = "w-16 h-16 bg-gray-300 rounded-xl shrink-0"> </div>


            <div className = "font-bold whitespace-nowrap text-[#1b2a4a]"> {item.title} </div>

          </div>

        </td>

        <td className = "p-4 text-[#1b2a4a]"> {item.status} </td>


      </tr>
    


    </>

  );
}