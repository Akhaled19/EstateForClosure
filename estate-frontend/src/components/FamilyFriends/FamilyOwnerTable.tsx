
type mockItem = {
  id: string;
  title: string;
  image_url: string;
  date: string;
  status: "Unclaimed" | "Claimed";
  interest_count: number;
};

type Prop = {
  items: mockItem[];
  onView: (item: mockItem) => void;
};

export default function FamilyOwnerTable({ items, onView }: Prop) {
  
  return (
    <div className = "overflow-x-auto">
      <table className = "w-full min-w-[600px]">
        <thead>
          <tr className = "border-b border-gray-200 text-left">

            <th className = "w-[55%] px-4 py-3 font-semibold text-[#D4621A]">
              Item
            </th>

            <th className = "w-[15%] px-4 py-3 font-semibold text-[#D4621A]">
              Status
            </th>

            <th className = "w-[15%] px-4 py-3 font-semibold text-[#D4621A]">
              Interested
            </th>

            <th className = "w-[15%] px-4 py-3 font-semibold text-[#D4621A]">
              Action
            </th>

          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key = {item.id} className="border-b border-gray-100">
              <td className = "px-4 py-4">
                <div className = "flex items-center gap-4">

                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className = "w-16 h-16 shrink-0 object-cover rounded-lg"
                    />
                  ) : (
                    <div className = "w-16 h-16 rounded-lg bg-gray-200" />
                  )}

                  <div className = "min-w-0 flex-1">
                    <p className = "font-medium font-['Inter','system-ui','sans-serif'] text-[#1b2a4a] truncate ml-1" title = {item.title}>
                      {item.title}
                    </p>

                    <p className = "text-sm text-gray-500 mt-1 ml-1">
                      Added on {item.date}
                    </p>

                  </div>

                </div>

              </td>

              <td className = "px-4 py-4">
                <span className = "text-gray-700 font-['Inter','system-ui','sans-serif'] font-medium">
                  {item.status}
                </span>
              </td>

              <td className = "px-4 py-4">
                <span className = "text-gray-700 font-['Inter','system-ui','sans-serif'] font-medium  ">
                  {item.interest_count}{" "}
                  {item.interest_count === 1 ? "person" : "people"}
                </span>
              </td>

              <td className = "px-4 py-4">
                <button 
                  className = "px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 hover:bg-gray-300 text-[#1b2a4a] font-['Inter','system-ui','sans-serif'] font-medium"
                  onClick={() => onView(item)}
                >
                  View
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}
