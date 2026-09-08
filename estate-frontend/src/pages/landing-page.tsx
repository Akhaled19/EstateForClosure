import "./landing-page.css";
import { Link } from "react-router-dom";


const PLACEHOLDER_IMGS = ["https://t3.ftcdn.net/jpg/04/40/07/32/360_F_440073209_G5zCsw04ViEwTwapmeMjendrNaqGODTU.jpg",
   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSArO-rQx9MptDHU0dIK5RqhO2pEUHwcY7mvFqL1z2VA&s=10",
   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH9PS_0E-Z7U872N-3320ox90DX6MJkCnMjozhExc1jg&s=10", 
"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToeMdAuYLedMBnCuSPoQv6_897kBP8E_nY6W_FdtZSjA&s=10"
]

const CATEGORIES = [
  {
    name: "Furniture",
    count: 42,
    image: PLACEHOLDER_IMGS[0],
    featured: true,
  },
  { name: "Electronics", count: 18, image: PLACEHOLDER_IMGS[1]},
  { name: "Kitchen & Dining", count: 27, image:  PLACEHOLDER_IMGS[2]},
  { name: "Decor & Art", count: 33, image: PLACEHOLDER_IMGS[3]},
  { name: "Outdoor", count: 11, image: PLACEHOLDER_IMGS[1]},
  { name: "Antiques", count: 9, image: PLACEHOLDER_IMGS[2] },
];

export default function LandingPage() {

  return (
    <div className="land-page">
      <section className="land-hero">
        <div className="land-hero-overlay" />
        <div className="land-hero-content">
          <span className="land-eyebrow land-eyebrow-light">10,000+ items live right now</span>
          <h1>Everything from the estate. All in one place.</h1>
          <p>
            Browse what's available, express interest in a couple clicks, and
            find out the moment something's yours.
          </p>
          <form className="land-search" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Search couches, lamps, dining sets…" />
            <button type="submit" className="land-btn land-btn-primary">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="land-categories">
        <div className="land-section-head">
          <h2>Browse by category</h2>
          <Link
            to="/browse"
            className="land-see-all">See all items →
         </Link>
        </div>
        <div className="land-category-grid">
          {CATEGORIES.map((c) => (
            <Link
              to={`/browse?category=${encodeURIComponent(c.name)}`}
              key={c.name}
              className={`land-category-card ${c.featured ? "is-featured" : ""}`}
            >
              <div
                className="land-category-image"
                style={{ backgroundImage: `url(${c.image})` }}
              />
              <div className="land-category-info">
                <span className="land-category-name">{c.name}</span>
                <span className="land-category-count">{c.count} items</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="land-owner-strip">
        <div className="land-owner-text">
          <span className="land-eyebrow">Clearing out an estate?</span>
          <h3>List what's left. Pick who gets it.</h3>
          <p>
            Post items, see who's interested, and claim one person per item —
            no group texts required.
          </p>
        </div>
        <Link to="/scan" className="land-btn land-btn-secondary">
          Start a listing
        </Link>
      </section>

      <footer className="land-footer">
        <div>
          Estate<span>Foreclosure</span>
        </div>
        <p>
          Already have an account? <Link to="/login">Log in</Link>

        </p>
      </footer>
    </div>
  );
}