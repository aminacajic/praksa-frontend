import { useState, useEffect } from "react";

const API_URL = "http://localhost/praksa/backend";

export function useSportoviData() {
  const [sportovi, setSportovi] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState(null);

  const popraviPutanju = (putanja) => {
    if (!putanja || putanja.startsWith("http")) return putanja;
    const cistaPutanja = putanja.startsWith(".")
      ? putanja.substring(1)
      : putanja.startsWith("/") ? putanja : "/" + putanja;
    return `${API_URL}${cistaPutanja}`;
  };

  const osvjeziPodatke = () => {
    setUcitavanje(true);
    fetch(`${API_URL}/get_sportovi.php`)
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri učitavanju sa PHP backend-a");
        return res.json();
      })
      .then((data) => {
        const mapiraniPodaci = data.map((sport) => ({
          ...sport,
          slika: popraviPutanju(sport.slika),
          galerija: (sport.galerija || []).map((gSlika) => popraviPutanju(gSlika)),
          sportisti: (sport.sportisti || []).map((sportista) => ({
            ...sportista,
            slika: popraviPutanju(sportista.slika),
          })),
        }));

        setSportovi(mapiraniPodaci);
        setGreska(null);
      })
      .catch((err) => setGreska(err.message))
      .finally(() => setUcitavanje(false));
  };

  const izvrsiPretragu = (pojam) => {
    setUcitavanje(true);

    fetch(`${API_URL}/pretrazi_sportiste.php?pojam=${encodeURIComponent(pojam)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Greška prilikom pretrage na serveru.");
        return res.json();
      })
      .then((data) => {
        const mapiraniPodaci = data.map((sport) => ({
          ...sport,
          slika: popraviPutanju(sport.slika),
          galerija: (sport.galerija || []).map((gSlika) => popraviPutanju(gSlika)),
          sportisti: (sport.sportisti || []).map((s) => ({
            ...s,
            slika: popraviPutanju(s.slika),
          })),
        }));
        setSportovi(mapiraniPodaci);
        setGreska(null);
      })
      .catch((err) => setGreska(err.message))
      .finally(() => setUcitavanje(false));
  };

  useEffect(() => {
    osvjeziPodatke();
  }, []);

  function sacuvajSport(podaciSporta, isEdit = false) {
    const formData = new FormData();
    if (isEdit) {
      formData.append("id", podaciSporta.id);
    }
    formData.append("naziv", podaciSporta.naziv);
    formData.append("opis", podaciSporta.opis);
    formData.append("savez", podaciSporta.savez);
    formData.append("pozicije", JSON.stringify(podaciSporta.pozicije));

    if (podaciSporta.slika) {
      formData.append("slika", podaciSporta.slika);
    }

    if (podaciSporta.galerija && podaciSporta.galerija.length > 0) {
      podaciSporta.galerija.forEach((fajl) => {
        formData.append("galerija[]", fajl);
      });
    }

    const skripta = isEdit ? "uredi_sport.php" : "dodaj_sport.php";

    fetch(`${API_URL}/${skripta}`, {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const greskaSaServera = await res.json();
          throw new Error(greskaSaServera.poruka || "Greška na serveru.");
        }
        return res.json();
      })
      .then((odgovor) => {
        alert(odgovor.poruka);
        osvjeziPodatke();
      })
      .catch((err) => alert(err.message));
  }

  function obrisiSport(sportId) {
    if (!window.confirm("Da li ste sigurni da želite obrisati cijeli ovaj sport i sve njegove sportiste?")) return;

    fetch(`${API_URL}/obrisi_sport.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sportId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška na PHP serveru prilikom brisanja sporta.");
        return res.json();
      })
      .then((odgovor) => {
        alert(odgovor.poruka);
        osvjeziPodatke();
      })
      .catch((err) => alert(err.message));
  }

  function sacuvajSportistu(sportId, podaciSportiste, sportistaIdZaIzmjenu) {
    const isEdit = !!sportistaIdZaIzmjenu;
    const formData = new FormData();
    formData.append("sportId", sportId);
    formData.append("ime", podaciSportiste.ime);
    formData.append("uloga", podaciSportiste.uloga);
    formData.append("info", podaciSportiste.info);

    const slikaInput = document.getElementById("sportista-slika");
    if (slikaInput && slikaInput.files[0]) {
      formData.append("slika", slikaInput.files[0]);
    }

    if (!isEdit) {
      fetch(`${API_URL}/dodaj_sportistu.php`, { method: "POST", body: formData })
        .then(async (res) => {
          if (!res.ok) throw new Error((await res.json()).poruka || "Greška pri dodavanju.");
          return res.json();
        })
        .then((odgovor) => { alert(odgovor.poruka); osvjeziPodatke(); })
        .catch((err) => alert(err.message));
    } else {
      formData.append("sportistaId", sportistaIdZaIzmjenu);
      fetch(`${API_URL}/uredi_sportistu.php`, { method: "POST", body: formData })
        .then(async (res) => {
          if (!res.ok) throw new Error((await res.json()).poruka || "Greška pri uređivanju.");
          return res.json();
        })
        .then((odgovor) => { alert(odgovor.poruka); osvjeziPodatke(); })
        .catch((err) => alert(err.message));
    }
  }

  function obrisiSportistu(sportistaId, ime) {
    if (!window.confirm(`Da li ste sigurni da želite obrisati sportistu ${ime}?`)) return;

    fetch(`${API_URL}/obrisi_sportistu.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sportistaId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška na PHP serveru prilikom brisanja.");
        return res.json();
      })
      .then((odgovor) => {
        alert(odgovor.poruka);
        osvjeziPodatke();
      })
      .catch((err) => alert(err.message));
  }

  return {
    sportovi,
    ucitavanje,
    greska,
    izvrsiPretragu,
    sacuvajSport,
    obrisiSport,
    sacuvajSportistu,
    obrisiSportistu,
  };
}