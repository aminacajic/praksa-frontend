export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      className="pretraga-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
