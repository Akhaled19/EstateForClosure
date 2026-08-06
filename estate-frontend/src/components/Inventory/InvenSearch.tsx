import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
};

export default function InvenSearch({search, setSearch, setStatus}: Props) {
  return (
    <div className = "flex justify-center w-full">
      <div className="flex gap-2 mb-6 w-full max-w-[450px]">
        <div className = "relative flex-1"> 
          <MagnifyingGlassIcon className = "w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for items..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-[16px] outline-none"
        />
        </div>

        <select
          onChange={(e) => setStatus(e.target.value)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-[16px] outline-none"
        >

          <option value= "all"> All Items </option>
          <option value= "Unlisted"> Unlisted </option>
          <option value= "Listed"> Listed </option>
          <option value= "Sold"> Sold </option>
          <option value= "Shipped"> Shipped </option>
        </select>

      </div>
    </div>
  );
}