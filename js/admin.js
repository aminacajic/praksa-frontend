document.addEventListener("DOMContentLoaded", () => {
    const btnSport = document.getElementById("btn-prikazi-sport");
    const btnSportista = document.getElementById("btn-prikazi-sportistu");
    const btnUpravljanje = document.getElementById("btn-prikazi-upravljanje");
    const sekcijaSport = document.getElementById("sekcija-sport");
    const sekcijaSportista = document.getElementById("sekcija-sportista");
    const sekcijaUpravljanje = document.getElementById("sekcija-upravljanje");
    const formaSport = document.getElementById("forma-sport");
    const formaSportista = document.getElementById("forma-sportista");
    const btnSpasiSport = document.getElementById("btn-spasi-sport") || document.querySelector("#forma-sport .btn-spasi");
    const btnSpasiSportista = document.getElementById("btn-spasi-sportistu") || document.querySelector("#forma-sportista .btn-spasi");
    const adminSearchInput = document.getElementById("admin-search-input");

    let kompletnaBaza = [];

    function aktivirajTab(aktivnoDugme, aktivnaSekcija) {
        [btnSport, btnSportista, btnUpravljanje].forEach(b => b?.classList.remove("aktivno"));
        [sekcijaSport, sekcijaSportista, sekcijaUpravljanje].forEach(s => { if(s) s.style.display = "none"; });

        aktivnoDugme.classList.add("aktivno");
        aktivnaSekcija.style.display = "block";
    }

    btnSport.addEventListener("click", () => {
        resetujFormuSporta();
        aktivirajTab(btnSport, sekcijaSport);
    });
    btnSportista.addEventListener("click", () => {
        resetujFormuSportiste();
        aktivirajTab(btnSportista, sekcijaSportista);
    });
    btnUpravljanje.addEventListener("click", () => {
        if (adminSearchInput) adminSearchInput.value = "";
        ucitajIisrtajUpravljanje();
        aktivirajTab(btnUpravljanje, sekcijaUpravljanje);
    });

    function iscrtajUpravljanjePanel(podaci) {
        const kontejner = document.getElementById("lista-za-upravljanje");
        if (!kontejner) return;
        kontejner.innerHTML = "";

        if (podaci.length === 0) {
            kontejner.innerHTML = `<p class="nema-rezultata-poruka">Nema rezultata za vašu pretragu u administraciji.</p>`;
            return;
        }

        podaci.forEach(sport => {
            let sportistaHtml = "";
            if(sport.sportisti && sport.sportisti.length > 0) {
                const pojam = adminSearchInput ? adminSearchInput.value.toLowerCase() : "";
                
                sport.sportisti.forEach(sp => {
                    const poklapaSeSportista = sp.ime.toLowerCase().includes(pojam) || 
                                              (sp.uloga && sp.uloga.toLowerCase().includes(pojam));
                    const poklapaSeMaticniSport = sport.naziv.toLowerCase().includes(pojam);

                    if (poklapaSeSportista || poklapaSeMaticniSport || !pojam) {
                        sportistaHtml += `
                            <div class="upravljanje-red">
                                <div class="upravljanje-info">
                                    <img class="upravljanje-mini-slika" src="${sp.slika || './images/placeholder.png'}">
                                    <div>
                                        <strong>${sp.ime}</strong> <small>(${sp.uloga})</small>
                                    </div>
                                </div>
                                <div class="upravljanje-akcije">
                                    <button class="btn-uredi" onclick="pokreniUredjivanjeSportiste('${sport.id}', '${encodeURIComponent(sp.ime)}')">Uredi</button>
                                    <button class="btn-obrisi" onclick="obrisiSportistu('${sport.id}', '${encodeURIComponent(sp.ime)}')">Obriši</button>
                                </div>
                            </div>
                        `;
                    }
                });
            }

            const sportBlok = `
                <div class="upravljanje-sport-blok">
                    <div class="upravljanje-red upravljanje-zaglavlje-bloka">
                        <div class="upravljanje-info">
                            <img class="upravljanje-mini-slika slika-obla" src="${sport.slika || './images/placeholder.png'}">
                            <h3>${sport.naziv} (ID: ${sport.id})</h3>
                        </div>
                        <div class="upravljanje-akcije">
                            <button class="btn-uredi" onclick="pokreniUredjivanjeSporta('${sport.id}')">Uredi sport</button>
                            <button class="btn-obrisi" onclick="obrisiSport('${sport.id}')">Obriši sport</button>
                        </div>
                    </div>
                    <div class="upravljanje-sportisti-lista">
                        ${sportistaHtml || '<p style="color: #888; font-size:13px;">Nema unesenih ili pronađenih sportista.</p>'}
                    </div>
                </div>
            `;
            kontejner.innerHTML += sportBlok;
        });
    }

    function ucitajIisrtajUpravljanje() {
        fetch('./data/podaci.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(podaci => {
                kompletnaBaza = podaci;
                osvjeziSelektoreSportova();
                iscrtajUpravljanjePanel(kompletnaBaza);
            });
    }

    if (adminSearchInput) {
        adminSearchInput.addEventListener("input", (event) => {
            const pojam = event.target.value.toLowerCase();

            const filtriraniPodaci = kompletnaBaza.filter(sport => {
                const poklapaSeSport = sport.naziv.toLowerCase().includes(pojam);

                const poklapaSeSportista = sport.sportisti && sport.sportisti.some(sp => 
                    sp.ime.toLowerCase().includes(pojam) || 
                    (sp.uloga && sp.uloga.toLowerCase().includes(pojam))
                );

                return poklapaSeSport || poklapaSeSportista;
            });

            iscrtajUpravljanjePanel(filtriraniPodaci);
        });
    }

    function osvjeziSelektoreSportova() {
        const selectSport = document.getElementById("odabir-sporta");
        if(!selectSport) return;
        selectSport.innerHTML = '<option value="" disabled selected>Izaberi matični sport...</option>';
        kompletnaBaza.forEach(s => {
            selectSport.innerHTML += `<option value="${s.id}">${s.naziv}</option>`;
        });
    }

    window.pokreniUredjivanjeSporta = function(sportId) {
        const sport = kompletnaBaza.find(s => s.id === sportId);
        if(!sport) return;
        document.getElementById("sport-id").value = sport.id;
        document.getElementById("sport-id").disabled = true; 
        document.getElementById("sport-naziv-unos").value = sport.naziv;
        document.getElementById("sport-opis").value = sport.opis || "";
        document.getElementById("sport-savez").value = sport.savez || "";
        document.getElementById("sport-edit-id").value = sport.id;
        document.getElementById("sport-slika").required = false;
        
        btnSpasiSport.innerText = "Sačuvaj izmjene";
        btnSpasiSport.classList.add("mod-izmjena-sport");

        aktivirajTab(btnSport, sekcijaSport);
    };

    window.pokreniUredjivanjeSportiste = function(sportId, kodiranoIme) {
        const ime = decodeURIComponent(kodiranoIme);
        const sport = kompletnaBaza.find(s => s.id === sportId);
        if(!sport) return;
        const sp = sport.sportisti.find(x => x.ime === ime);
        if(!sp) return;

        const selectSport = document.getElementById("odabir-sporta");
        selectSport.value = sportId;
        osvjeziPozicijeZaSport(sportId, sp.uloga);
        document.getElementById("sportista-ime").value = sp.ime;
        document.getElementById("sportista-info").value = sp.info;
        document.getElementById("sportista-edit-originalno-ime").value = sp.ime;
        document.getElementById("sportista-slika").required = false;
        
        btnSpasiSportista.innerText = "Sačuvaj izmjene";
        btnSpasiSportista.classList.add("mod-izmjena-sportista");

        aktivirajTab(btnSportista, sekcijaSportista);
    };

    const selectSporta = document.getElementById("odabir-sporta");
    if(selectSporta) {
        selectSporta.addEventListener("change", (e) => {
            osvjeziPozicijeZaSport(e.target.value);
        });
    }
    function osvjeziPozicijeZaSport(sportId, selektovanaUloga = "") {
        const ulogaSelect = document.getElementById("sportista-uloga-select");
        if(!ulogaSelect) return;
        ulogaSelect.innerHTML = '<option value="" disabled selected>Izaberi poziciju...</option>';
        
        const sport = kompletnaBaza.find(s => s.id === sportId);
        if(sport && sport.pozicije) {
            const pozicijeNiz = Array.isArray(sport.pozicije) ? sport.pozicije : sport.pozicije.split(",").map(p => p.trim());
            pozicijeNiz.forEach(p => {
                const isSelected = p === selektovanaUloga ? "selected" : "";
                ulogaSelect.innerHTML += `<option value="${p}" ${isSelected}>${p}</option>`;
            });
        }
    }

    function resetujFormuSporta() {
        formaSport.reset();
        document.getElementById("sport-id").disabled = false;
        document.getElementById("sport-edit-id").value = "";
        document.getElementById("sport-slika").required = true;
        btnSpasiSport.innerText = "Sačuvaj Sport";
        btnSpasiSport.classList.remove("mod-izmjena-sport");
    }

    function resetujFormuSportiste() {
        formaSportista.reset();
        document.getElementById("sportista-edit-originalno-ime").value = "";
        document.getElementById("sportista-slika").required = true;
        btnSpasiSportista.innerText = "Sačuvaj Sportistu";
        btnSpasiSportista.classList.remove("mod-izmjena-sportista");
    }

   formaSport.addEventListener("submit", (e) => {
        e.preventDefault();
        const editId = document.getElementById("sport-edit-id").value;
        
        const formData = new FormData();
        
        formData.append("id", document.getElementById("sport-id").value);
        formData.append("naziv", document.getElementById("sport-naziv-unos").value);
        formData.append("opis", document.getElementById("sport-opis").value);
        formData.append("savez", document.getElementById("sport-savez").value);
        
        const pozicijeTekst = document.getElementById("sport-pozicije-inicijalne").value;
        const pozicijeNiz = pozicijeTekst.split(",").map(p => p.trim()).filter(Boolean);
        formData.append("pozicije", JSON.stringify(pozicijeNiz));

        const slikaInput = document.getElementById("sport-slika");
        if (slikaInput && slikaInput.files[0]) {
            formData.append("slikaSporta", slikaInput.files[0]);
        }

        const galerijaInput = document.getElementById("sport-galerija");
        if (galerijaInput && galerijaInput.files.length > 0) {
            for (let i = 0; i < galerijaInput.files.length; i++) {
                formData.append("galerijaSlike", galerijaInput.files[i]);
            }
        }

        let url = '/api/spasi-sport';
        if (editId) {
            url = `/api/spasi-sport`; 
        }

        fetch(url, { method: 'POST', body: formData })
        .then(res => {
            if (!res.ok) throw new Error("Server je vratio grešku " + res.status);
            return res.json();
        })
        .then(odg => {
            alert(odg.poruka);
            resetujFormuSporta();
            btnUpravljanje.click(); 
        })
        .catch(err => {
            console.error(err);
            alert("Greška pri spašavanju sporta: " + err.message);
        });
    });

  formaSportista.addEventListener("submit", (e) => {
        e.preventDefault();
        const originalnoIme = document.getElementById("sportista-edit-originalno-ime").value;
        const sportId = document.getElementById("odabir-sporta").value;

        const formData = new FormData(formaSportista);
        
        formData.append("sportId", sportId);
        formData.append("ime", document.getElementById("sportista-ime").value);
        formData.append("uloga", document.getElementById("sportista-uloga-select").value);
        formData.append("info", document.getElementById("sportista-info").value);
        formData.append("jeNovaPozicija", "false");

        const slikaInput = document.getElementById("sportista-slika");
        if (slikaInput && slikaInput.files[0]) {
            formData.append("slikaIgraca", slikaInput.files[0]);
        }

        let url = '/api/spasi-sportistu'; 
        
        if (originalnoIme) {
            
            url = '/api/spasi-sportistu'; 
        }

        fetch(url, { method: 'POST', body: formData })
        .then(res => {
            if (!res.ok) throw new Error("Server je vratio grešku " + res.status);
            return res.json();
        })
        .then(odg => {
            alert(odg.poruka);
            resetujFormuSportiste();
            btnUpravljanje.click(); 
        })
        .catch(err => {
            console.error(err);
            alert("Greška: " + err.message);
        });
    });

    window.obrisiSport = function(sportId) {
        if(confirm("Da li sigurno želite obrisati cijeli ovaj sport i sve njegove sportiste?")) {
            fetch(`/api/obrisi-sport/${sportId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(odg => { alert(odg.poruka); ucitajIisrtajUpravljanje(); });
        }
    };

    window.obrisiSportistu = function(sportId, kodiranoIme) {
        const ime = decodeURIComponent(kodiranoIme);
        if(confirm(`Da li sigurno želite obrisati sportistu: ${ime}?`)) {
            fetch(`/api/obrisi-sportistu/${sportId}/${kodiranoIme}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(odg => { alert(odg.poruka); ucitajIisrtajUpravljanje(); });
        }
    };

    fetch('./data/podaci.json?t=' + new Date().getTime())
        .then(res => res.json())
        .then(podaci => { 
            kompletnaBaza = podaci; 
            osvjeziSelektoreSportova(); 
        });
});