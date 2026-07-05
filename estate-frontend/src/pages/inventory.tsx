import { Link } from "react-router-dom";
import InvenTable from "../components/Inventory/InvenTable";

export default function Inventory() {
  return (
    <div className="flex-1 p-10 bg-gray-100 min-h-screen">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold mb-2">
            Inventory
          </h1>
          <p className="text-gray-500">
            Manage all your items here.
          </p>
        </div>

        <Link
        to="/scan"
        className="bg-blue-500 text-black px-6 py-3 rounded-lg text-lg cursor-pointer hover:bg-blue-600"
        >
          Scan New Item
        </Link>

      </div>

      <InvenTable />

    </div>
  );
}