import { Link } from "react-router-dom";

const PLACEHOLDER_IMGS = [
  "https://t3.ftcdn.net/jpg/04/40/07/32/360_F_440073209_G5zCsw04ViEwTwapmeMjendrNaqGODTU.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSArO-rQx9MptDHU0dIK5RqhO2pEUHwcY7mvFqL1z2VA&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH9PS_0E-Z7U872N-3320ox90DX6MJkCnMjozhExc1jg&s=10",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToeMdAuYLedMBnCuSPoQv6_897kBP8E_nY6W_FdtZSjA&s=10",
];

const CATEGORIES = [
  { name: "Furniture", count: 42, image: PLACEHOLDER_IMGS[0], featured: true },
  { name: "Electronics", count: 18, image: PLACEHOLDER_IMGS[1] },
  { name: "Kitchen & Dining", count: 27, image: PLACEHOLDER_IMGS[2] },
  { name: "Decor & Art", count: 33, image: PLACEHOLDER_IMGS[3] },
  { name: "Outdoor", count: 11, image: PLACEHOLDER_IMGS[1] },
  { name: "Antiques", count: 9, image: PLACEHOLDER_IMGS[2] },
];

export default function LandingPage() {
  return (
    <div className="font-sans bg-[#F2F4F7] text-[#1B2A4A]">
      {/* Hero */}
      <section className="relative flex min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] items-center justify-center overflow-hidden bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/[0.82] to-[#1B2A4A]/[0.9]" />
        <div className="relative z-10 max-w-[640px] w-full px-6 py-12 lg:py-[72px] text-center">
          <span className="block text-xs font-semibold tracking-wider uppercase text-[#E8A882] mb-3">
            10,000+ items live right now
          </span>
          <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-semibold tracking-tight leading-[1.15] text-white mb-4">
            Everything from the estate. All in one place.
          </h1>
          <p className="text-[15px] sm:text-base text-[#C4CFE0] leading-relaxed mb-8">
            Browse what's available, express interest in a couple clicks, and
            find out the moment something's yours.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-2.5 max-w-[480px] w-full mx-auto"
          >
            <input
              type="text"
              placeholder="Search couches, lamps, dining sets…"
              className="flex-1 min-w-0 rounded-lg border border-[#CDD3DC] bg-white px-4 py-3 text-sm text-[#1B2A4A] outline-none shadow-[0_2px_8px_rgba(0,0,0,0.15)] placeholder:text-[#A0AABA]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-[#D4621A] px-6 py-3 text-sm font-medium text-white hover:bg-[#B8521A]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1080px] mx-auto px-6 lg:px-14 py-10 lg:py-14 pb-14 lg:pb-[72px] box-border">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1B2A4A]">Browse by category</h2>
          <Link to="/browse" className="text-[13px] font-medium text-[#D4621A] hover:underline">
            See all items →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)] lg:auto-rows-[160px]">
          {CATEGORIES.map((c) => (
            <Link
              to={`/browse?category=${encodeURIComponent(c.name)}`}
              key={c.name}
              className={`group relative flex flex-col overflow-hidden rounded-xl border border-[#E5E9F0] bg-white no-underline transition-all duration-200 hover:-translate-y-[3px] hover:border-[#D4621A] hover:shadow-[0_8px_20px_rgba(27,42,74,0.12)] ${
                c.featured ? "col-span-1 sm:col-span-2 sm:row-span-1 lg:row-span-2" : ""
              }`}
            >
              <div
                className="flex-1 w-full bg-[#E5E9F0] bg-cover bg-center"
                style={{ backgroundImage: `url(${c.image})` }}
              />
              <div
                className={
                  c.featured
                    ? "absolute inset-x-0 bottom-0 flex items-center justify-between px-[18px] py-4 pt-10 bg-gradient-to-t from-[#1B2A4A]/85 to-transparent"
                    : "flex items-center justify-between px-[18px] py-4"
                }
              >
                <span className={`text-[15px] font-semibold ${c.featured ? "text-white" : "text-[#1B2A4A]"}`}>
                  {c.name}
                </span>
                <span className={`text-xs ${c.featured ? "text-white" : "text-[#6B7A90]"}`}>
                  {c.count} items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Owner strip */}
      <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 max-w-[1080px] mx-auto mb-14 lg:mb-[72px] px-6 sm:px-10 py-6 sm:py-8 bg-white border border-[#E5E9F0] rounded-xl box-border">
        <div>
          <span className="block text-xs font-semibold tracking-wider uppercase text-[#D4621A] mb-2">
            Clearing out an estate?
          </span>
          <h3 className="text-lg font-semibold text-[#1B2A4A] mb-1.5">
            List what's left. Pick who gets it.
          </h3>
          <p className="text-[13px] text-[#6B7A90] max-w-[440px] leading-relaxed">
            Post items, see who's interested, and claim one person per item —
            no group texts required.
          </p>
        </div>
        <Link
          to="/scan"
          className="shrink-0 inline-block rounded-lg border border-[#CDD3DC] bg-white px-6 py-3 text-sm font-medium text-[#1B2A4A] hover:border-[#D4621A] hover:text-[#D4621A]"
        >
          Start a listing
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center px-6 pt-8 pb-10 border-t border-[#E5E9F0]">
        <div className="text-base font-medium text-[#1B2A4A] mb-2">
          Estate<span className="text-[#D4621A]">Foreclosure</span>
        </div>
        <p className="text-[13px] text-[#6B7A90]">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#1B2A4A] hover:underline">
            Log in
          </Link>
        </p>
      </footer>
    </div>
  );
}