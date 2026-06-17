const mojGumb = document.getElementById("gumb-akcija");
const mojTekst = document.getElementById("tekst-izmjena");

function pokreniRezervaciju() {
    mojGumb.textContent = "Učitavanje...";
    mojGumb.disabled = true;
    mojGumb.style.backgroundColor = "#1e4431"; 
    setTimeout(function() {
        window.location.href = "rezervacije.html";
    }, 1000);
}

mojGumb.addEventListener("click", pokreniRezervaciju);