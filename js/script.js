document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("ponuda-grid");
    if (!grid) return; 

    fetch('./js/podaci.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Problem sa učitavanjem JSON fajla");
            }
            return response.json();
        })
        .then(sportovi => {
            grid.innerHTML = ""; 
            sportovi.forEach(sport => {
                const kartica = `
                    <div class="ponuda-kartica" style="cursor: pointer;" onclick="window.location.href='sport.html?id=${sport.id}'">
                        <div class="kartica-slika-wrapper">
                            <img src="${sport.slika}" alt="${sport.naziv}" class="kartica-slika">
                        </div>
                        <div class="kartica-sadrzaj">
                            <h3>${sport.naziv}</h3>
                            <p>${sport.opis}</p>
                        </div>
                    </div>
                `;
                grid.innerHTML += kartica;
            });
        })
        .catch(error => console.error("Greška pri učitavanju glavnog grida:", error));
});