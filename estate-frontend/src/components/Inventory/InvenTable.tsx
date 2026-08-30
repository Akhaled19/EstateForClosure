import { useState } from "react";
import InvenRows from "./InvenRows";
import InvenSearch from "./InvenSearch";


export type Status = "Unlisted" | "Listed" | "Sold" | "Shipped";

export type Item = {
  id: string;
  title: string;
  description: string;
  status: Status;
  date: string;
  sharedWithFamily: boolean;
};

  const items: Item[] = [
    {
      id: "1",
      title: 'Couch',
      description:
        "Good condition, minor wear on the armrests. Seats three comfortably.",
      status: "Unlisted",
      date: "06/24/2026",
      sharedWithFamily: false,
    },
    {
      id: "2",
      title: "Mattress",
      description:
        "Decent condition, minor wear. Provides comfortable sleep.",
      status: "Listed",
      date: "06/28/2026",
      sharedWithFamily: true,
    },
    {
      id: "3",
      title: "Wooden chair",
      description: "Wooden chair in mild condition, partial minor scratches on the surface.",
      status: "Listed",
      date: "07/2/2026",
      sharedWithFamily: true,
    },
    {
      id: "4",
      title: "Table",
      description: "Table in good condition, minor scratches on the surface.",
      status: "Shipped",
      date: "07/3/2026",
      sharedWithFamily: false,
    },
    {
      id: "5",
      title: "Vase",
      description: "Glass vase in good condition, no visible damage.",
      status: "Unlisted",
      date: "07/5/2026",
      sharedWithFamily: false,
    },
  ];


export default function InvenTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [invenItems, setInvenItems] = useState(items);


  const filtered = invenItems.filter((item) => {
    const searchMatch = item.title.toLowerCase().includes(search.toLowerCase());
    const statusMatch = status === "all" || item.status === status;
    return searchMatch && statusMatch;
  });

  function toggleFamilyShare(id:string) {
    setInvenItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              sharedWithFamily: !item.sharedWithFamily
            }
          : item
      )
    );
  }

  function updateItemStatus(id: string, status: Status) {
    setInvenItems(prev =>
      prev.map(item =>
        item.id === id
        ? {
          ...item,
          status: status
        }
        : item
      )
    )
  }


  return (
    <div>

      <InvenSearch
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      <div className = "md:flex md:justify-center mt-6 overflow-x-auto"> 
        <table className="w-[600px] bg-white shadow-lg rounded-xl table-fixed shrink-0">
            <colgroup>
              <col className="w-[80px]" />  
              <col className = "w-[300px]" />  
              <col className="w-[120px]" />  
            </colgroup>
          <thead>
        
            <tr>

              <th> </th>

              <th className="table-title text-left">
                Item
              </th>

              <th className="table-title">
                Status
              </th>

            </tr>

          </thead>

          <tbody>
            { filtered.length === 0 ? ( 
              <tr> 

                <td colSpan={3} className="text-center py-6 text-black font-bold">
                  No results found.
                </td>

              </tr>
            ) : (
              filtered.map((item) => (
                <InvenRows key={item.id} item={item} openDropdown = {openDropdown} setOpenDropdown={setOpenDropdown} toggleFamilyShare = {toggleFamilyShare} updateItemStatus={updateItemStatus} />
              ))
            )}

          </tbody>
        
        </table>
      </div>

    </div>
  );
}