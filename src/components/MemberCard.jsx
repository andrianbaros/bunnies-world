import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MemberCard({ id, name, roleKey, img, setPage }) {
  const { t } = useTranslation();
  const cardRef = useRef(null);

  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    });
  };

  return (
    <div 
      ref={cardRef}
      className="member-card glass"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setPage(`bio_${id}`)}
    >
      <div className="card-inner">
        <img src={img} alt={`ILLIT ${name} Profile Picture`} />
        <h2>{name}</h2>
        <p>{t(roleKey)}</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
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
