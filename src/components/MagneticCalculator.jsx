import React, { useState, useEffect, useRef } from 'react';

export default function MagneticCalculator({ t }) {
  const [albums, setAlbums] = useState(3);
  const [hours, setHours] = useState(15);
  const [memberCharge, setMemberCharge] = useState(5.0); // Selected bias charge
  const [force, setForce] = useState(0);
  const [status, setStatus] = useState('');

  const formulaRef = useRef(null);
  const fanChargeRef = useRef(null);

  // Dynamically load KaTeX JS if not present, and render formulas
  useEffect(() => {
    const renderFormulas = () => {
      if (window.katex) {
        try {
          window.katex.render(
            `F_{\\text{attraction}} = \\mu_0 \\cdot Q_{\\text{member}} \\cdot Q_{\\text{gllit}}`,
            formulaRef.current,
            { displayMode: true, throwOnError: false }
          );
          
          window.katex.render(
            `Q_{\\text{gllit}} = (\\text{Albums} \\cdot 1.5) + (\\text{Hours} \\cdot 0.8)`,
            fanChargeRef.current,
            { displayMode: true, throwOnError: false }
          );
        } catch (e) {
          console.error("KaTeX render error:", e);
        }
      }
    };

    if (!window.katex) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js";
      script.async = true;
      script.onload = renderFormulas;
      document.body.appendChild(script);
    } else {
      renderFormulas();
    }
  }, [albums, hours, memberCharge]); // Re-render if state changes

  // Calculate Force
  useEffect(() => {
    // Q_gllit = (Albums * 1.5) + (Hours * 0.8)
    const qGllit = (albums * 1.5) + (hours * 0.8);
    
    // F = Q_member * Q_gllit
    const calculatedForce = memberCharge * qGllit;
    setForce(calculatedForce.toFixed(2));

    // Determine status text
    if (calculatedForce < 20) {
      setStatus(t('calc-status-low'));
    } else if (calculatedForce < 80) {
      setStatus(t('calc-status-mid'));
    } else {
      setStatus(t('calc-status-high'));
    }
  }, [albums, hours, memberCharge, t]);

  const membersList = [
    { name: 'Wonhee', charge: 5.0 },
    { name: 'Minju', charge: 4.8 },
    { name: 'Yunah', charge: 4.9 },
    { name: 'Moka', charge: 4.7 },
    { name: 'Iroha', charge: 4.6 }
  ];

  return (
    <div className="calc-container glass">
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-white)', marginBottom: '8px' }}>
        {t('calc-title')}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        {t('calc-desc')}
      </p>

      {/* LaTeX Math block */}
      <div className="latex-block">
        <div ref={formulaRef}>
          {/* Fallback layout if KaTeX is loading */}
          F_attraction = μ0 * Q_member * Q_gllit
        </div>
        <div ref={fanChargeRef} style={{ fontSize: '0.85rem', marginTop: '10px', opacity: 0.8 }}>
          Q_gllit = (Albums * 1.5) + (Hours * 0.8)
        </div>
      </div>

      {/* Sliders Input Controls */}
      <div className="calc-slider-group">
        <label>
          <span>{t('calc-label-albums')}</span>
          <span className="val">{albums}</span>
        </label>
        <input
          type="range"
          className="calc-slider"
          min="0"
          max="20"
          value={albums}
          onChange={(e) => setAlbums(parseInt(e.target.value))}
        />
      </div>

      <div className="calc-slider-group">
        <label>
          <span>{t('calc-label-hours')}</span>
          <span className="val">{hours}h</span>
        </label>
        <input
          type="range"
          className="calc-slider"
          min="0"
          max="100"
          value={hours}
          onChange={(e) => setHours(parseInt(e.target.value))}
        />
      </div>

      <div className="calc-slider-group">
        <label>
          <span>{t('calc-label-charge')}</span>
          <span className="val">{memberCharge.toFixed(1)} Q</span>
        </label>
        <select
          className="glass"
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '10px',
            color: 'var(--text-white)',
            borderRadius: '8px',
            outline: 'none',
            fontSize: '0.85rem'
          }}
          value={memberCharge}
          onChange={(e) => setMemberCharge(parseFloat(e.target.value))}
        >
          {membersList.map(m => (
            <option key={m.name} value={m.charge} style={{ background: '#090611' }}>
              {m.name} ({m.charge.toFixed(1)} Q)
            </option>
          ))}
        </select>
      </div>

      {/* Results Dashboard */}
      <div className={`calc-result-box ${force >= 80 ? 'sparkle' : ''}`}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px' }}>
          {t('calc-result-title')}
        </div>
        <div className="calc-result-force">
          {force} <span style={{ fontSize: '1rem', fontWeight: 500 }}>nN</span>
        </div>
        <div className="calc-result-status">
          {status}
        </div>
      </div>
    </div>
  );
}
