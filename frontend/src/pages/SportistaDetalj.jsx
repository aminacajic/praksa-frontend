import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSportoviData } from "../hooks/useSportoviData.js";
import { apsolutnaSlika } from "../utils/putanje.js";

export default function SportistaDetalj() {
  const { sportId, sportistaId } = useParams();
  const navigate = useNavigate();
  const { sportovi, ucitavanje } = useSportoviData();

  const sportIdBroj     = Number(sportId);
  const sportistaIdBroj = Number(sportistaId);

  const sportista = useMemo(() => {
    const sport = sportovi.find((s) => s.id === sportIdBroj);
    return sport ? sport.sportisti.find((sp) => sp.id === sportistaIdBroj) : null;
  }, [sportovi, sportIdBroj, sportistaIdBroj]);

  if (ucitavanje) {
    return (
      <section className="sekcija-zaglavlje sportista-sekcija">
        <p className="učitavanje-poruka">Učitavanje...</p>
      </section>
    );
  }

  if (!sportista) {
    return (
      <section className="sekcija-zaglavlje sportista-sekcija">
        <div className="sport-tekst">
          <h2>Sportista nije pronađen</h2>
          <button onClick={() => navigate(-1)} className="slajder-btn sportista-btn-nazad">
            &larr; Nazad
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="sekcija-zaglavlje sportista-sekcija">
      <div className="sport-detalji-kontejner">
        <div className="sport-galerija-slajder sportista-slajder-okvir">
          <div className="slajder-slika-okvir sportista-visina-okvira">
            <img
              src={apsolutnaSlika(sportista.slika)}
              alt={sportista.ime}
              className="sportista-img"
            />
          </div>
        </div>

        <div className="sport-tekst sportista-tekst-okvir">
          <h2>{sportista.ime}</h2>
          <strong className="sportista-uloga">{sportista.uloga}</strong>

          <div className="sportista-biografija-kutija">
            <h4>Biografija i najveći uspjesi:</h4>
            <p>{sportista.info}</p>
          </div>

          <button onClick={() => navigate(-1)} className="slajder-btn sportista-btn-nazad">
            &larr; Nazad
          </button>
        </div>
      </div>
    </section>
  );
}
