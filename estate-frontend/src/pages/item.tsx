import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./item.css";

const mockItem = {
    id: 1,
    name: "Vintage Table",
    category: "Furniture",
    price: 320.00,
    highestBid: 280.00,
    condition: "Good",
    location: "Boston, MA",
    ebayStatus: "Active Listing",
    description: "Dining table from the 1970s. Minor surface scratches on one end, otherwise in great shape. Seats 6 comfortably.",
    images: [],
};

export default function ItemPage() {
    const { id } = useParams();
    const [item, setItem] = useState(mockItem);
    const [bid, setBid] = useState("");
    const [saved, setSaved] = useState(false);
    const [loggedIn, setLoggedIn] = useState(true)


    const saveButtonText =() => {

        if (!loggedIn) return "Sign In to save item"

        return saved ? "Saved" : "Save item"

    }

    const handleSave = () => {
        if (loggedIn) {
            setSaved(!saved);
        } else {
            window.location.href = "/login";
        }
    };


    if (!item) return <p className="ip-loading">Loading...</p>;

    return (
        <div className="ip-page">
            <a href="/inventory" className="ip-back">← Back to listings</a>

            <div className="ip-layout">
                <div className="ip-photos">
                    <div className="ip-main-photo">
                        {item.images[0] ? (
                            <img src={item.images[0]} alt={item.name} />
                        ) : " " /* if user doesnt have to upload in image, we could remove img box dynamically */}
                    </div>

                </div>

                <div className="ip-info">
                    <p className="ip-category">{item.category}</p>
                    <h1 className="ip-title">{item.name}</h1>
                    <p className="ip-location">{item.location}</p>

                    <div className="ip-price-row">
                        <p className="ip-price">${item.price.toFixed(2)}</p>
                        <span className="badge badge-condition">{item.condition} Condition</span>
                        <span className="badge badge-ebay">{item.ebayStatus}</span>
                    </div>

                    <div className="ip-divider" />

                    <p className="section-title">Description</p>
                    <p className="ip-description">{item.description}</p>

                    <div className="ip-details">
                        <div className="ip-detail">
                            <p className="detail-label">Condition</p>
                            <p className="detail-value">{item.condition}</p>
                        </div>
                        <div className="ip-detail">
                            <p className="detail-label">Category</p>
                            <p className="detail-value">{item.category}</p>
                        </div>
                        <div className="ip-detail">
                            <p className="detail-label">Location</p>
                            <p className="detail-value">{item.location}</p>
                        </div>
                        <div className="ip-detail">
                            <p className="detail-label">eBay Status</p>
                            <p className="detail-value">{item.ebayStatus}</p>
                        </div>
                    </div>

                    <div className="ip-purchase">
                        <p className="section-title">Purchase Options</p>
                        <button className="ip-buy-btn">Buy Now — ${item.price.toFixed(2)}</button>

                        <div className="ip-divider-sm" />
                        <p className="ip-bid-label">Or place a bid</p>
                        <div className="ip-bid-row">
                            <input
                                className="ip-bid-input"
                                type="number"
                                placeholder="Enter your bid..."
                                value={bid}
                                onChange={(e) => setBid(e.target.value)}
                            />
                            <button 
                            disabled = {!loggedIn}
                            className="ip-bid-btn"> {loggedIn? "Place bid": "Sign in to place bid"}</button>
                        </div>
                        <p className="ip-bid-hint" >. Current highest bid: ${item.highestBid.toFixed(2)}</p>

                        <div className="ip-divider-sm" />
                        <button
                            className={`ip-save ${saved ? "saved" : ""}`}
                            onClick={handleSave}
                        >
                            {saveButtonText()}
                        </button>
                    </div>

                    <div className="ip-timer">
                        <p className="section-title">Countdown Timer</p>
                        {/*  cdoe for the timer goes here. to let user know how much time they have */}
                    </div>



                </div>
            </div>
        </div>
    );
}

