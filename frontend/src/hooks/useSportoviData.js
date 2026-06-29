import { useState } from "react";
import { podaciInicijalni } from "../data/podaci.js";
 //Pošto backend još ne postoji, sve izmjene (dodavanje/uređivanje/brisanje) ne preživljavaju refresh stranice
 
export function useSportoviData() {
  const [sportovi, setSportovi] = useState(podaciInicijalni);

  // Dodavanje ili izmjena sporta
  function sacuvajSport(podaciSporta) {
    setSportovi((prethodni) => {
      const postoji = prethodni.some((s) => s.id === podaciSporta.id);
      if (postoji) {
        return prethodni.map((s) => (s.id === podaciSporta.id ? { ...s, ...podaciSporta } : s));
      }
      return [...prethodni, { ...podaciSporta, sportisti: [] }];
    });
  }

  function obrisiSport(sportId) {
    setSportovi((prethodni) => prethodni.filter((s) => s.id !== sportId));
  }

  // Dodavanje ili izmjena sportiste
  function sacuvajSportistu(sportId, podaciSportiste, originalnoIme) {
    setSportovi((prethodni) =>
      prethodni.map((sport) => {
        if (sport.id !== sportId) return sport;

        const postojeci = sport.sportisti.find(
          (sp) => sp.ime === (originalnoIme || podaciSportiste.ime)
        );

        const novaPozicije =
          sport.pozicije && sport.pozicije.includes(podaciSportiste.uloga)
            ? sport.pozicije
            : [...(sport.pozicije || []), podaciSportiste.uloga];

        const noviSportisti = postojeci
          ? sport.sportisti.map((sp) => (sp === postojeci ? podaciSportiste : sp))
          : [...sport.sportisti, podaciSportiste];

        return { ...sport, pozicije: novaPozicije, sportisti: noviSportisti };
      })
    );
  }

  function obrisiSportistu(sportId, ime) {
    setSportovi((prethodni) =>
      prethodni.map((sport) =>
        sport.id !== sportId ? sport : { ...sport, sportisti: sport.sportisti.filter((sp) => sp.ime !== ime) }
      )
    );
  }

  return {
    sportovi,
    ucitavanje: false,
    greska: null,
    sacuvajSport,
    obrisiSport,
    sacuvajSportistu,
    obrisiSportistu,
  };
}
