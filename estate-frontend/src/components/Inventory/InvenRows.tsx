type Item = {
  title: string;
  description: string;
  status: string;
  date: string;
};

type Property = {
  item: Item;
};

export default function InvenRows({item}: Property) {
  return (
    <tr className="table-row border-t border-gray-200">

      <td className="p-4">

        <button className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 cursor-pointer">
          Edit
        </button>

      </td>

        {/* Picture */}
      <td className="p-4"> 
        <div className="w-25 h-25 bg-gray-300 rounded-xl"/>
      </td>


      <td className="p-4">

        <div className="font-bold mb-1">
            {item.title}
        </div>

        <div className="text-sm text-gray-500">
          {item.description}
        </div>

      </td>

      <td className="p-4">{item.status}</td>
      
      <td className="p-4">{item.date}</td>
    </tr>
  );
}