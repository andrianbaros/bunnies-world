import React, { useState, useRef } from 'react';

const profiles = {
  yunah: {
    name: "YUNAH",
    subName: "윤아",
    img: "assets/yunah.jpg",
    fullName: "Roh Yun-ah (노윤아)",
    birthday: "January 15, 2004",
    mbti: "ENFP",
    prev: "iroha",
    next: "minju"
  },
  minju: {
    name: "MINJU",
    subName: "민주",
    img: "assets/minju.jpg",
    fullName: "Park Min-ju (박민주)",
    birthday: "February 11, 2004",
    mbti: "ISTP",
    prev: "yunah",
    next: "moka"
  },
  moka: {
    name: "MOKA",
    subName: "모카",
    img: "assets/moka.jpg",
    fullName: "Sakai Moka (사카이 모카)",
    birthday: "October 8, 2004",
    mbti: "ISFP",
    prev: "minju",
    next: "wonhee"
  },
  wonhee: {
    name: "WONHEE",
    subName: "원희",
    img: "assets/wonhee.jpg",
    fullName: "Lee Won-hee (이원희)",
    birthday: "June 26, 2007",
    mbti: "ISFP",
    prev: "moka",
    next: "iroha"
  },
  iroha: {
    name: "IROHA",
    subName: "이로하",
    img: "assets/iroha.jpg",
    fullName: "Hokazono Iroha (호카조노 이로하)",
    birthday: "February 4, 2008",
    mbti: "ISFP",
    prev: "wonhee",
    next: "yunah"
  }
};

export default function MemberBio({ id, setPage, t }) {
  const profile = profiles[id];
  const cardRef = useRef(null);
  const [cardStyle, setCardStyle] = useState({});
  const [mx, setMx] = useState('50%');
  const [my, setMy] = useState('50%');

  if (!profile) return <div>Profile not found.</div>;

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = -(y - centerY) / (rect.height / 10);
    const rotateY = (x - centerX) / (rect.width / 10);
    
    setCardStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease'
    });
    
    setMx(`${(x / rect.width) * 100}%`);
    setMy(`${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    setCardStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease'
    });
    setMx('50%');
    setMy('50%');
  };

  return (
    <div className="bio-layout">
      {/* Left: Interactive 3D Member Card */}
      <div className="bio-card-col">
        <div 
          ref={cardRef}
          className="member-card glass"
          style={{
            ...cardStyle,
            '--mx': mx,
            '--my': my
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="shine" style={{ background: `radial-gradient(circle at ${mx} ${my}, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 60%)` }}></div>
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
            <strong data-i18n="label-birthday">{t('label-birthday')}</strong> 
            <span>{profile.birthday}</span>
          </li>
          <li>
            <strong data-i18n="label-mbti">{t('label-mbti')}</strong> 
            <span>{profile.mbti}</span>
          </li>
          <li>
            <strong data-i18n="label-agency">{t('label-agency')}</strong> 
            <span>BE:LIFT Lab (HYBE)</span>
          </li>
          <li>
            <strong data-i18n="label-group">{t('label-group')}</strong> 
            <span>ILLIT (아일릿)</span>
          </li>
        </ul>

        {/* Action controls */}
        <div className="bio-actions">
          <button onClick={() => setPage('home')} className="btn-secondary" dangerouslySetInnerHTML={{ __html: t('btn-back-home') }}></button>
          <button onClick={() => setPage(`bio_${profile.prev}`)} className="btn-secondary" dangerouslySetInnerHTML={{ __html: t(`btn-prev-${profile.prev}`) }}></button>
          <button onClick={() => setPage(`bio_${profile.next}`)} className="btn-details" dangerouslySetInnerHTML={{ __html: t(`btn-next-${profile.next}`) }}></button>
        </div>
      </div>
    </div>
  );
}
