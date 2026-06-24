import { useState } from "react";
import { apsolutnaSlika } from "../utils/putanje.js";

export default function Slider({ slike = [] }) {
  const [indeks, setIndeks] = useState(0);

  if (!slike || slike.length === 0) {
    return (
      <div className="sport-galerija-slajder">
        <div className="slajder-slika-okvir">
          <img src="/images/placeholder.png" alt="Galerija sporta" />
        </div>
      </div>
    );
  }

  const prethodna = () => setIndeks((i) => (i === 0 ? slike.length - 1 : i - 1));
  const sljedeca = () => setIndeks((i) => (i === slike.length - 1 ? 0 : i + 1));

  return (
    <div className="sport-galerija-slajder">
      {slike.length > 1 && (
        <button type="button" className="slajder-btn prethodna" onClick={prethodna}>
          &#10094;
        </button>
      )}

      <div className="slajder-slika-okvir">
        <img src={apsolutnaSlika(slike[indeks])} alt="Galerija sporta" />
      </div>

      {slike.length > 1 && (
        <button type="button" className="slajder-btn sljedeca" onClick={sljedeca}>
          &#10095;
        </button>
      )}
    </div>
  );
}
