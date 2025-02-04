import { useEffect } from "react"
import "./portfolio.scss"
import PortNavbar from "./PortNavbar/PortNavbar";
import Hero from "./hero/Hero";
import Parallax from "./Parallax/Parallax";
import Solutions from "./Solutions/Solutions";
// import Services from "./Services/Services";
import Cursor from "./Cursor/Cursor";

const Portfolio = () => {

  useEffect(() => {
    const appElement = document.querySelector('.app');
    appElement.classList.add('portfolio-active');
    const originalHtmlBackgroundColor = document.documentElement.style.backgroundColor;
    const originalBodyBackgroundColor = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#0c0c1d";
    document.body.style.backgroundColor = "#0c0c1d";

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    return () => {
      document.documentElement.style.backgroundColor = originalHtmlBackgroundColor;
      document.body.style.backgroundColor = originalBodyBackgroundColor;
      appElement.classList.remove('portfolio-active');
    };
  }, []);


  useEffect(() => {
    const handleScroll = (event) => {
      if (window.scrollY < 10) {
        window.scrollTo(0, 10);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="portfolio">
      <Cursor />

      <section id="Portfolio">
        <PortNavbar />
        <Hero />
      </section>
      <section id="Target">
        <Parallax />
      </section>
      {/* <section id="Services">
        <Services />
      </section> */}
      <section id="Solutions">
        <Solutions />
      </section>

    </div>
  )
}

export default Portfolio