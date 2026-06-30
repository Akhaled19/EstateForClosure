import Card from "../components/Cards";

export default function Dashboard() {
  return (
    <div className="dashboard">

      <div className="content pt-5">

        <div className="text-[30px] text-black ml-5">
          Your Dashboard:
        </div>

        <div className="item-cards flex justify-center gap-5 flex-wrap mt-6">

          <div className="underline p-5 text-black text-center">
            Recent
          </div>

          <div className="underline p-5 text-black  text-center">
            Currently Listed
          </div>

          <div className="underline p-5 text-black  text-center">
            Sold
          </div>

          <div className="underline p-5 text-black text-center">
            Shipped
          </div>

          <div className="underline p-5 text-black text-center">
            Family & Friends
          </div>

        </div>


        <div className = "mt-8 ml-45 space-y-4">
          <Card 
          title = "Chair"
          description = "Chair in good condition"
          status = "Listed"
          price = "$25"
          />

          <Card 
          title = "Mattress"
          description = "King mattress, in perfect condition"
          status = "Sold"
          price = "$100"
          
          />
          <Card 
          title = "Couch"
          description = "Couch, in mild condition"
          status = "Inventory"
          price = "$75"
          />

        </div>




      </div>

    </div>
  );
}