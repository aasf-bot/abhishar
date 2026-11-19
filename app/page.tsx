import Header from './components/Header';
import Hero from './components/Hero';
import ThemeSection from './components/ThemeSection';
import TypesSection from './components/TypesSection';
import FeaturedArticles from './components/FeaturedArticles';
import LifescapeSection from './components/LifescapeSection';
import VideoFlipbookDownload from './components/VideoFlipbookDownload';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import PaintCursor from './components/PaintCursor';

export default function Home() {
  return (
    <>
      <PaintCursor />
      <Header />
      <main>
        <Hero />
        <ThemeSection />
        <TypesSection />
        <FeaturedArticles />
        <LifescapeSection />
        <VideoFlipbookDownload />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
