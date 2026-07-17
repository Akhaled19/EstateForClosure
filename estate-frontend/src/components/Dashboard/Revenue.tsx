import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';


type RevenueData = {
  date: string;
  revenue: number;
};


const data: RevenueData[] = [
  { date: 'M', revenue: 100 },
  { date: 'Tu', revenue: 200 },
  { date: 'W', revenue: 300 },
  { date: 'Th', revenue: 200 },
  { date: 'F', revenue: 250 },
  { date: 'Sa', revenue: 500 },
  { date: 'Su', revenue: 450 },
];


export default function Revenue() {
  return (
    <div className = "bg-white rounded-xl shadow-sm p-5 mb-6"> 

      <div className = "flex justify-between items-center mb-6"> 

          <h2 className = "text-xl font-bold">
            Revenue
          </h2>

          <select className = "border border-gray-400 rounded-lg px-3 py-1.5 outline-none "> 
            <option> Weekly </option>
            <option> Monthly </option>
            <option> Yearly </option>
            <option> All Time </option>
          </select>

      </div>

      <div className = "graph"> 
        <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "black", fontSize: 15, fontWeight: "bold" }} />
            <YAxis tick={{ fill: "black", fontSize: 15, fontWeight: "bold" }}/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", stroke: "#2563eb", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>

    </div>
    );
  }