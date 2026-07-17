type CardProperty = {
  name: string;
  value: number;
    
};


export default function StatsCard( {name, value}: CardProperty) {
  return (
      <div className = "bg-white rounded-xl shadow-sm p-5">
          <div className = "name-title"> 
            { name }
          </div>

          <h2 className = "value-title">
            { value }
          </h2>
      </div>

  );
}