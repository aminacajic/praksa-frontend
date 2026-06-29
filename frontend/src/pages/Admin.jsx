import { useState } from "react";
import { useSportoviData } from "../hooks/useSportoviData.js";
import AdminFormaSport from "./admin/AdminFormaSport.jsx";
import AdminFormaSportista from "./admin/AdminFormaSportista.jsx";
import AdminUpravljanje from "./admin/AdminUpravljanje.jsx";

export default function Admin() {
  const { sportovi, sacuvajSport, obrisiSport, sacuvajSportistu, obrisiSportistu } = useSportoviData();

  const [tab, setTab] = useState("sport"); 
  const [sportZaIzmjenu, setSportZaIzmjenu] = useState(null);
  const [sportistaZaIzmjenu, setSportistaZaIzmjenu] = useState(null);

  function otvoriNoviSport() {
    setSportZaIzmjenu(null);
    setTab("sport");
  }

  function otvoriNovogSportistu() {
    setSportistaZaIzmjenu(null);
    setTab("sportista");
  }

  function otvoriUpravljanje() {
    setTab("upravljanje");
  }

  function urediSport(sport) {
    setSportZaIzmjenu(sport);
    setTab("sport");
  }

  function urediSportistu(sportId, sportista) {
    setSportistaZaIzmjenu({ ...sportista, sportId });
    setTab("sportista");
  }

  function vratiNaUpravljanje() {
    setSportZaIzmjenu(null);
    setSportistaZaIzmjenu(null);
    setTab("upravljanje");
  }

  function obradiSacuvajSport(podaciSporta) {
    sacuvajSport(podaciSporta);
    vratiNaUpravljanje();
  }

  function obradiSacuvajSportistu(sportId, podaciSportiste) {
    sacuvajSportistu(sportId, podaciSportiste, sportistaZaIzmjenu?.ime);
    vratiNaUpravljanje();
  }

  return (
    <div className="admin-kontejner">
      <div className="odabir-akcije">
        <p>Šta želite raditi u bazi podataka?</p>
        <button type="button" className={`btn-izbor ${tab === "sport" ? "aktivno" : ""}`} onClick={otvoriNoviSport}>
          Novi sport
        </button>
        <button
          type="button"
          className={`btn-izbor ${tab === "sportista" ? "aktivno" : ""}`}
          onClick={otvoriNovogSportistu}
        >
          Novi sportista
        </button>
        <button
          type="button"
          className={`btn-izbor ${tab === "upravljanje" ? "aktivno" : ""}`}
          onClick={otvoriUpravljanje}
        >
          Uređivanje
        </button>
      </div>

      {tab === "sport" && (
        <AdminFormaSport
          key={sportZaIzmjenu?.id || "novi-sport"}
          sportZaIzmjenu={sportZaIzmjenu}
          onSacuvaj={obradiSacuvajSport}
        />
      )}

      {tab === "sportista" && (
        <AdminFormaSportista
          key={sportistaZaIzmjenu ? `${sportistaZaIzmjenu.sportId}-${sportistaZaIzmjenu.ime}` : "novi-sportista"}
          sportovi={sportovi}
          sportistaZaIzmjenu={sportistaZaIzmjenu}
          onSacuvaj={obradiSacuvajSportistu}
        />
      )}

      {tab === "upravljanje" && (
        <AdminUpravljanje
          sportovi={sportovi}
          onUrediSport={urediSport}
          onUrediSportistu={urediSportistu}
          onObrisiSport={obrisiSport}
          onObrisiSportistu={obrisiSportistu}
        />
      )}
    </div>
  );
}
