export default function SellingCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">

      <h2 className="text-xl font-bold mb-3 text-[rgb(27,42,74)]">
        Selling Statistics
      </h2>


      <div className="flex justify-between py-3 border-b border-gray-200">

        <div className = "card-values">
          Pending Shipments
        </div>

        <div className="font-bold">
          4
        </div>

      </div>


      <div className="flex justify-between py-3 border-b border-gray-200">

        <div className = "card-values">
          Offers Waiting
        </div>

        <div className="font-bold">
          9
        </div>

      </div>


      <div className="flex justify-between py-3 border-b border-gray-200">

        <div className = "card-values">
          Unsold Listings (30+ days)
        </div>

        <div className="font-bold">
          14
        </div>

      </div>


      <div className="flex justify-between py-3">

        <div className = "card-values">
          Listings Ending Soon
        </div>

        <div className="font-bold">
          2
        </div>

      </div>


    </div>
  );
}