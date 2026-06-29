import { useMemo, useState } from "react";

export function usePretraga(lista, filterFn) {
  const [pojam, setPojam] = useState("");

  const filtrirano = useMemo(() => {
    if (!pojam.trim()) return lista;
    const pojamLower = pojam.toLowerCase().trim();

    return lista
      .map((sport) => {
        if (sport.naziv.toLowerCase().includes(pojamLower)) {
          return sport;
        }

        const filtriraniSportisti = (sport.sportisti || []).filter(
          (sp) =>
            sp.ime.toLowerCase().includes(pojamLower) ||
            (sp.uloga && sp.uloga.toLowerCase().includes(pojamLower))
        );

        return {
          ...sport,
          sportisti: filtriraniSportisti,
        };
      })
      .filter((sport) => sport.sportisti.length > 0);
  }, [lista, pojam]);

  return { pojam, setPojam, filtrirano };
}