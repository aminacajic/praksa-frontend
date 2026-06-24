import { Fragment } from "react";

export default function StanjeListe({
  ucitavanje,
  greska,
  stavke,
  porukaGreske = "Greška pri učitavanju podataka.",
  porukaPraznine = "Nema rezultata za vašu pretragu.",
  porukaUcitavanja = "Učitavanje...",
  renderItem,
  getKey,
}) {
  if (ucitavanje) return <p className="učitavanje-poruka">{porukaUcitavanja}</p>;
  if (greska) return <p className="nema-rezultata-poruka">{porukaGreske}</p>;
  if (!stavke || stavke.length === 0) return <p className="nema-rezultata-poruka">{porukaPraznine}</p>;

  return stavke.map((stavka, indeks) => (
    <Fragment key={getKey ? getKey(stavka) : indeks}>{renderItem(stavka)}</Fragment>
  ));
}
