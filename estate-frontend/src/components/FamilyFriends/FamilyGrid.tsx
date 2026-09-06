import FamilyItemCards from "./FamilyItemCards";

type FamilyItem = {
  id: string;
  title: string;
  image_url: string;
  interest_count: number;
  status: string;
};

type Prop = {
  items: FamilyItem[];
};

export default function FamilyGrid({ items }: Prop) {
  return (
    <div className = "family-grid">
      {items.map((item) => (
        <FamilyItemCards key={item.id} item={item} />
      ))}
      
    </div>
  )

}