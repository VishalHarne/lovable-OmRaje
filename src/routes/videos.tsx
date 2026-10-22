import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight, Instagram, Play, Film, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { reels, reelCategories, reelUrl, type Reel, type ReelCategory } from '@/lib/reels';
import partySymbol from '@/assets/om-raje/party-symbol.webp';

export const Route = createFileRoute('/videos')({
  head: () => ({ meta: [
    { title: 'Om Raje Nimbalkar | Moments in Motion' },
    { name: 'description', content: 'Selected Instagram reels from mpomrajenimbalkar: field visits, public work and community traditions in Dharashiv.' },
    { property: 'og:title', content: 'Om Raje Nimbalkar | Moments in Motion' },
    { property: 'og:description', content: 'A curated video collection of field visits, public work and community traditions from mpomrajenimbalkar.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: VideosPage,
});

function VideosPage() {
  const [language, setLanguage] = useState<'en' | 'mr'>('mr');
  const [category, setCategory] = useState<ReelCategory>('all');
  const [selected, setSelected] = useState<Reel | null>(null);
  const mr = language === 'mr';
  const featured = reels[0];
  const visible = reels.filter(reel => category === 'all' || reel.category === category);
  return (
    <main className={`site video-page ${mr ? 'site-marathi' : ''}`} lang={language}>
      <header className="site-header video-header">
        <Link to="/" className="brand" aria-label="Om Raje Nimbalkar, home">
          <img src={partySymbol} alt="" />
          <span className="brand-label"><strong>OM RAJE</strong><small>NIMBALKAR · धाराशिव</small></span>
        </Link>
        <div className="header-tools">
          <Button asChild variant="ghost" className="video-home"><Link to="/"><ArrowLeft />{mr ? 'मुख्य पृष्ठ' : 'Home'}</Link></Button>
          <Button variant="ghost" className="language-switch" aria-label={mr ? 'Switch to English' : 'Switch to Marathi'} onClick={() => setLanguage(mr ? 'en' : 'mr')}><span className={!mr ? 'language-current' : ''}>EN</span><span>/</span><span className={mr ? 'language-current' : ''}>मराठी</span></Button>
        </div>
      </header>
      <section className="video-hero">
        <img src={featured.cover} alt={featured[language]} className="video-hero-image" />
        <div className="video-hero-copy">
          <p className="eyebrow"><Film size={15} />{mr ? 'जनतेतील क्षण' : 'THE MOTION COLLECTION'}</p>
          <h1>{mr ? 'ओम राजे निंबाळकर' : 'Om Raje Nimbalkar'}<span>{mr ? 'जनतेत. प्रत्येक क्षणी.' : 'Moments in motion.'}</span></h1>
          <p>{mr ? 'शेतातला संवाद. लोककार्याची झलक. आपल्या परंपरांचा उत्सव.' : 'Conversations in the field. Public work up close. Traditions that bring us together.'}</p>
          <Button variant="saffron" size="large" onClick={() => setSelected(featured)}><Play />{mr ? 'प्रमुख व्हिडिओ पाहा' : 'Watch featured reel'}</Button>
        </div>
        <div className="video-hero-bottom"><span><Instagram size={15} />@mpomrajenimbalkar</span><a href="#collection">{mr ? 'संग्रह पाहा' : 'Explore the collection'}<ArrowDown size={16} /></a></div>
      </section>
      <section className="video-collection" id="collection">
        <div className="video-collection-heading"><div><p className="eyebrow">{mr ? 'निवडक इन्स्टाग्राम रील्स' : 'SELECTED INSTAGRAM REELS'}</p><h2>{mr ? 'जनतेशी जोडलेले क्षण.' : 'People. Places. Purpose.'}</h2></div><span className="video-count">{String(visible.length).padStart(2, '0')} / {mr ? 'व्हिडिओ' : 'REELS'}</span></div>
        <div className="video-filters" role="group" aria-label={mr ? 'व्हिडिओ विषय' : 'Video categories'}>
          {(Object.keys(reelCategories) as ReelCategory[]).map(key => <Button key={key} variant="ghost" className={category === key ? 'video-filter is-active' : 'video-filter'} aria-pressed={category === key} onClick={() => setCategory(key)}>{reelCategories[key][language]}</Button>)}
        </div>
        <div className="video-grid">
          {visible.map(reel => <article className="reel-card" key={reel.id}>
            <Button variant="ghost" className="reel-cover" aria-label={`${mr ? 'पाहा' : 'Watch'}: ${reel[language]}`} onClick={() => setSelected(reel)}>
              <img src={reel.cover} alt={reel[language]} loading="lazy" />
              <span className="reel-category">{reelCategories[reel.category][language]}</span>
              <span className="reel-play"><Play size={24} fill="currentColor" /></span>
              <span className="reel-cover-footer"><Instagram size={17} /><span>{mr ? 'रील पाहा' : 'Watch reel'}</span><ArrowUpRight size={19} /></span>
            </Button>
            <h3>{reel[language]}</h3><p>{reel.description[language]}</p>
            <a className="reel-original" href={reelUrl(reel.id)} target="_blank" rel="noopener noreferrer">{mr ? 'मूळ पोस्ट' : 'Original post'}<ArrowUpRight size={14} /></a>
          </article>)}
        </div>
      </section>
      <footer className="video-footer"><div><Instagram size={25} /><span><strong>@mpomrajenimbalkar</strong><small>{mr ? 'इन्स्टाग्रामवरील आणखी क्षण' : 'More moments on Instagram'}</small></span></div><Button asChild variant="saffron"><a href="https://www.instagram.com/mpomrajenimbalkar/reels/" target="_blank" rel="noopener noreferrer">{mr ? 'इन्स्टाग्रामवर भेट द्या' : 'Visit Instagram'}<ArrowUpRight /></a></Button></footer>
      <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent className="reel-dialog">
          {selected && <><DialogTitle>{selected[language]}</DialogTitle><DialogDescription>{mr ? 'व्हिडिओ मूळ इन्स्टाग्राम पोस्टवर उघडतो. इन्स्टाग्रामवर लॉगिन आवश्यक असू शकते.' : 'Playback opens on the original Instagram post. Instagram may require sign-in.'}</DialogDescription><Button asChild variant="ghost" className="reel-preview"><a href={reelUrl(selected.id)} target="_blank" rel="noopener noreferrer" aria-label={mr ? 'इन्स्टाग्रामवर व्हिडिओ उघडा' : 'Open video on Instagram'}><img src={selected.cover} alt={selected[language]} /><span className="reel-play"><Play size={24} fill="currentColor" /></span></a></Button><Button asChild variant="saffron"><a href={reelUrl(selected.id)} target="_blank" rel="noopener noreferrer">{mr ? 'इन्स्टाग्रामवर पाहा' : 'Watch on Instagram'}<ArrowUpRight /></a></Button></>}
        </DialogContent>
      </Dialog>
    </main>
  );
}