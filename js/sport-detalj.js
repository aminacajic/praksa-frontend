document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sportId = urlParams.get('id');

    if (!sportId) return;

    let slikeZaSlajder = [];
    let trenutniIndeks = 0;
    
    let sviSportistiIzSporta = [];
    const searchSportistiInput = document.getElementById("search-sportisti-input");

    const slikaElement = document.getElementById("slajder-trenutna-slika");
    const btnNazad = document.getElementById("slajder-nazad");
    const btnNaprijed = document.getElementById("slajder-naprijed");

    function prikaziSliku(indeks) {
        if (slikeZaSlajder.length > 0) {
            slikaElement.style.opacity = 0;
            setTimeout(() => {
                slikaElement.src = slikeZaSlajder[indeks];
                slikaElement.style.opacity = 1;
            }, 150);
        }
    }

    btnNazad.addEventListener("click", (e) => { 
        e.stopPropagation(); 
        trenutniIndeks = trenutniIndeks === 0 ? slikeZaSlajder.length - 1 : trenutniIndeks - 1; 
        prikaziSliku(trenutniIndeks); 
    });

    btnNaprijed.addEventListener("click", (e) => { 
        e.stopPropagation(); 
        trenutniIndeks = trenutniIndeks === slikeZaSlajder.length - 1 ? 0 : trenutniIndeks + 1; 
        prikaziSliku(trenutniIndeks); 
    });
    function prikaziSportiste(sportisti) {
        const sportistiGrid = document.getElementById("sportisti-grid");
        if (!sportistiGrid) return;
        sportistiGrid.innerHTML = "";

        if (sportisti.length === 0) {
            sportistiGrid.innerHTML = "<p class='nema-rezultata-poruka'>Nema pronađenih sportista za vašu pretragu.</p>";
            return;
        }
        /*
        sportisti.forEach(sportista => {
            const slikaIgraca = sportista.slika || "./images/placeholder.png";

            const kartica = `
                <div class="ponuda-kartica sportista-detalji-kartica" 
                     onclick="window.location.href='sportista.html?sportId=${sportId}&ime=${encodeURIComponent(sportista.ime)}'">
                    <div class="sportista-slika-okvir-kartice">
                        <img src="${slikaIgraca}" alt="${sportista.ime}" class="sportista-slika-kartice">
                    </div>
                    <div class="sportista-sadrzaj-kartice">
                        <h3>${sportista.ime}</h3>
                        <strong>${sportista.uloga}</strong>
                        <p>${sportista.info || ""}</p>
                    </div>
                </div>
            `;
            sportistiGrid.innerHTML += kartica;
        });
        */
        if (sportisti && sportisti.length > 0) {
            const nizHtmlKartica = sportisti.map(sportista => { 
                const slikaIgraca = sportista.slika || "./images/placeholder.png";
                return `
                    <div class="ponuda-kartica sportista-detalji-kartica" 
                        onclick="window.location.href='sportista.html?sportId=${sportId}&ime=${encodeURIComponent(sportista.ime)}'">
                        <div class="sportista-slika-okvir-kartice">
                            <img src="${slikaIgraca}" alt="${sportista.ime}" class="sportista-slika-kartice">
                        </div>
                        <div class="sportista-sadrzaj-kartice">
                            <h3>${sportista.ime}</h3>
                            <strong>${sportista.uloga}</strong>
                            <p>${sportista.info || ""}</p>
                        </div>
                    </div>
                `;
            });
            sportistiGrid.innerHTML = nizHtmlKartica.join(''); 
        }
    }
    function ucitajPodatke() {
        fetch('./data/podaci.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(sportovi => {
                const lokalniSport = sportovi.find(s => s.id === sportId);
                if (!lokalniSport) return prikazGreske();

                document.getElementById("sport-naziv").innerText = lokalniSport.naziv;
                document.getElementById("sport-savez-info").innerText = lokalniSport.savez;

                if (lokalniSport.galerija && lokalniSport.galerija.length > 0) {
                    slikeZaSlajder = lokalniSport.galerija;
                    prikaziSliku(trenutniIndeks);
                    btnNazad.style.display = "flex"; 
                    btnNaprijed.style.display = "flex";
                } else {
                    slikaElement.src = lokalniSport.slika || "./images/placeholder.png";
                    btnNazad.style.display = "none"; 
                    btnNaprijed.style.display = "none";
                }

                sviSportistiIzSporta = lokalniSport.sportisti || [];
                prikaziSportiste(sviSportistiIzSporta);
            });
    }

    if (searchSportistiInput) {
        searchSportistiInput.addEventListener("input", (event) => {
            const pojam = event.target.value.toLowerCase();
            const filtriraniSportisti = sviSportistiIzSporta.filter(sportista => 
                sportista.ime.toLowerCase().includes(pojam) || 
                (sportista.uloga && sportista.uloga.toLowerCase().includes(pojam))
            );

            prikaziSportiste(filtriraniSportisti);
        });
    }

    function prikazGreske() {
        document.getElementById("sport-naziv").innerText = "Sport nije pronađen";
        document.getElementById("sport-savez-info").innerText = "Traženi sport ne postoji u bazi.";
        const grid = document.getElementById("sportisti-grid");
        if(grid) grid.innerHTML = "";
    }
    
    ucitajPodatke();
});