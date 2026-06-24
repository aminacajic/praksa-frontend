import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import StanjeListe from "../components/StanjeListe.jsx";

export default function Vijesti() {
  const [proizvodi, setProizvodi] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState(null);

  useEffect(() => {
    fetch("https://dummyjson.com/products/category/sports-accessories?limit=6")
      .then((res) => {
        if (!res.ok) throw new Error("Mrežna greška prilikom povlačenja podataka.");
        return res.json();
      })
      .then((podaci) => setProizvodi(podaci.products || []))
      .catch((err) => setGreska(err.message))
      .finally(() => setUcitavanje(false));
  }, []);

  return (
    <section className="ponuda-sekcija">
      <div className="sekcija-zaglavlje-vijesti">
        <h2>Svjetski sportski market</h2>
      </div>

      <div className="ponuda-grid">
        <StanjeListe
          ucitavanje={ucitavanje}
          greska={greska}
          stavke={proizvodi}
          porukaUcitavanja="Učitavanje artikala sa vanjskog API-ja..."
          porukaGreske="Nije moguće učitati sportske artikle sa API-ja."
          getKey={(proizvod) => proizvod.id}
          renderItem={(proizvod) => (
            <Card
              slika={proizvod.thumbnail || "https://picsum.photos/200/150"}
              naslov={proizvod.title}
              podnaslov={`Brend: ${proizvod.brand || "Sport"}`}
              opis={proizvod.description}
              napomena={`Cijena: ${proizvod.price} USD  ⭐ ${proizvod.rating}`}
            />
          )}
        />
      </div>
    </section>
  );
}
