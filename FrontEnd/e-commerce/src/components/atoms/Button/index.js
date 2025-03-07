export default function Button({ buttonClassname = "", type = "button", children, onClick = () => {}, disabled = false }) {
  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`h-10 px-6 font-semibold transition duration-300 
        ${disabled ? "bg-gray-300 text-gray-500 cursor-no-drop " : ""} 
        ${buttonClassname}`}
    >
      {children}
    </button>
  );
}
