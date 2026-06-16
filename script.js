const mojGumb = document.getElementById("gumb-akcija");
const mojTekst = document.getElementById("tekst-izmjena");

const porukaDobrodoslice = "Čestitramo, ostvarili ste 15% popusta na sve rezervacije ovaj vikend uz kod KR15!";

function promijeniTekst() {
    mojTekst.textContent = porukaDobrodoslice;
    mojGumb.textContent = "Uspješno učitano!";
    mojGumb.style.backgroundColor = "#e0e6e4";
    mojGumb.disabled = true; 
}

mojGumb.addEventListener("click", promijeniTekst);