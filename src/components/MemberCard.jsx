import React, { useState, useRef } from 'react';

export default function MemberCard({ id, name, img, roleKey, setPage, t }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [mx, setMx] = useState('50%');
  const [my, setMy] = useState('50%');

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = -(y - centerY) / (rect.height / 10); // Max 10 deg rotation
    const rotateY = (x - centerX) / (rect.width / 10);
    
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease'
    });
    
    setMx(`${(x / rect.width) * 100}%`);
    setMy(`${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease'
    });
    setMx('50%');
    setMy('50%');
  };

  return (
    <div 
      ref={cardRef}
      className="member-card glass" 
      style={{
        ...style,
        '--mx': mx,
        '--my': my
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setPage(`bio_${id}`)}
    >
      <div className="shine" style={{ background: `radial-gradient(circle at ${mx} ${my}, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 60%)` }}></div>
      <div className="card-inner">
        <img src={img} alt={`ILLIT ${name} Profile Picture`} />
        <h2>{name}</h2>
        <p>{t(roleKey)}</p>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent double trigger with outer card onClick
            setPage(`bio_${id}`);
          }} 
          className="btn-details"
        >
          {t('btn-details')}
        </button>
      </div>
    </div>
  );
}
