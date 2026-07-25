import React, { useState } from 'react';
import MagneticCalculator from './MagneticCalculator';

export default function AboutPanel({ t }) {
  const [activeTab, setActiveTab] = useState('web');

  return (
    <div className="about-section">
      <div className="about-card glass">
        {/* Tab Controls */}
        <div className="about-tabs">
          <button 
            className={`about-tab-btn ${activeTab === 'web' ? 'active' : ''}`}
            onClick={() => setActiveTab('web')}
            data-i18n="about-web-tab"
          >
            {t('about-web-tab')}
          </button>
          <button 
            className={`about-tab-btn ${activeTab === 'dev' ? 'active' : ''}`}
            onClick={() => setActiveTab('dev')}
            data-i18n="about-dev-tab"
          >
            {t('about-dev-tab')}
          </button>
        </div>

        {/* Sliding Panel Body */}
        <div className="about-panels-slider" style={{ transform: activeTab === 'web' ? 'translateX(0%)' : 'translateX(-50%)' }}>
          {/* Panel 1: About Web */}
          <div className="about-panel" id="web-panel">
            <h2 data-i18n="about-web-title">{t('about-web-title')}</h2>
            <p data-i18n="about-web-desc">{t('about-web-desc')}</p>
            
            <h3 data-i18n="about-tech-stack" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-white)', marginTop: '15px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              {t('about-tech-stack')}
            </h3>
            <div className="tech-grid">
              <div className="tech-badge">
                <i className="fab fa-html5" style={{ color: '#e34c26' }}></i>
                <span>HTML5</span>
              </div>
              <div className="tech-badge">
                <i className="fab fa-css3-alt" style={{ color: '#264de4' }}></i>
                <span>CSS3 Grid</span>
              </div>
              <div className="tech-badge">
                <i className="fab fa-react" style={{ color: '#61dbfb' }}></i>
                <span>React SPA</span>
              </div>
              <div className="tech-badge">
                <i className="fas fa-bolt" style={{ color: '#646cff' }}></i>
                <span>Vite Bundler</span>
              </div>
            </div>
          </div>

          {/* Panel 2: About Dev */}
          <div className="about-panel" id="dev-panel">
            <div className="dev-header">
              <img src="assets/wonhee.jpg" className="dev-avatar" alt="Developer Avatar" />
              <div className="dev-meta">
                <h3 data-i18n="about-dev-title">{t('about-dev-title')}</h3>
                <p data-i18n="about-dev-role">{t('about-dev-role')}</p>
              </div>
            </div>
            <p data-i18n="about-dev-desc">{t('about-dev-desc')}</p>
            
            <h3 data-i18n="about-dev-skills-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-white)', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              {t('about-dev-skills-title')}
            </h3>
            <div className="dev-skills">
              <span className="skill-badge primary-skill">UI/UX Design</span>
              <span className="skill-badge primary-skill">React Context</span>
              <span className="skill-badge">KaTeX Math</span>
              <span className="skill-badge">Canvas Physics</span>
              <span className="skill-badge">i18n Toggle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Attraction Calculator Widget */}
      <MagneticCalculator t={t} />
    </div>
  );
}
