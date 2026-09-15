import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface ItemRow {
    id: string;
    title: string;
    image_url: string;
    asking_price: number | null;
    category: string;
    condition: string | null;
    brand: string | null;
    created_at: string;
}

const CATEGORIES = [
    "Furniture",
    "Electronics",
    "Kitchen & Dining",
    "Decor & Art",
    "Outdoor",
    "Antiques",
    "All"
];

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

const API_BASE = "http://localhost:8000";

export default function BrowsePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeCategory, setActiveCategoryState] = useState(() => {
        const categoryParam = searchParams.get("category");
        if (categoryParam !== null) {
            if (CATEGORIES.includes(categoryParam)) {
                return categoryParam;
            }
        }
        return "All";
    });

    const [selectedConditions, setSelectedConditions] = useState<Set<string>>(new Set());
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [brand, setBrand] = useState("");
    const [sort, setSort] = useState("newest");
    const [items, setItems] = useState<ItemRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    function selectCategory(c: string) {
        setActiveCategoryState(c);
        if (c !== "All") {
            setSearchParams({ category: c });
        } else {
            setSearchParams({});
        }
    }

    useEffect(() => {
        const params = new URLSearchParams();

        if (activeCategory !== "All") {
            params.set("category", activeCategory);
        }

        if (minPrice) {
            params.set("min_price", minPrice);
        }

        if (maxPrice) {
            params.set("max_price", maxPrice);
        }

        if (brand.trim()) {
            params.set("brand", brand.trim());
        }

        selectedConditions.forEach((c) => {
            params.append("condition", c);
        });

        setIsLoading(true);
        setLoadError(false);

        fetch(`${API_BASE}/items?${params.toString()}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load items");
                }
                return res.json();
            })
            .then((data) => {
                setItems(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
                setLoadError(true);
            });
    }, [activeCategory, selectedConditions, minPrice, maxPrice, brand]);

    function toggleCondition(c: string) {
        setSelectedConditions((prev) => {
            const next = new Set(prev);
            if (next.has(c)) {
                next.delete(c);
            } else {
                next.add(c);
            }
            return next;
        });
    }

    let sortedItems = [...items];
    if (sort === "price_low") {
        sortedItems.sort((a, b) => {
            let priceA = a.asking_price;
            if (priceA === null) {
                priceA = 0;
            }
            let priceB = b.asking_price;
            if (priceB === null) {
                priceB = 0;
            }
            return priceA - priceB;
        });
    } else if (sort === "price_high") {
        sortedItems.sort((a, b) => {
            let priceA = a.asking_price;
            if (priceA === null) {
                priceA = 0;
            }
            let priceB = b.asking_price;
            if (priceB === null) {
                priceB = 0;
            }
            return priceB - priceA;
        });
    } else {
        sortedItems.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
        });
    }

    return (
        <div className="min-h-screen bg-[#F2F4F7] text-[#1B2A4A] font-sans">
            <div className="flex gap-2 overflow-x-auto border-b border-[#E5E9F0] bg-white px-6 lg:px-14 py-5 lg:py-6">
                {CATEGORIES.map((c) => (
                    <button
                        key={c}
                        onClick={() => selectCategory(c)}
                        className={`shrink-0 rounded-full border px-[18px] py-[9px] text-[13px] font-medium transition-colors duration-150 ${
                            c === activeCategory
                                ? "bg-[#1B2A4A] border-[#1B2A4A] text-white"
                                : "bg-white border-[#CDD3DC] text-[#4A5568] hover:border-[#D4621A] hover:text-[#D4621A]"
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-8 max-w-[1200px] mx-auto px-6 lg:px-0 py-6 lg:py-8 pb-14 lg:pb-[72px] box-border">
                <button
                    onClick={() => setShowFilters((v) => !v)}
                    className="lg:hidden w-full flex items-center justify-between rounded-xl border border-[#E5E9F0] bg-white px-5 py-3 text-sm font-medium text-[#1B2A4A]"
                >
                    Filters
                    <span className="text-[#6B7A90] text-xs">{showFilters ? "Hide ▲" : "Show ▼"}</span>
                </button>

                <aside
                    className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-[clamp(180px,20%,260px)] lg:shrink-0 bg-white border border-[#E5E9F0] rounded-xl p-5 box-border lg:sticky lg:top-6`}
                >
                    <h3 className="text-[15px] font-semibold mb-[18px] text-[#1B2A4A]">Filters</h3>

                    <div className="flex flex-col gap-2 mb-[22px]">
                        <span className="text-xs font-semibold tracking-wide uppercase text-[#6B7A90] mb-1">
                            Condition
                        </span>
                        {CONDITIONS.map((c) => (
                            <label key={c} className="flex items-center gap-2 text-[13px] text-[#4A5568] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedConditions.has(c)}
                                    onChange={() => toggleCondition(c)}
                                />
                                {c}
                            </label>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 mb-[22px]">
                        <span className="text-xs font-semibold tracking-wide uppercase text-[#6B7A90] mb-1">
                            Price range
                        </span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-0 flex-1 rounded-md border border-[#CDD3DC] px-2.5 py-2 text-[13px] outline-none focus:border-[#D4621A]"
                            />
                            <span className="text-xs text-[#A0AABA]">–</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-0 flex-1 rounded-md border border-[#CDD3DC] px-2.5 py-2 text-[13px] outline-none focus:border-[#D4621A]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-[22px]">
                        <span className="text-xs font-semibold tracking-wide uppercase text-[#6B7A90] mb-1">
                            Brand
                        </span>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="rounded-md border border-[#CDD3DC] px-2.5 py-2 text-[13px] outline-none focus:border-[#D4621A]"
                        />
                    </div>
                </aside>

                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-[18px] text-[13px] text-[#6B7A90]">
                        <span>{sortedItems.length} items</span>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-md border border-[#CDD3DC] px-3 py-2 text-[13px] text-[#1B2A4A] bg-white outline-none"
                        >
                            <option value="newest">Newest</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                        </select>
                    </div>

                    {isLoading && <p className="col-span-full text-center text-[#6B7A90] text-sm py-12">Loading…</p>}

                    {!isLoading && loadError && (
                        <p className="col-span-full text-center text-[#6B7A90] text-sm py-12">
                            Couldn't load items.
                        </p>
                    )}

                    {!isLoading && !loadError && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                            {sortedItems.map((item) => (
                                <a
                                    href={`/items/${item.id}`}
                                    key={item.id}
                                    className="flex flex-col bg-white border border-[#E5E9F0] rounded-xl overflow-hidden no-underline transition-all duration-200 hover:-translate-y-[3px] hover:border-[#D4621A] hover:shadow-[0_8px_20px_rgba(27,42,74,0.1)]"
                                >
                                    <div
                                        className="w-full aspect-video bg-[#E5E9F0] bg-cover bg-center"
                                        style={{ backgroundImage: `url(${item.image_url})` }}
                                    />
                                    <div className="flex flex-col gap-1 px-4 py-3.5">
                                        <span className="text-sm font-semibold text-[#1B2A4A]">{item.title}</span>
                                        {item.condition && (
                                            <span className="text-[11px] font-medium uppercase tracking-wide text-[#6B7A90]">
                                                {item.condition}
                                            </span>
                                        )}
                                        <span className="text-sm font-semibold text-[#D4621A] mt-0.5">
                                            {item.asking_price != null ? `$${item.asking_price}` : "Price TBD"}
                                        </span>
                                    </div>
                                </a>
                            ))}
                            {sortedItems.length === 0 && (
                                <p className="col-span-full text-center text-[#6B7A90] text-sm py-12">
                                    No items match your filters.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}