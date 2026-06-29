import { useRef } from "react";
import FormGroup from "../../components/FormGroup.jsx";
import SlikaPostojeca from "../../components/SlikaPostojeca.jsx";

export default function AdminFormaSport({ sportZaIzmjenu, onSacuvaj }) {
  const idRef = useRef();
  const nazivRef = useRef();
  const opisRef = useRef();
  const savezRef = useRef();
  const pozicijeRef = useRef();
  const slikaRef = useRef();
  const galerijaRef = useRef();

  const jeIzmjena = Boolean(sportZaIzmjenu);

  function obradiSubmit(e) {
    e.preventDefault();

    // Nema backenda, pa se odabrana slika samo privremeno pretvara u lokalni blob URL, ne čuva se trajno
    const novaSlika = slikaRef.current.files[0]
      ? URL.createObjectURL(slikaRef.current.files[0])
      : sportZaIzmjenu?.slika || "";

    const novaGalerija = galerijaRef.current.files.length
      ? Array.from(galerijaRef.current.files).map((f) => URL.createObjectURL(f))
      : sportZaIzmjenu?.galerija || [];

    const pozicijeNiz = pozicijeRef.current.value
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    onSacuvaj({
      id: idRef.current.value,
      naziv: nazivRef.current.value,
      opis: opisRef.current.value,
      savez: savezRef.current.value,
      slika: novaSlika,
      galerija: novaGalerija,
      pozicije: pozicijeNiz,
    });

    alert(jeIzmjena ? "Sport uspješno izmijenjen!" : "Novi sport uspješno sačuvan!");
  }

  return (
    <section className="admin-sekcija">
      <h2>{jeIzmjena ? "Uredi sport" : "Dodaj novi sport"}</h2>
      <form onSubmit={obradiSubmit}>
        <FormGroup label="ID sporta (mora biti jedna riječ, npr: kosarka, tenis):" htmlFor="sport-id">
          <input
            type="text"
            id="sport-id"
            ref={idRef}
            required
            disabled={jeIzmjena}
            defaultValue={sportZaIzmjenu?.id || ""}
            placeholder="npr. tenis"
          />
        </FormGroup>

        <FormGroup label="Naziv sporta:" htmlFor="sport-naziv-unos">
          <input
            type="text"
            id="sport-naziv-unos"
            ref={nazivRef}
            required
            defaultValue={sportZaIzmjenu?.naziv || ""}
            placeholder="npr. Tenis"
          />
        </FormGroup>

        <FormGroup label="Uploaduj sliku sporta:" htmlFor="sport-slika">
          <input type="file" id="sport-slika" ref={slikaRef} accept="image/*" required={!jeIzmjena} />
        </FormGroup>

        <SlikaPostojeca
          putanja={sportZaIzmjenu?.slika}
          napomena="(zadržava se ako ne odaberete novu)"
        />

        <FormGroup
          label="Uploaduj slike za galeriju (možete odabrati više slika odjednom):"
          htmlFor="sport-galerija"
        >
          <input type="file" id="sport-galerija" ref={galerijaRef} accept="image/*" multiple />
        </FormGroup>

        <FormGroup label="Pozicije za ovaj sport (odvojite zarezom):" htmlFor="sport-pozicije-inicijalne">
          <input
            type="text"
            id="sport-pozicije-inicijalne"
            ref={pozicijeRef}
            required
            defaultValue={sportZaIzmjenu?.pozicije ? sportZaIzmjenu.pozicije.join(", ") : ""}
            placeholder="npr. Napadač, Vezni, Golman"
          />
        </FormGroup>

        <FormGroup label="Kratki opis:" htmlFor="sport-opis">
          <textarea
            id="sport-opis"
            ref={opisRef}
            rows="3"
            required
            defaultValue={sportZaIzmjenu?.opis || ""}
            placeholder="Kratki opis..."
          />
        </FormGroup>

        <FormGroup label="Detaljan opis:" htmlFor="sport-savez">
          <textarea
            id="sport-savez"
            ref={savezRef}
            rows="3"
            required
            defaultValue={sportZaIzmjenu?.savez || ""}
            placeholder="Detaljan opis..."
          />
        </FormGroup>

        <button type="submit" className={`btn-spasi ${jeIzmjena ? "mod-izmjena-sport" : ""}`}>
          {jeIzmjena ? "Sačuvaj izmjene" : "Sačuvaj sport"}
        </button>
      </form>
    </section>
  );
}
