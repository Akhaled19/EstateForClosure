import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItem, type ItemDetail } from "../services/items";

const CATEGORIES = [
  "Furniture", "Kitchenware", "Electronics", "Jewelry", "Art & Decor",
  "Clothing", "Tools", "Collectibles", "Books & Media", "Other",
];
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [scanFailed, setScanFailed] = useState(false);
  const [item, setItem] = useState<ItemDetail | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [brand, setBrand] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    let timeoutId: number;

    async function poll() {
      try {
        const result = await getItem(id!);
        if (cancelled) return;

        if (result.is_finalized) {
          setItem(result);
          setTitle(result.title ?? "");
          setDescription(result.description ?? "");
          setCategory(result.category ?? "");
          setCondition(result.condition ?? "");
          setBrand(result.brand ?? "");
          setDimensions(result.dimensions ?? "");
          setPrice(result.asking_price != null ? String(result.asking_price) : "");
          setLoading(false);
          return;
        }

        if (result.ai_status === "complete") {
          setItem(result);
          setTitle(result.ai_title_suggestion ?? "");
          setDescription(result.ai_description_draft ?? "");
          setCategory(result.ai_category ?? "");
          setCondition(result.ai_condition ?? "");
          setBrand(result.ai_brand ?? "");
          setDimensions(result.ai_dimensions_estimate ?? "");
          if (result.ai_estimated_value_low != null && result.ai_estimated_value_high != null) {
            const mid = (result.ai_estimated_value_low + result.ai_estimated_value_high) / 2;
            setPrice(mid.toFixed(2));
          }
          setLoading(false);
          return;
        }

        if (result.ai_status === "failed") {
          setItem(result);
          setScanFailed(true);
          setLoading(false);
          return;
        }

        // still pending/processing —> poll again
        timeoutId = window.setTimeout(poll, 1500);
      } catch (err) {
        if (!cancelled) {
          setScanFailed(true);
          setLoading(false);
        }
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id]);

  function saveItem() {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }
    if (!condition) {
      alert("Please select a condition");
      return;
    }
    console.log({ title, description, category, condition, brand, dimensions, price });
    // TODO: call PATCH /items/{id}/finalize once built
  }

  function handleCancel() {
    navigate("/scan");
  }

  if (loading) {
    return (
      <div className="review-page">
        <p>Analyzing your item...</p>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="review-content">
        <h1 className="review-title">Review</h1>

        {item?.image_url && (
          <img src={item.image_url} className="review-image" alt="Captured item" />
        )}

        {scanFailed && (
          <div className="review-warning"> 
            AI scan didn't complete. No problem — just fill in the details below manually.
          </div>
        )}

        <div className="review-form">
          <label htmlFor="title"><b>Title</b></label>
          <input
            id="title"
            type="text"
            placeholder="Item title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="description"><b>Description</b></label>
          <textarea
            id="description"
            placeholder="Description of your item"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="category"><b>Category</b></label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label htmlFor="condition"><b>Condition</b></label>
          <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="" disabled>Select condition</option>
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label htmlFor="brand"><b>Brand (optional)</b></label>
          <input
            id="brand"
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          <label htmlFor="dimensions"><b>Dimensions (optional)</b></label>
          <input
            id="dimensions"
            type="text"
            placeholder="e.g. 24in W x 18in D x 30in H"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />

          <label htmlFor="price"><b>Price</b></label>
          <input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="review-buttons">
          <button className="save-button" onClick={saveItem}>Save item</button>
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}