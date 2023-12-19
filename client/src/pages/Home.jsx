import { Routes, Route, useParams } from 'react-router-dom';
import {
  Support,
  Careers,
  InfoSection,
  Discover,
} from '../components/index';
import './scss/home.scss';
import { handleFooter, handleHero, handleNavbar } from '../utils/handleLayout';

const Home = () => {
  const params = useParams();
  const pathName = Object.values(params)[0];

  let navbar;
  let headerContent;
  let footer;
  navbar = handleNavbar(pathName);
  headerContent = handleHero(pathName);
  footer = handleFooter(pathName);

  const headerLayout =
    pathName === "discover"
      ? { minHeight: "45vh" }
      : pathName === "support"
      ? { minHeight: "35vh" }
      : pathName === "careers"
      ? { background: "#5865F2", height: "100vh"}
      : { minHeight: "65vh" }

  return (
    <main className="home">
      <header className="header" style={headerLayout}>
        {navbar}
        {headerContent}
      </header>
      <section className="main">
        <Routes>
          <Route path="/" element={<InfoSection />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/support" element={<Support />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </section>
      <footer>
        {footer}
      </footer>
    </main>
  );
}

export default Home
