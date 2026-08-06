
type FamilyItem = {
  id: string;
  title: string;
  image_url: string;
  interest_count: number;
  status: string;
};

type Prop = {
  item: FamilyItem;
};

export default function FamilyItemCards({ item }: Prop) {
  return (
    <div className = "family-item-card"> 

      <div className = "family-card-image"> 

        {item.image_url ? (
          <img src={item.image_url} alt={item.title} />
        ) : (
          <div className = "family-card-image-placeholder"> </div>
        )}

        <div className = "family-card-status"> 
          {item.status}
        </div>
        
      </div>



      <h3 className = "family-card-title"> 
        {item.title}
      </h3>

      <p className = "family-card-interested"> 
        {item.interest_count} interested
      </p>

      <button className = "interested-button"> 
        Express Interest
      </button>


    </div>
  );
}