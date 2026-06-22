document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sportId = urlParams.get('sportId');
    const imeSportiste = urlParams.get('ime');

    if (!sportId || !imeSportiste) return;

    fetch('./js/podaci.json')
        .then(res => res.json())
        .then(sportovi => {
            const sport = sportovi.find(s => s.id === sportId);
            if (!sport) return;

            const sportista = sport.sportisti.find(sp => sp.ime === imeSportiste);
            if (sportista) {
                document.getElementById("sportista-ime-prikaz").innerText = sportista.ime;
                document.getElementById("sportista-uloga-prikaz").innerText = sportista.uloga;
                document.getElementById("sportista-biografija").innerText = sportista.info;
                document.getElementById("sportista-velika-slika").src = sportista.slika ? sportista.slika : "./images/placeholder.png";
                document.title = `${sportista.ime} - BH Sport`;
            }
        });
});