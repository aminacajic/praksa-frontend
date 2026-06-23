document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("ponuda-grid");
    if (!grid) return;

    let sviSportovi = [];

    function dohvatiNaziveSportova(sportovi) {
        return sportovi.map(sport => sport.naziv);
    }

    function filtrirajSportove(sportovi, pojam) {
        return sportovi.filter(sport =>
            sport.naziv.toLowerCase().includes(pojam.toLowerCase()) ||
            sport.opis.toLowerCase().includes(pojam.toLowerCase())
        );
    }
 
    function pronadiSportPoId(sportovi, id) {
        return sportovi.find(sport => sport.id === id);
    }

    function prikaziSportove(sportovi) {
        grid.innerHTML = "";

        if (sportovi.length === 0) {
            grid.innerHTML = `<p class="nema-rezultata-poruka">Nema rezultata za vašu pretragu.</p>`;
            return;
        }

        sportovi.forEach(sport => {
            const kartica = `
                <div class="ponuda-kartica" style="cursor: pointer;" 
                     onclick="window.location.href='sport.html?id=${sport.id}'">
                    <div class="kartica-slika-wrapper">
                        <img src="${sport.slika}" alt="${sport.naziv}" class="kartica-slika">
                    </div>
                    <div class="kartica-sadrzaj">
                        <h3>${sport.naziv}</h3>
                        <p>${sport.opis}</p>
                        <small style="color: #a3c6a8;">
                            ${sport.sportisti.length} sportista
                        </small>
                    </div>
                </div>
            `;
            grid.innerHTML += kartica;
        });

        const statistike = {
            ukupnoSportova: sportovi.length,
            ukupnoSportista: sportovi.reduce((suma, s) => suma + s.sportisti.length, 0),
            nazivi: dohvatiNaziveSportova(sportovi)
        };
        console.log("Statistike:", statistike);
    }

    const searchInput = document.querySelector("#search-input");

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            const pojam = event.target.value;
            const filtrirani = filtrirajSportove(sviSportovi, pojam);
            prikaziSportove(filtrirani);

            const tacnoPodudaranje = pronadiSportPoId(sviSportovi, pojam.toLowerCase());
            if (tacnoPodudaranje) {
                console.log("Pronađen sport po ID-u:", tacnoPodudaranje);
            }
        });
    }

    fetch('./data/podaci.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Problem sa učitavanjem JSON fajla");
            }
            return response.json();
        })
        .then(sportovi => {
            sviSportovi = sportovi;
            prikaziSportove(sviSportovi);
        })
        .catch(error => {
            console.error("Greška pri učitavanju glavnog grida:", error);
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #e53e3e;">
                Greška pri učitavanju podataka.
            </p>`;
        });
});