import { useEffect } from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';


const LandingPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Hero />
      <Footer />
    </>
  );
};

export default LandingPage;
