import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Pocetna from "./pages/Pocetna.jsx";
import SportDetalj from "./pages/SportDetalj.jsx";
import SportistaDetalj from "./pages/SportistaDetalj.jsx";
import Vijesti from "./pages/Vijesti.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/sport/:id" element={<SportDetalj />} />
          <Route path="/sportista/:sportId/:sportistaId" element={<SportistaDetalj />} />
          <Route path="/vijesti" element={<Vijesti />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
