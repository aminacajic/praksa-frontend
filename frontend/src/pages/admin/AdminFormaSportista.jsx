import { useMemo, useRef, useState } from "react";
import FormGroup from "../../components/FormGroup.jsx";
import SlikaPostojeca from "../../components/SlikaPostojeca.jsx";

const NOVA_POZICIJA_VRIJEDNOST = "__nova__";

export default function AdminFormaSportista({ sportovi, sportistaZaIzmjenu, onSacuvaj }) {
  const imeRef = useRef();
  const infoRef = useRef();
  const slikaRef = useRef();

  const jeIzmjena = Boolean(sportistaZaIzmjenu);

  const [odabraniSportId, setOdabraniSportId] = useState(sportistaZaIzmjenu?.sportId || "");
  const [odabranaUloga, setOdabranaUloga] = useState(sportistaZaIzmjenu?.uloga || "");
  const [novaPozicija, setNovaPozicija] = useState("");

  const pozicije = useMemo(
    () => sportovi.find((s) => s.id === odabraniSportId)?.pozicije || [],
    [sportovi, odabraniSportId]
  );

  function obradiSubmit(e) {
    e.preventDefault();

    const finalnaUloga =
      odabranaUloga === NOVA_POZICIJA_VRIJEDNOST ? novaPozicija.trim() : odabranaUloga;

    if (!odabraniSportId || !finalnaUloga) {
      alert("Molimo izaberite sport i poziciju.");
      return;
    }

    // Nema backenda, pa se odabrana slika samo privremeno pretvara u lokalni blob URL, ne čuva se trajno
    const novaSlika = slikaRef.current.files[0]
      ? URL.createObjectURL(slikaRef.current.files[0])
      : sportistaZaIzmjenu?.slika || "";

    onSacuvaj(odabraniSportId, {
      ime: imeRef.current.value,
      uloga: finalnaUloga,
      info: infoRef.current.value,
      slika: novaSlika,
    });

    alert(jeIzmjena ? "Uspješno izmijenjen sportista!" : "Uspješno sačuvan sportista!");
  }

  return (
    <section className="admin-sekcija">
      <h2>{jeIzmjena ? "Uredi sportistu" : "Dodaj novog sportistu"}</h2>
      <form onSubmit={obradiSubmit}>
        <FormGroup label="Izaberi matični sport:" htmlFor="odabir-sporta">
          <select
            id="odabir-sporta"
            required
            value={odabraniSportId}
            onChange={(e) => {
              setOdabraniSportId(e.target.value);
              setOdabranaUloga("");
            }}
          >
            <option value="" disabled>
              Izaberi matični sport...
            </option>
            {sportovi.map((s) => (
              <option key={s.id} value={s.id}>
                {s.naziv}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup label="Ime i prezime:" htmlFor="sportista-ime">
          <input
            type="text"
            id="sportista-ime"
            ref={imeRef}
            required
            defaultValue={sportistaZaIzmjenu?.ime || ""}
            placeholder="npr. Damir Džumhur"
          />
        </FormGroup>

        <FormGroup label="Uloga / pozicija u timu:" htmlFor="sportista-uloga-select">
          <select
            id="sportista-uloga-select"
            required
            value={odabranaUloga}
            onChange={(e) => setOdabranaUloga(e.target.value)}
            disabled={!odabraniSportId}
          >
            <option value="" disabled>
              {odabraniSportId ? "Izaberi poziciju..." : "Prvo izaberite sport..."}
            </option>
            {pozicije.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
            <option value={NOVA_POZICIJA_VRIJEDNOST}>+ Dodaj novu poziciju</option>
          </select>
        </FormGroup>

        {odabranaUloga === NOVA_POZICIJA_VRIJEDNOST && (
          <FormGroup label="Unesite novu poziciju:" htmlFor="sportista-uloga-nova">
            <input
              type="text"
              id="sportista-uloga-nova"
              value={novaPozicija}
              onChange={(e) => setNovaPozicija(e.target.value)}
              placeholder="npr. Bek šuter"
              required
              style={{ borderColor: "#e67e22" }}
            />
          </FormGroup>
        )}

        <FormGroup label="Uploaduj sliku sportiste:" htmlFor="sportista-slika">
          <input type="file" id="sportista-slika" ref={slikaRef} accept="image/*" required={!jeIzmjena} />
        </FormGroup>

        <SlikaPostojeca
          putanja={sportistaZaIzmjenu?.slika}
          napomena="(koristi se ako ne odaberete novu)"
        />

        <FormGroup label="Biografija i najveći uspjesi:" htmlFor="sportista-info">
          <textarea
            id="sportista-info"
            ref={infoRef}
            rows="4"
            required
            defaultValue={sportistaZaIzmjenu?.info || ""}
            placeholder="Napiši ključne uspjehe..."
          />
        </FormGroup>

        <button type="submit" className={`btn-spasi ${jeIzmjena ? "mod-izmjena-sportista" : ""}`}>
          {jeIzmjena ? "Sačuvaj izmjene" : "Sačuvaj"}
        </button>
      </form>
    </section>
  );
}
