import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingAudioPlayer from './components/layout/FloatingAudioPlayer';
import BunniesCanvas from './components/animations/BunniesCanvas';
import CustomCursor from './components/common/CustomCursor';
import LoadingScreen from './components/common/LoadingScreen';
import PageTransition from './components/common/PageTransition';
import SEOManager from './components/common/SEOManager';
import { SkeletonCard } from './components/common/Skeleton';
import { useSettings } from './contexts/SettingsContext';

// Helper for dynamic imports with auto-retry on Vercel redeployment chunk hashing
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasBeenRefreshed = JSON.parse(
      sessionStorage.getItem('page_has_been_refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      sessionStorage.setItem('page_has_been_refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasBeenRefreshed) {
        sessionStorage.setItem('page_has_been_refreshed', 'true');
        window.location.reload();
        return { default: () => null };
      }
      throw error;
    }
  });

// Lazy loading route pages for code splitting & optimal LCP
const Home = lazyWithRetry(() => import('./pages/Home'));
const Members = lazyWithRetry(() => import('./pages/Members'));
const MemberDetail = lazyWithRetry(() => import('./pages/MemberDetail'));
const Discography = lazyWithRetry(() => import('./pages/Discography'));
const Timeline = lazyWithRetry(() => import('./pages/Timeline'));
const Universe = lazyWithRetry(() => import('./pages/Universe'));
const Gallery = lazyWithRetry(() => import('./pages/Gallery'));
const Community = lazyWithRetry(() => import('./pages/Community'));
const News = lazyWithRetry(() => import('./pages/News'));
const SearchPage = lazyWithRetry(() => import('./pages/SearchPage'));
const Favorites = lazyWithRetry(() => import('./pages/Favorites'));
const Settings = lazyWithRetry(() => import('./pages/Settings'));
const About = lazyWithRetry(() => import('./pages/About'));
const Admin = lazyWithRetry(() => import('./pages/Admin'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { unlockAchievement } = useSettings();

  // Unlock visitHome achievement when home is loaded
  useEffect(() => {
    if (location.pathname === '/') {
      unlockAchievement('visitHome', 'Universe Explorer');
    }
  }, [location.pathname]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Dynamic SEO & Meta Manager per route */}
      <SEOManager />

      {/* Y2K Loading Screen */}
      {isLoading ? (
        <LoadingScreen onFinish={() => setIsLoading(false)} />
      ) : (
        <div className="app-container min-h-screen flex flex-col justify-between relative overflow-hidden">
          {/* Custom Interactive Canvas Background */}
          <BunniesCanvas />

          {/* Custom Desktop Glowing Cursor */}
          <CustomCursor />

          {/* Header Navigation */}
          <Navbar />

          {/* Main Pages Content with Suspense Code Splitting & Page Transitions */}
          <main className="flex-grow z-10 flex flex-col">
            <PageTransition key={location.pathname}>
              <Suspense fallback={<div className="max-w-4xl mx-auto p-8 w-full"><SkeletonCard /></div>}>
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/members/:id" element={<MemberDetail />} />
                  <Route path="/discography" element={<Discography />} />
                  <Route path="/timeline" element={<Timeline />} />
                  <Route path="/universe" element={<Universe />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageTransition>
          </main>

          {/* Footer */}
          <Footer />

          {/* Global iPod / CD Player */}
          <FloatingAudioPlayer />
        </div>
      )}
    </>
  );
}
