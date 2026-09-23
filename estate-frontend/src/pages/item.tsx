import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Countdown from '../components/Countdown';
import { useAuth } from "../services/auth";


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
    listing_end: "2026-07-15T23:59:59Z"
};

export default function ItemPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // id will represent the item id/ # when implemented, to generate the page
    const [item, setItem] = useState(mockItem);
    const [bid, setBid] = useState("");
    const [saved, setSaved] = useState(false);
    const { session } = useAuth();



    const saveButtonText =() => {

        if (!session) return "Sign In to save item"

        return saved ? "Saved" : "Save item"
    }

    const handleSave = () => {
        if (session) {
            setSaved(!saved);
        } else {
            navigate('/signup');
        }
    };


    if (!item) return <p className="p-12 text-[#6B7A90] font-sans">Loading...</p>;

    return (
        <div className="bg-[#F2F4F7] min-h-screen px-6 lg:px-12 py-6 lg:py-8 box-border font-sans">
            <a href="/inventory" className="text-xs text-[#6B7A90] no-underline inline-flex items-center gap-1.5 mb-7 tracking-wide hover:text-[#1B2A4A]">← Back to listings</a>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="w-full lg:w-[400px] lg:shrink-0">
                    <div className="w-full aspect-[4/3] lg:aspect-auto lg:h-[280px] bg-[#E8ECF2] rounded-xl border border-[#CDD3DC] mb-2.5 overflow-hidden">
                        {item.images[0] ? (
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                        ) : " " /* if user doesnt have to upload in image, we could remove img box dynamically */}
                    </div>

                </div>

                <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-[0.1em] text-[#D4621A] font-medium mb-1.5">{item.category}</p>
                    <h1 className="text-[22px] font-medium text-[#1B2A4A] tracking-[-0.02em] leading-tight mb-1">{item.name}</h1>
                    <p className="text-xs text-[#6B7A90] mb-3.5">{item.location}</p>

                    <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                        <p className="text-[28px] font-semibold text-[#D4621A] m-0">${item.price.toFixed(2)}</p>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FEF0E6] text-[#D4621A] border border-[#F4C9A8]">{item.ebayStatus}</span>
                    </div>

                    <div className="h-px bg-[#DDE1E9] my-4" />

                    <p className="text-[10px] font-semibold text-[#4A5568] uppercase tracking-[0.08em] mb-2">Description</p>
                    <p className="text-[13px] text-[#4A5568] leading-relaxed">{item.description}</p>

                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5 my-4">
                        <div className="bg-white rounded-lg px-2.5 py-2 sm:px-3.5 sm:py-3 border border-[#CDD3DC]">
                            <p className="text-[9px] sm:text-[10px] text-[#6B7A90] uppercase tracking-wide mb-1">Condition</p>
                            <p className="text-xs sm:text-[13px] text-[#1B2A4A] font-medium">{item.condition}</p>
                        </div>
                        <div className="bg-white rounded-lg px-2.5 py-2 sm:px-3.5 sm:py-3 border border-[#CDD3DC]">
                            <p className="text-[9px] sm:text-[10px] text-[#6B7A90] uppercase tracking-wide mb-1">Category</p>
                            <p className="text-xs sm:text-[13px] text-[#1B2A4A] font-medium">{item.category}</p>
                        </div>
                        <div className="bg-white rounded-lg px-2.5 py-2 sm:px-3.5 sm:py-3 border border-[#CDD3DC]">
                            <p className="text-[9px] sm:text-[10px] text-[#6B7A90] uppercase tracking-wide mb-1">Location</p>
                            <p className="text-xs sm:text-[13px] text-[#1B2A4A] font-medium">{item.location}</p>
                        </div>
                        <div className="bg-white rounded-lg px-2.5 py-2 sm:px-3.5 sm:py-3 border border-[#CDD3DC]">
                            <p className="text-[9px] sm:text-[10px] text-[#6B7A90] uppercase tracking-wide mb-1">eBay Status</p>
                            <p className="text-xs sm:text-[13px] text-[#1B2A4A] font-medium">{item.ebayStatus}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[10px] border border-[#CDD3DC] p-5 mt-1">
                        <p className="text-[10px] font-semibold text-[#4A5568] uppercase tracking-[0.08em] mb-2">Purchase Options</p>
                        <button className="w-full py-3 bg-[#D4621A] border-2 border-[#D4621A] rounded-lg text-sm font-semibold text-white cursor-pointer tracking-wide hover:bg-[#B8521A] hover:border-[#B8521A]">Buy Now — ${item.price.toFixed(2)}</button>

                        <div className="h-px bg-[#EEF0F4] my-3" />
                        <p className="text-xs text-[#4A5568] font-medium mb-2">Or place a bid</p>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 px-3.5 py-2.5 bg-[#F2F4F7] border-[1.5px] border-[#CDD3DC] rounded-lg text-[13px] text-[#1B2A4A] outline-none box-border placeholder:text-[#A0AABA] focus:border-[#1B2A4A]"
                                type="number"
                                placeholder="Enter your bid..."
                                value={bid}
                                onChange={(e) => setBid(e.target.value)}
                            />
                            <button 
                            disabled = {!session}
                            className="px-[18px] py-2.5 bg-[#1B2A4A] border-2 border-[#1B2A4A] rounded-lg text-[13px] font-semibold text-white cursor-pointer whitespace-nowrap hover:bg-[#243660] hover:border-[#243660]"> {session? "Place bid": "Sign in to place bid"}</button>
                        </div>
                        <p className="text-[11px] text-[#6B7A90] mt-1.5" >Current highest bid: ${item.highestBid.toFixed(2)}</p>

                        <div className="h-px bg-[#EEF0F4] my-3" />
                        <button
                            className={`w-full py-[11px] rounded-lg text-[13px] font-semibold tracking-wide cursor-pointer ${saved ? "bg-[#1B2A4A] text-white border-[1.5px] border-[#1B2A4A]" : "bg-transparent text-[#1B2A4A] border-[1.5px] border-[#1B2A4A] hover:bg-[#F0F3F8]"}`}
                            onClick={handleSave}
                        >
                            {saveButtonText()}
                        </button>
                    </div>

                    <div className="bg-white rounded-[10px] border border-[#CDD3DC] p-5 mt-1">
                        <p className="text-[10px] font-semibold text-[#4A5568] uppercase tracking-[0.08em] mb-2">Time Remaining</p>
                        <Countdown listingEnd={item.listing_end} />

                    </div>



                </div>
            </div>
        </div>
    );
}