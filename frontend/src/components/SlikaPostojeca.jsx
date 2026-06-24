import { apsolutnaSlika } from "../utils/putanje.js";

export default function SlikaPostojeca({ putanja, napomena }) {
  if (!putanja) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: -8, marginBottom: 20 }}>
      <img
        src={apsolutnaSlika(putanja)}
        alt="Trenutna slika"
        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, border: "1px solid #ccc" }}
      />
      <span style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>
        Trenutna slika: {putanja.split("/").pop()} {napomena}
      </span>
    </div>
  );
}
