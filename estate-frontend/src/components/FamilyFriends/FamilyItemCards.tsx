import { useState, useEffect } from "react";

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
  const [interested, setInterested] = useState(false);
  const [submittingInterest, setSubmittingInterest] = useState(false);

  useEffect(() => {
    async function checkInterest() {
      const familyfriendUserID = localStorage.getItem("family_friend_user_id");

      if (!familyfriendUserID) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/item-interest/${item.id}/check/${familyfriendUserID}`);

        if (!response.ok) {
          throw new Error("Error getting interests.");
        }

        const result = await response.json();

        setInterested(result.interested);
      } catch (error) {
        console.error("Error checking interest:", error);
      }
    }

    checkInterest();
    
  }, [item.id]);

  async function handleExpressInterest() {
    const familyfriendUserID = localStorage.getItem("family_friend_user_id");

    if (!familyfriendUserID) {
      alert("Information needed first");
      return;
    }

    setSubmittingInterest(true);

    try {
      if (interested) {
      const response = await fetch(`http://localhost:8000/item-interest/${item.id}`, 
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({family_friend_user_id: familyfriendUserID }),
        }
      );

      if (!response.ok) {
        throw new Error("Error removing interest.");
      }


      setInterested(false);

    } else {
        const response = await fetch(`http://localhost:8000/item-interest/${item.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ family_friend_user_id: familyfriendUserID }),
          }
        );

        if (!response.ok) {
          throw new Error("Error expressing interest.");
        } 

        setInterested(true);
      }
      
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingInterest(false);
    }
  }

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

      <button 
        className = "interested-button" 
        onClick={handleExpressInterest}
        disabled={submittingInterest}
        >
        {submittingInterest ? "Submitting..." : interested ? "Interest Expressed!" : "Express Interest"}
      </button>


    </div>
  );
}