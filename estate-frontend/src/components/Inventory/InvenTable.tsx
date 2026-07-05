import { useState } from "react";
import InvenRows from "./InvenRows";
import InvenSearch from "./InvenSearch";

export type Status = "Unlisted" | "Family" | "Listed" | "Sold";

export type Item = {
  title: string;
  description: string;
  status: Status;
  date: string;
};

  const items: Item[] = [
    {
      title: 'Couch',
      description:
        "Good condition, minor wear on the armrests. Seats three comfortably.",
      status: "Unlisted",
      date: "06/24/2026",
    },
    {
      title: "Mattress",
      description:
        "Decent condition, minor wear. Provides comfortable sleep.",
      status: "Listed",
      date: "06/28/2026",
    },
    {
      title: "Wooden chair",
      description: "Wooden chair in mild condition, partial minor scratches on the surface.",
      status: "Family",
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
          {filtered.map((item, i) => (
            <InvenRows key={i} item={item} />
          ))}
        </tbody>
      
      </table>

    </div>
  );
}