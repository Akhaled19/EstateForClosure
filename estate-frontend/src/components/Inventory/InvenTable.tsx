import { useState } from "react";
import InvenRows from "./InvenRows";
import InvenSearch from "./InvenSearch";

export type Status = "Unlisted" | "Family" | "Listed" | "Sold" | "Shipped";

export type Item = {
  id: number;
  title: string;
  description: string;
  status: Status;
  date: string;
};

  const items: Item[] = [
    {
      id: 1,
      title: 'Couch',
      description:
        "Good condition, minor wear on the armrests. Seats three comfortably.",
      status: "Unlisted",
      date: "06/24/2026",
    },
    {
      id: 2,
      title: "Mattress",
      description:
        "Decent condition, minor wear. Provides comfortable sleep.",
      status: "Listed",
      date: "06/28/2026",
    },
    {
      id: 3,
      title: "Wooden chair",
      description: "Wooden chair in mild condition, partial minor scratches on the surface.",
      status: "Family",
      date: "07/2/2026",
    },
    {
      id: 4,
      title: "Table",
      description: "Table in good condition, minor scratches on the surface.",
      status: "Shipped",
      date: "07/2/2026",
    },
    {
      id: 5,
      title: "Vase",
      description: "Glass vase in good condition, no visible damage.",
      status: "Unlisted",
      date: "07/2/2026",
    },
  ];


export default function InvenTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");


  const filtered = items.filter((item) => {
    const searchMatch = item.title.toLowerCase().includes(search.toLowerCase());
    const statusMatch = status === "all" || item.status === status;
    return searchMatch && statusMatch;
  });

  return (
    <div>
      <InvenSearch
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      <table className="w-full overflow-hidden bg-white shadow-lg table-fixed">
          <colgroup>
          {/* Action, Photo, Item, Status, Date */}
            <col className="w-[100px]" />  
            <col className="w-[135px]" />  
            <col className="w-[480px]" />  
            <col className="w-[100px]" />  
            <col className="w-[100px]" />  
          </colgroup>
        <thead>
      
          <tr>

            <th className="table-title">
              Action
            </th>

            <th className="table-title text-blue-600">
              Photo
            </th>

            <th className="table-title">
              Title
            </th>

            <th className="table-title text-blue-600">
              Status
            </th>
            
            <th className="table-title">
              Date Added
            </th>

          </tr>

        </thead>

        <tbody>
          { filtered.length === 0 ? ( 
            <tr> 

              <td colSpan={5} className="text-center py-6 text-black font-bold">
                No results found.
              </td>

            </tr>
          ) : (
            filtered.map((item) => (
              <InvenRows key={item.id} item={item} />
            ))
          )}

        </tbody>
      
      </table>

    </div>
  );
}