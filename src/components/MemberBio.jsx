import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { memberData } from '../data/memberData';

export default function MemberBio({ id, setPage }) {
  const { t } = useTranslation();
  const profile = memberData[id];
  const cardRef = useRef(null);

  const [cardStyle, setCardStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
  });

  const [mx, setMx] = useState('50%');
  const [my, setMy] = useState('50%');

  if (!profile) {
    return (
      <div className="bio-layout text-center">
        <h2>Member profile not found!</h2>
        <button onClick={() => setPage('members')} className="btn-details">
          Back to Members
        </button>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setMx(`${(x / rect.width) * 100}%`);
    setMy(`${(y / rect.height) * 100}%`);

    setCardStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setCardStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    });
  };

  return (
    <div className="bio-layout">
      {/* Left: Interactive 3D Member Card */}
      <div className="bio-card-col">
        <div 
          ref={cardRef}
          className="member-card glass"
          style={cardStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="card-inner">
            <img src={profile.img} alt={`ILLIT ${profile.name} Photo`} />
            <h2>{profile.name}</h2>
            <p className="role-tag" style={{ color: 'var(--secondary)' }}>{t(`role-tag-${id}`)}</p>
          </div>
        </div>
      </div>

      {/* Right: Detailed Information Panel */}
      <div className="bio-info-col glass">
        <h2>{profile.name} / {profile.subName}</h2>
        <p dangerouslySetInnerHTML={{ __html: t(`desc-${id}`) }}></p>
        
        <h3 data-i18n="biodata-title">{t('biodata-title')}</h3>
        <ul>
          <li>
            <strong data-i18n="label-name">{t('label-name')}</strong> 
            <span>{profile.fullName}</span>
          </li>
          <li>
            <strong data-i18n="label-dob">{t('label-dob')}</strong> 
            <span>{profile.dob}</span>
          </li>
          <li>
            <strong data-i18n="label-zodiac">{t('label-zodiac')}</strong> 
            <span>{t(`zodiac-${id}`)}</span>
          </li>
          <li>
            <strong data-i18n="label-mbti">{t('label-mbti')}</strong> 
            <span>{profile.mbti}</span>
          </li>
          <li>
            <strong data-i18n="label-[# nationality]">{t('label-[# nationality]', { defaultValue: 'Kebangsaan:' })}</strong> 
            <span>{t(`nat-${id}`)}</span>
          </li>
        </ul>

        <div className="bio-actions">
          <button 
            onClick={() => setPage('members')} 
            className="btn-secondary"
            data-i18n="btn-back"
          >
            {t('btn-back')}
          </button>
        </div>
      </div>
    </div>
  );
}
