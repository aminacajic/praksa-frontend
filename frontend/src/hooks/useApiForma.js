import { useState } from "react";

export function useApiForma(url, onUspjeh) {
  const [salje, setSalje] = useState(false);

  function posalji(formData) {
    setSalje(true);
    return fetch(url, { method: "POST", body: formData })
      .then((res) => {
        if (!res.ok) throw new Error("Server je vratio grešku " + res.status);
        return res.json();
      })
      .then((odgovor) => {
        alert(odgovor.poruka);
        onUspjeh?.();
      })
      .catch((err) => alert("Greška: " + err.message))
      .finally(() => setSalje(false));
  }

  return { salje, posalji };
}
