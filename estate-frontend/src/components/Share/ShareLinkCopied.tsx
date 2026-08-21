type Prop = {
  show: boolean;
};

export default function ShareLinkCopied({ show }: Prop) {
  return (
    <div className = {`sharelink-copied ${show ? "show" : ""}`}>
      <p className = "m-0 text-[14px] font-[400] text-[#1b2a4a]">
        Link copied to clipboard!
      </p>
    </div>
  );
}