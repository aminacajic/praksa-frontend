import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import SearchBar from "../components/SearchBar.jsx";
import StanjeListe from "../components/StanjeListe.jsx";
import { useSportoviData } from "../hooks/useSportoviData.js";
import { usePretraga } from "../hooks/usePretraga.js";

const filtrirajSportove = (sport, pojam) =>
  sport.naziv.toLowerCase().includes(pojam) || sport.opis.toLowerCase().includes(pojam);

export default function Pocetna() {
  const { sportovi, ucitavanje, greska } = useSportoviData();
  const { pojam, setPojam, filtrirano } = usePretraga(sportovi, filtrirajSportove);
  const navigate = useNavigate();

  const otvoriSport = useCallback((id) => () => navigate(`/sport/${id}`), [navigate]);

  return (
    <>
      <section id="pocetna" className="hero">
        <div className="hero-image-container">
          <img className="hero-slika" src="/images/sport.png" alt="Sport Bosne i Hercegovine" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Sportisti BiH</h1>
          <p className="hero-subtitle">
            Dobrodošli u digitalnu bazu podataka najboljih sportista i sportskih kolektiva Bosne i
            Hercegovine. Upoznajte ambasadore koji našu domovinu predstavljaju u najboljem svjetlu
            širom svijeta.
          </p>
        </div>
      </section>

      <section id="sportisti" className="ponuda-sekcija">
        <div className="sekcija-zaglavlje">
          <h2>Sportovi</h2>
          <SearchBar value={pojam} onChange={setPojam} placeholder="Pretraži sportove..." />
        </div>

        <div className="ponuda-grid">
          <StanjeListe
            ucitavanje={ucitavanje}
            greska={greska}
            stavke={filtrirano}
            getKey={(sport) => sport.id}
            renderItem={(sport) => (
              <Card
                slika={sport.slika}
                naslov={sport.naziv}
                opis={sport.opis}
                napomena={`${sport.sportisti.length} sportista`}
                onClick={otvoriSport(sport.id)}
              />
            )}
          />
        </div>
      </section>
    </>
  );
}
