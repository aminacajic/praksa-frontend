import { useMemo, useState } from "react";

export function usePretraga(lista, filterFn) {
  const [pojam, setPojam] = useState("");
  const filtrirano = useMemo(() => {
    if (!pojam.trim()) return lista;
    const pojamLower = pojam.toLowerCase();
    return lista.filter((stavka) => filterFn(stavka, pojamLower));
  }, [lista, pojam, filterFn]);

  return { pojam, setPojam, filtrirano };
}
