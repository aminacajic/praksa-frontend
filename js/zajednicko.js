document.addEventListener("DOMContentLoaded", () => {
    const headerElement = document.querySelector("header");
    if (headerElement) {
        headerElement.innerHTML = `
            <div>
                <img class="logo" src="./images/logo.png" alt="Logo BH sporta">
                <h1 class="klik-naslov" onclick="window.location.href='index.html'">BH sport</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="index.html">Početna</a></li>
                    <li><a href="index.html#sportisti">Sportovi</a></li>
                    <li><a href="#kontakt">Kontakt</a></li>
                    <li><a href="admin.html">Admin</a></li>
                </ul>
            </nav>
        `;
    }

    const footerElement = document.querySelector("footer");
    if (footerElement) {
        footerElement.innerHTML = `
            <div class="footer-links">
                <h3>BH Sport, Bosna i Hercegovina</h3>
                <ul>
                    <li>Kontakt email: info@bhsport.ba</li>
                </ul>
            </div>
        `;
    }
});