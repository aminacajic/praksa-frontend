import SearchBar from "../../components/SearchBar.jsx";
import { apsolutnaSlika } from "../../utils/putanje.js";
import { usePretraga } from "../../hooks/usePretraga.js";

const sportSeUklapa = (sport, pojam) =>
  sport.naziv.toLowerCase().includes(pojam) ||
  (sport.sportisti || []).some(
    (sp) => sp.ime.toLowerCase().includes(pojam) || (sp.uloga && sp.uloga.toLowerCase().includes(pojam))
  );

export default function AdminUpravljanje({ sportovi, onUrediSport, onUrediSportistu, onPromjena }) {
  const { pojam, setPojam, filtrirano } = usePretraga(sportovi, sportSeUklapa);

  function obrisiSport(sportId) {
    if (!confirm("Da li sigurno želite obrisati cijeli ovaj sport i sve njegove sportiste?")) return;
    fetch(`/api/obrisi-sport/${sportId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((odg) => {
        alert(odg.poruka);
        onPromjena();
      });
  }

  function obrisiSportistu(sportId, ime) {
    if (!confirm(`Da li sigurno želite obrisati sportistu: ${ime}?`)) return;
    fetch(`/api/obrisi-sportistu/${sportId}/${encodeURIComponent(ime)}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((odg) => {
        alert(odg.poruka);
        onPromjena();
      });
  }

  return (
    <section className="admin-sekcija">
      <h2>Pregled i upravljanje podacima</h2>
      <div style={{ marginBottom: 20 }}>
        <SearchBar value={pojam} onChange={setPojam} placeholder="Pretraži po sportu ili sportisti..." />
      </div>

      {filtrirano.length === 0 && (
        <p className="nema-rezultata-poruka">Nema rezultata za vašu pretragu u administraciji.</p>
      )}

      {filtrirano.map((sport) => (
        <div className="upravljanje-sport-blok" key={sport.id}>
          <div className="upravljanje-red upravljanje-zaglavlje-bloka">
            <div className="upravljanje-info">
              <img
                className="upravljanje-mini-slika slika-obla"
                src={apsolutnaSlika(sport.slika)}
                alt={sport.naziv}
              />
              <h3>
                {sport.naziv} (ID: {sport.id})
              </h3>
            </div>
            <div className="upravljanje-akcije">
              <button className="btn-uredi" onClick={() => onUrediSport(sport)}>
                Uredi sport
              </button>
              <button className="btn-obrisi" onClick={() => obrisiSport(sport.id)}>
                Obriši sport
              </button>
            </div>
          </div>

          <div className="upravljanje-sportisti-lista">
            {(sport.sportisti || []).length === 0 ? (
              <p style={{ color: "#888", fontSize: 13 }}>Nema unesenih sportista.</p>
            ) : (
              sport.sportisti.map((sp) => (
                <div className="upravljanje-red" key={sp.ime}>
                  <div className="upravljanje-info">
                    <img className="upravljanje-mini-slika" src={apsolutnaSlika(sp.slika)} alt={sp.ime} />
                    <div>
                      <strong>{sp.ime}</strong> <small>({sp.uloga})</small>
                    </div>
                  </div>
                  <div className="upravljanje-akcije">
                    <button className="btn-uredi" onClick={() => onUrediSportistu(sport.id, sp)}>
                      Uredi
                    </button>
                    <button className="btn-obrisi" onClick={() => obrisiSportistu(sport.id, sp.ime)}>
                      Obriši
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
