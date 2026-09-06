import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./browse-page.css";

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


// const MOCK_ITEMS: ItemRow[] = [
//     { id: "1", title: "Mid-century sofa", image_url: "", asking_price: 220, category: "Furniture", condition: "Good", brand: "Famous Chairs", created_at: "2026-07-01" },
//     { id: "2", title: "Oak dining table", image_url: "", asking_price: 340, category: "Furniture", condition: "Like New", brand: "Ethan Allen", created_at: "2026-07-10" },
//     { id: "3", title: "Wooden rocking chair", image_url: "", asking_price: 65, category: "Furniture", condition: "Fair", brand: "Famous Chairs", created_at: "2026-06-28" },
//     { id: "4", title: "Record player", image_url: "", asking_price: 90, category: "Electronics", condition: "Good", brand: "Sony", created_at: "2026-07-15" },
//     { id: "5", title: "Old CRT television", image_url: "", asking_price: 20, category: "Electronics", condition: "Poor", brand: "LG", created_at: "2026-06-20" },
//     { id: "6", title: "Porcelain vase set", image_url: "", asking_price: 45, category: "Decor & Art", condition: "New", brand: "Target", created_at: "2026-07-18" },
// ];

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
        <div className="browse-page">
            <div className="browse-tabs">
                {CATEGORIES.map((c) => (
                    <button
                        key={c}
                        className={`browse-tab ${c === activeCategory ? "is-active" : ""}`}
                        onClick={() => selectCategory(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="browse-body">
                <aside className="browse-filters">
                    <h3>Filters</h3>

                    <div className="browse-filter-group">
                        <span className="browse-filter-label">Condition</span>
                        {CONDITIONS.map((c) => (
                            <label key={c} className="browse-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedConditions.has(c)}
                                    onChange={() => toggleCondition(c)}
                                />
                                {c}
                            </label>
                        ))}
                    </div>

                    <div className="browse-filter-group">
                        <span className="browse-filter-label">Price range</span>
                        <div className="browse-price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span>–</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="browse-filter-group">
                        <span className="browse-filter-label">Brand</span>
                        <input
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>
                </aside>

                <div className="browse-results">
                    <div className="browse-results-head">
                        <span>{sortedItems.length} items</span>
                        <select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="newest">Newest</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                        </select>
                    </div>

                    {isLoading && <p className="browse-empty">Loading…</p>}

                    {!isLoading && loadError && (
                        <p className="browse-empty">Couldn't load items. Is the backend running?</p>
                    )}

                    {!isLoading && !loadError && (
                        <div className="browse-grid">
                            {sortedItems.map((item) => (
                                <a href={`/items/${item.id}`} key={item.id} className="browse-card">
                                    <div
                                        className="browse-card-image"
                                        style={{ backgroundImage: `url(${item.image_url})` }}
                                    />
                                    <div className="browse-card-info">
                                        <span className="browse-card-title">{item.title}</span>
                                        {item.condition && (
                                            <span className="browse-card-condition">{item.condition}</span>
                                        )}
                                        <span className="browse-card-price">
                                            {item.asking_price != null ? `$${item.asking_price}` : "Price TBD"}
                                        </span>
                                    </div>
                                </a>
                            ))}
                            {sortedItems.length === 0 && (
                                <p className="browse-empty">No items match your filters.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}