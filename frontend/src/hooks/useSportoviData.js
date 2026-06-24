import { useEffect, useState } from "react";

export function useSportoviData() {
  const [sportovi, setSportovi] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState(null);

  const ucitaj = () => {
    setUcitavanje(true);
    fetch("/data/podaci.json?t=" + new Date().getTime())
      .then((res) => {
        if (!res.ok) throw new Error("Problem sa učitavanjem JSON fajla");
        return res.json();
      })
      .then((podaci) => {
        setSportovi(podaci);
        setGreska(null);
      })
      .catch((err) => setGreska(err.message))
      .finally(() => setUcitavanje(false));
  };

  useEffect(() => {
    ucitaj();
  }, []);

  return { sportovi, ucitavanje, greska, ponovoUcitaj: ucitaj };
}
