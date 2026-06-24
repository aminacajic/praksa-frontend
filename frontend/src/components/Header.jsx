import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const VISINA_HEADERA = 80; 

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [naSportovima, setNaSportovima] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      setNaSportovima(false);
      return;
    }

    function provjeriPoziciju() {
      const sekcija = document.getElementById("sportisti");
      if (!sekcija) return;
      setNaSportovima(sekcija.getBoundingClientRect().top <= VISINA_HEADERA);
    }

    provjeriPoziciju();
    window.addEventListener("scroll", provjeriPoziciju);
    return () => window.removeEventListener("scroll", provjeriPoziciju);
  }, [location.pathname]);

  function idiNaPocetnu(e) {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function idiNaSportove(e) {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("sportisti")?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      document.getElementById("sportisti")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <header>
      <div>
        <img className="logo" src="/images/logo.png" alt="Logo BH sporta" />
        <h1 className="klik-naslov" onClick={idiNaPocetnu}>
          BH sport
        </h1>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              end
              onClick={idiNaPocetnu}
              className={() =>
                location.pathname === "/" && !naSportovima ? "aktivna-ruta" : ""
              }
            >
              Početna
            </NavLink>
          </li>
          <li>
            <a href="#sportisti" onClick={idiNaSportove} className={naSportovima ? "aktivna-ruta" : ""}>
              Sportovi
            </a>
          </li>
          <li>
            <NavLink to="/vijesti" className={({ isActive }) => (isActive ? "aktivna-ruta" : "")}>
              Vijesti
            </NavLink>
          </li>
          <li>
            <a href="#kontakt">Kontakt</a>
          </li>
          <li>
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "aktivna-ruta" : "")}>
              Admin
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
