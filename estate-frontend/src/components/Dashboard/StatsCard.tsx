type CardProperty = {
  name: string;
  value: number;
};

export default function StatsCard({ name, value }: CardProperty) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="text-[#1B2A4A] font-bold text-xl">
        {name}
      </div>

      <h2 className="text-[28px] mt-3 font-bold text-[#D4621A]">
        {value}
      </h2>
    </div>
  );
}