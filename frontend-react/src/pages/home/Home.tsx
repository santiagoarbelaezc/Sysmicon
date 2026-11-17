import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroVideo } from '../../shared/hero-video/HeroVideo';
import { About } from '../../shared/about/About';
import { Projects } from '../../components/projects/Projects';
import { DirectorShowcase } from '../../components/director-showcase/DirectorShowcase';
import { BannerVideo } from '../../components/banner-video/BannerVideo';
import { ContactSteps } from '../../components/contact-steps/ContactSteps';
import { MissionSection } from '../../components/mission-section/MissionSection';
import './Home.css';

export const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/proyectos')) {
      const timer = setTimeout(() => {
        const el = document.getElementById('proyectos');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div className="home-page">
      {/* 1. Hero Section (Hero Video Component Activo) */}
      <HeroVideo />

      {/* 2. Portafolio / Proyectos Destacados Section (Modularizado en ProjectsComponent) */}
      <Projects />

      {/* 3. Detrás del Diseño y Construcción - Juan Moreno (Ingeniero Director General y Ejecución) */}
      <DirectorShowcase />

      {/* 4. Banner Video Reutilizable — Casa M (sysmi-1.mp4) */}
      <BannerVideo />

      {/* 5. Nuestra Misión & Valores Matrix (Justo debajo de Casa M) */}
      <MissionSection />

      {/* 7. About Section */}
      <About />

      {/* 9. Contact Steps Section (Modularizado en ContactStepsComponent) */}
      <ContactSteps />
    </div>
  );
};

export default Home;
