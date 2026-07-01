type CardProperty = {
    title: string;
    description: string;
    status: string;
    price: string;
}

export default function Card({title, description, status, price}: CardProperty) {     {/* To add image parameter later... */}
  return (
    <div className="border rounded-xl p-5 flex gap-5">

    {/*To add: src = {image} */}
      <div className="w-65 h-65 bg-gray-200 rounded-lg">
        Image
      </div>
  
      <div>
        <h2 className="text-xl font-bold text-blue-600">
          {title}
        </h2>

        <p className="text-black italic">
          {description}
        </p>

        <p className="text-black">
          <b> Status: </b> {status}
        </p>

        <p className="text-black">
          <b> Price Listed: </b> {price}
        </p>
      </div>

    </div>
  );
}