document.addEventListener("DOMContentLoaded", () => {
    const vijestiGrid = document.getElementById("vijesti-grid");
    if (!vijestiGrid) return;

    fetch('https://dummyjson.com/products/category/sports-accessories?limit=6')
    /* fetch('https://jsonplaceholder.typicode.com/posts?_limit=10') */
        .then(response => {
            if (!response.ok) {
                throw new Error("Mrežna greška prilikom povlačenja podataka.");
            }
            return response.json();
        })
        .then(podaci => { 
            vijestiGrid.innerHTML = ""; 

            const proizvodi = podaci.products || [];
            proizvodi.forEach(proizvod => {
                const slikaArtikla = proizvod.thumbnail || "https://picsum.photos/200/150";

                const karticaArtikla = `
                    <div class="ponuda-kartica">
                        <div class="vijesti-slika-okvir">
                            <img src="${slikaArtikla}" alt="${proizvod.title}" class="kartica-slika" style="object-fit: contain; background: #f8fafc;">
                        </div>
                        <div class="vijesti-sadrzaj">
                            <span class="vijesti-izvor" style="margin-top: 0; margin-bottom: 5px;">Brend: ${proizvod.brand || 'Sport'}</span>
                            <h3 class="vijesti-naslov">${proizvod.title}</h3>
                            <p class="vijesti-tekst">
                                ${proizvod.description}
                            </p>
                            <small class="vijesti-izvor" style="color: #1a3322; font-size: 16px;">
                                Cijena: <strong>${proizvod.price} USD</strong>
                            </small>
                            <small class="vijesti-izvor" style="color: #a3c6a8; margin-top: 5px;">
                                Ocjena: ⭐ ${proizvod.rating} | API ID: #0${proizvod.id}
                            </small>
                        </div>
                    </div>
                `;
                vijestiGrid.innerHTML += karticaArtikla;
            });
        }) 
      /* .then(podaci => {
            vijestiGrid.innerHTML = ""; 
            const objave = podaci || []; 
            objave.forEach(objava => {
                const karticaArtikla = `
                    <div class="ponuda-kartica">
                        <div class="vijesti-sadrzaj">
                            <h3 class="vijesti-naslov">${objava.title}</h3>
                            <p class="vijesti-tekst">${objava.body}</p>
                        </div>
                    </div>
                `;
                vijestiGrid.innerHTML += karticaArtikla;
            });
        }) */
        .catch(error => {
            console.error("Greška sa javnim API-jem:", error);
            vijestiGrid.innerHTML = `
                <p class="nema-rezultata-poruka" style="grid-column: 1/-1; text-align: center; color: #e53e3e;">
                    Nije moguće učitati sportske artikle sa API-ja.
                </p>
            `;
        });
});