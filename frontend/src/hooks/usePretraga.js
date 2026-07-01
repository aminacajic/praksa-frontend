import { useMemo, useState } from "react";

export function usePretraga(lista, filterFn) {
  const [pojam, setPojam] = useState("");

  const filtrirano = useMemo(() => {
    if (!pojam.trim()) return lista;
    const pojamLower = pojam.toLowerCase().trim();

    if (typeof filterFn === "function") {
      return lista.filter((item) => filterFn(item, pojamLower));
    }

    return lista
      .map((sport) => {
        if (sport.naziv && sport.naziv.toLowerCase().includes(pojamLower)) {
          return sport;
        }

        const filtriraniSportisti = (sport.sportisti || []).filter(
          (sp) =>
            (sp.ime && sp.ime.toLowerCase().includes(pojamLower)) ||
            (sp.uloga && sp.uloga.toLowerCase().includes(pojamLower))
        );

        return {
          ...sport,
          sportisti: filtriraniSportisti,
        };
      })
      .filter((sport) => (sport.sportisti || []).length > 0);
  }, [lista, pojam, filterFn]);

  return { pojam, setPojam, filtrirano };
}