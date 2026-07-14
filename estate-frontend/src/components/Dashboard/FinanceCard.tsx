export default function FinanceCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">

      <h2 className="text-xl font-bold mb-3 text-[rgb(27,42,74)]">
        Finance Overview
      </h2>


      <div className="flex justify-between py-3 border-b border-gray-200">

        <div className = "card-values">
          Revenue
        </div>

        <div className="font-bold">
          $8,426
        </div>

      </div>

      <div className="flex justify-between py-3 border-b border-gray-200">

        <div className = "card-values">
          Estate Value
        </div>

        <div className="font-bold">
          $26,820
        </div>

      </div>

      <div className="flex justify-between py-3 border-b border-gray-200">

        <div className = "card-values">
          Today's Sales
        </div>

        <div className="font-bold">
          $126
        </div>

      </div>

      <div className="flex justify-between py-3">

        <div className = "card-values">
          Average Sale Price
        </div>

        <div className="font-bold">
          $163
        </div>

      </div>

    </div>
  );
}