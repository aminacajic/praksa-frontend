import { useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Slider from "../components/Slider.jsx";
import StanjeListe from "../components/StanjeListe.jsx";
import { useSportoviData } from "../hooks/useSportoviData.js";
import { usePretraga } from "../hooks/usePretraga.js";

const filtrirajSportiste = (sp, pojam) =>
  sp.ime.toLowerCase().includes(pojam) || (sp.uloga && sp.uloga.toLowerCase().includes(pojam));

export default function SportDetalj() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sportovi, ucitavanje } = useSportoviData();

  const sport = useMemo(() => sportovi.find((s) => s.id === id), [sportovi, id]);
  const { pojam, setPojam, filtrirano } = usePretraga(sport?.sportisti || [], filtrirajSportiste);

  const otvoriSportistu = useCallback(
    (ime) => () => navigate(`/sportista/${id}/${encodeURIComponent(ime)}`),
    [navigate, id]
  );

  if (ucitavanje) {
    return (
      <section className="sekcija-zaglavlje">
        <p className="učitavanje-poruka">Učitavanje...</p>
      </section>
    );
  }

  if (!sport) {
    return (
      <section className="sekcija-zaglavlje">
        <div className="sport-tekst">
          <h2>Sport nije pronađen</h2>
          <p>Traženi sport ne postoji u bazi.</p>
        </div>
      </section>
    );
  }

  const slikeGalerije = sport.galerija && sport.galerija.length > 0 ? sport.galerija : [sport.slika];

  return (
    <>
      <section className="sekcija-zaglavlje">
        <div className="sport-detalji-kontejner">
          <div className="sport-tekst">
            <h2>{sport.naziv}</h2>
            <p>{sport.savez}</p>
          </div>

          <Slider slike={slikeGalerije} />
        </div>
      </section>

      <section className="ponuda-sekcija">
        <div className="sekcija-zaglavlje-sportisti">
          <h3 className="naslov-sekcije">Sportisti</h3>
          <SearchBar value={pojam} onChange={setPojam} placeholder="Pretraži sportiste ovog sporta..." />
        </div>

        <div className="ponuda-grid">
          <StanjeListe
            stavke={filtrirano}
            porukaPraznine="Nema pronađenih sportista za vašu pretragu."
            getKey={(sp) => sp.ime}
            renderItem={(sportista) => (
              <Card
                slika={sportista.slika}
                naslov={sportista.ime}
                podnaslov={sportista.uloga}
                opis={sportista.info}
                onClick={otvoriSportistu(sportista.ime)}
              />
            )}
          />
        </div>
      </section>
    </>
  );
}
