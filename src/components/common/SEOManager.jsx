import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SEOManager() {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'BUNNIES WORLD | Unofficial NewJeans Interactive World & Fan Portal';
    let description = 'The ultimate interactive digital portal for NewJeans & Bunnies. Stream official music previews (Ditto, Super Shy, How Sweet, Attention), explore member profiles, Y2K gallery & live community.';

    if (path === '/') {
      title = 'BUNNIES WORLD | Unofficial NewJeans Interactive World & Fan Portal';
      description = 'The ultimate interactive digital portal for NewJeans & Bunnies. Stream official song previews, explore member profiles (Minji, Hanni, Haerin, Hyein, Danielle) & Y2K fan world.';
    } else if (path === '/members') {
      title = 'NewJeans Members Profile & MBTI (Minji, Hanni, Haerin, Hyein, Danielle) | BUNNIES WORLD';
      description = 'Discover active NewJeans members Minji, Hanni, Haerin, Hyein, and former member archive Danielle. View MBTI, vocal signatures, photocards, and bio details.';
    } else if (path.startsWith('/members/minji')) {
      title = 'Minji (NewJeans) Profile, MBTI & Photo Gallery | BUNNIES WORLD';
      description = 'Explore Minji (Kim Min-ji) profile, ESTJ MBTI, vocal tone, leader bio, photocards, and favorite NewJeans songs on Bunnies World.';
    } else if (path.startsWith('/members/hanni')) {
      title = 'Hanni (NewJeans) Profile, MBTI, Lyrics & Bio | BUNNIES WORLD';
      description = 'Explore Hanni Pham profile, INFP MBTI, songwriting achievements (Hype Boy, OMG), sweet vocals, and photocards on Bunnies World.';
    } else if (path.startsWith('/members/haerin')) {
      title = 'Haerin (NewJeans) Profile, MBTI & Main Dancer Bio | BUNNIES WORLD';
      description = 'Explore Haerin (Kang Hae-rin) profile, ISTP MBTI, cat-like feline visuals, dance performance controls, and photocards on Bunnies World.';
    } else if (path.startsWith('/members/hyein')) {
      title = 'Hyein (NewJeans) Profile, MBTI & R&B Vocals Bio | BUNNIES WORLD';
      description = 'Explore Hyein (Lee Hye-in) profile, INFP MBTI, soulful R&B vocals, model proportions, and photocards on Bunnies World.';
    } else if (path.startsWith('/members/danielle')) {
      title = 'Danielle Profile & Former Member Archive | BUNNIES WORLD';
      description = 'Explore Danielle Marsh profile, ENFP MBTI, sunshine energy, Disney visuals, and official former member fandom archive on Bunnies World.';
    } else if (path === '/discography') {
      title = 'NewJeans Discography & Song Audio Previews (Ditto, Super Shy, How Sweet) | BUNNIES WORLD';
      description = 'Listen to official 30s audio previews for all NewJeans tracks (EPs, singles, collaborations & OSTs). Filter by album, vinyl record animations & lyrics.';
    } else if (path === '/timeline') {
      title = 'NewJeans Career Timeline (2022-2026 Milestones & Achievements) | BUNNIES WORLD';
      description = 'A comprehensive chronological journey of NewJeans from 2019 pre-debut preparations, 2022 Attention debut, Billboard 200 #1 to 2026 active campaign.';
    } else if (path === '/universe') {
      title = 'BUNNIES WORLD | Interactive World & Bunny Affinity Calculator';
      description = 'Calculate your mathematical Bunny Affinity with physics equations, interact with the Y2K digital world & unlock fan achievements.';
    } else if (path === '/gallery') {
      title = 'BUNNIES GALLERY | NewJeans Y2K Photocards & Download Studio';
      description = 'Browse high-res Polaroid photocards, concept photos, and fan artwork of NewJeans. Filter by member & download original quality wallpapers.';
    } else if (path === '/community') {
      title = 'BUNNIES FAN WALL | Live Community Message Board';
      description = 'Join global Bunnies sharing live fan messages for NewJeans. Multi-language profanity filtered, live likes, and real-time sync.';
    } else if (path === '/news') {
      title = 'LATEST NEWS | Official NewJeans Comebacks, Awards & Press Releases';
      description = 'Stay updated with official NewJeans press releases, music production records, chart milestones, awards, and Bunnies World platform updates.';
    } else if (path === '/about') {
      title = 'NewJeans Encyclopedia & Group Naming Philosophy | BUNNIES WORLD';
      description = 'Learn about NewJeans (NJZ) group naming philosophy, active 4-member lineup, former member archive, copyright records, and FAQ.';
    } else if (path === '/search') {
      title = 'Global Universe Search | Search NewJeans Members, Albums & Songs';
      description = 'Real-time discovery engine for NewJeans members, songs, albums, photocards, and gallery items.';
    }

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [location.pathname, i18n.language]);

  return null;
}
