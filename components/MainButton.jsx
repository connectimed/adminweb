// components/SolidButton.jsx
export default function MainButton({
  children,
  onClick,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-sm bg-dark-bg hover:bg-secondary text-white font-light px-5 py-2 rounded-md transition duration-300 tracking-wider cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
