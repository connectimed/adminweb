// components/StrokeButton.jsx
export default function StrokeButton({
  children,
  onClick,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`border border-primary text-primary hover:bg-blue-50 font-normal px-5 py-0.5 rounded-full transition duration-300 tracking-wide cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
