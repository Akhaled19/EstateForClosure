export default function Dashboard() {
  return (
    <div className="dashboard">

      <div className="content pt-5">

        <div className="text-[40px] text-black ml-5">
          Welcome back!
        </div>

        <div className="item-cards flex gap-5 justify-between flex-wrap mt-10">

          <div className="card border rounded-xl p-5 text-black flex-1 text-center">
            Recent Items
          </div>

          <div className="card border rounded-xl p-5 text-black flex-1 text-center">
            Items currently listed
          </div>

          <div className="card border rounded-xl p-5 text-black flex-1 text-center">
            Items sold
          </div>

        </div>

      </div>

    </div>
  );
}