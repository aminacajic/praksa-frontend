import { apsolutnaSlika } from "../utils/putanje.js";

export default function Card({ slika, naslov, opis, podnaslov, napomena, onClick }) {
  return (
    <div className={`ponuda-kartica${onClick ? " klikabilna" : ""}`} onClick={onClick}>
      <div className="kartica-slika-wrapper">
        <img src={apsolutnaSlika(slika)} alt={naslov} className="kartica-slika" />
      </div>
      <div className="kartica-sadrzaj">
        {podnaslov && <strong>{podnaslov}</strong>}
        <h3>{naslov}</h3>
        {opis && <p>{opis}</p>}
        {napomena && <small className="kartica-napomena">{napomena}</small>}
      </div>
    </div>
  );
}
