document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sportId = urlParams.get('id');

    if (!sportId) return;

    let slikeZaSlajder = [];
    let trenutniIndeks = 0;

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

    function ucitajPodatke() {
        fetch('./js/podaci.json?t=' + new Date().getTime())
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

                const sportistiGrid = document.getElementById("sportisti-grid");
                sportistiGrid.innerHTML = "";

                if (lokalniSport.sportisti && lokalniSport.sportisti.length > 0) {
                    lokalniSport.sportisti.forEach(sportista => {
                        const slikaIgraca = sportista.slika || "./images/placeholder.png";

                        const kartica = `
                            <div class="ponuda-kartica" style="padding: 20px; border-radius: 6px; display: flex; flex-direction: column; gap: 15px; cursor: pointer;" 
                                 onclick="window.location.href='sportista.html?sportId=${sportId}&ime=${encodeURIComponent(sportista.ime)}'">
                                <div class="kartica-slika-wrapper" style="height: 220px; width: 100%; overflow: hidden; border-radius: 4px; background-color: #f8fafc;">
                                    <img src="${slikaIgraca}" alt="${sportista.ime}" class="kartica-slika" style="width: 100%; height: 100%; object-fit: contain;">
                                </div>
                                <div class="kartica-sadrzaj" style="padding: 0;">
                                    <h3 style="margin: 0 0 5px 0;">${sportista.ime}</h3>
                                    <strong style="color: #a3c6a8; font-size: 14px; display: block; margin-bottom: 10px;">${sportista.uloga}</strong>
                                    <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${sportista.info}</p>
                                </div>
                            </div>
                        `;
                        sportistiGrid.innerHTML += kartica;
                    });
                } else {
                    sportistiGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #666;'>Trenutno nema unesenih sportista za ovaj sport.</p>";
                }
            });
    }

    function prikazGreske() {
        document.getElementById("sport-naziv").innerText = "Sport nije pronađen";
        document.getElementById("sport-savez-info").innerText = "Traženi sport ne postoji u bazi.";
    }

    ucitajPodatke();
});