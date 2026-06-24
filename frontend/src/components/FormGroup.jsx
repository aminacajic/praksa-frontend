export default function FormGroup({ label, htmlFor, children }) {
  return (
    <div className="forma-grupa">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
