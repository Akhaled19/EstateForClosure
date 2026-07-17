import StatsCard from "../components/Dashboard/StatsCard";
import Revenue from "../components/Dashboard/Revenue";
import FinanceCard from "../components/Dashboard/FinanceCard";
import SellingCard from "../components/Dashboard/SellingCard";


export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className = "dashboard-wrapper">
        <div className = "mb-8"> 
            <h1 className = "text-3xl font-bold"> 
              Dashboard
            </h1>

            <div className = "text-gray-500 mt-2">
              Here's an general overview of your estate.
            </div>

        </div>

        <div className = "cards"> 
            <StatsCard name = "Inventory" value = {25} />
            <StatsCard name = "Listings" value = {9} />
            <StatsCard name = "Sold" value = {13} />
            <StatsCard name = "Shipped" value = {5} />

        </div> 

        <Revenue/>

        <div className = "grid grid-cols-2 gap-6 mt-8"> 
          <FinanceCard/> 
          <SellingCard/>
        </div>

      </div>
      
    </div>
  );
}