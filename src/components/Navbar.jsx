import React from 'react';

export default function Navbar({ page, setPage, lang, setLang, t }) {
  const handleNavClick = (e, targetPage) => {
    e.preventDefault();
    setPage(targetPage);
  };

  const toggleLanguage = (e, newLang) => {
    e.preventDefault();
    setLang(newLang);
  };

  return (
    <nav id="main-navigation">
      {/* Brand Logo Link */}
      <a 
        href="#" 
        onClick={(e) => handleNavClick(e, 'home')} 
        style={{ 
          marginRight: 'auto', 
          fontFamily: 'var(--font-heading)', 
          fontWeight: 800, 
          fontSize: '1.25rem', 
          letterSpacing: '1px', 
          color: 'var(--text-white)',
          padding: 0,
          background: 'none',
          border: 'none'
        }}
      >
        GLLIT CLUB
      </a>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a 
          href="#" 
          className={page === 'home' ? 'active' : ''} 
          onClick={(e) => handleNavClick(e, 'home')}
        >
          {t('nav-home')}
        </a>
        <a 
          href="https://weverse.io/illit" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {t('nav-weverse')}
        </a>
        <a 
          href="#" 
          className={page === 'about' ? 'active' : ''} 
          onClick={(e) => handleNavClick(e, 'about')}
        >
          {t('nav-about')}
        </a>
      </div>

      {/* Language Switcher Toggle Pill (EN / ID / KO / JA) */}
      <div className="lang-switcher">
        {['en', 'id', 'ko', 'ja'].map(l => (
          <button 
            key={l}
            className={`lang-btn ${lang === l ? 'active' : ''}`}
            onClick={(e) => toggleLanguage(e, l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  );
}
