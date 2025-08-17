// components/SolidButton.jsx
export default function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`border border-primary bg-primary hover:bg-secondary text-white font-normal px-5 py-0.5 rounded-full transition duration-300 tracking-wide cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
