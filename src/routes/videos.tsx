import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Instagram, Play, Film, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { reels, reelCategories, reelUrl, type Reel, type ReelCategory } from "@/lib/reels";
import { heroClips } from "@/lib/hero-videos";
import { HeroVideoBackground } from "@/components/hero-video-background";
import { LanguageSwitch } from "@/components/language-switch";
import type { Lang } from "@/lib/fb-posts";
import partySymbol from "@/assets/om-raje/party-symbol.webp";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "ओम राजे निंबालकर | जनजीवन के पल" },
      {
        name: "description",
        content:
          "धाराशिव में जनता के बीच, जनकार्य और सामुदायिक परंपराओं के चुनिंदा इंस्टाग्राम रील्स।",
      },
      { property: "og:title", content: "ओम राजे निंबालकर | जनजीवन के पल" },
      {
        property: "og:description",
        content:
          "ओम राजे निंबालकर के जनसंपर्क, जनकार्य और सामुदायिक परंपराओं के चुनिंदा वीडियो।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  const [language, setLanguage] = useState<Lang>("mr");
  const [category, setCategory] = useState<ReelCategory>("all");
  const [selected, setSelected] = useState<Reel | null>(null);
  const tr = (en: string, mr: string, hi: string) =>
    language === "en" ? en : language === "mr" ? mr : hi;
  const featured = reels[0];
  const visible = reels.filter((reel) => category === "all" || reel.category === category);
  return (
    <main className="site site-marathi video-page" lang={language}>
      <header className="site-header video-header">
        <Link to="/" className="brand" aria-label={tr("Om Raje Nimbalkar, home", "ओम राजे निंबाळकर, मुख्यपृष्ठ", "ओम राजे निंबालकर, मुख्यपृष्ठ")}>
          <img src={partySymbol} alt="" />
          <span className="brand-label">
            <strong>{tr("Om Raje", "ओम राजे", "ओम राजे")}</strong>
            <small>{tr("Nimbalkar · Dharashiv", "निंबाळकर · धाराशिव", "निंबालकर · धाराशिव")}</small>
          </span>
        </Link>
        <div className="header-tools">
          <Button asChild variant="ghost" className="video-home">
            <Link to="/">
              <ArrowLeft />
              {tr("Home", "मुख्य पृष्ठ", "मुखपृष्ठ")}
            </Link>
          </Button>
          <LanguageSwitch language={language} onChange={setLanguage} />
        </div>
      </header>
      <section className="video-hero">
        <HeroVideoBackground clips={heroClips} language={language} />
        <div className="video-hero-copy">
          <p className="eyebrow">
            <Film size={15} />
            {tr("Moments with the people", "जनतेतील क्षण", "जनजीवन के पल")}
          </p>
          <h1>
            {tr("Om Raje Nimbalkar", "ओम राजे निंबाळकर", "ओम राजे निंबालकर")}
            <span>{tr("Among the people. Every moment.", "जनतेत. प्रत्येक क्षणी.", "हर पल, जनता के बीच।")}</span>
          </h1>
          <p>
            {tr(
              "Conversations in the fields. A glimpse of public work. Traditions that bind us.",
              "शेतातला संवाद. लोककार्याची झलक. आपल्या परंपरांचा उत्सव.",
              "खेतों में संवाद। जनकार्य की झलक। हमें जोड़ने वाली परंपराएँ।",
            )}
          </p>
          <Button variant="saffron" size="large" onClick={() => setSelected(featured)}>
            <Play />
            {tr("Watch the featured reel", "प्रमुख व्हिडिओ पाहा", "प्रमुख रील देखें")}
          </Button>
        </div>
        <div className="video-hero-bottom">
          <span>
            <Instagram size={15} />
            @mpomrajenimbalkar
          </span>
          <a href="#collection">
            {tr("View the collection", "संग्रह पाहा", "संग्रह देखें")}
            <ArrowDown size={16} />
          </a>
        </div>
      </section>
      <section className="video-collection" id="collection">
        <div className="video-collection-heading">
          <div>
            <p className="eyebrow">
              {tr("Selected Instagram reels", "निवडक इन्स्टाग्राम रील्स", "चुनिंदा इंस्टाग्राम रील्स")}
            </p>
            <h2>{tr("People. Places. Public service.", "जनतेशी जोडलेले क्षण.", "लोग। जगहें। जनसेवा।")}</h2>
          </div>
          <span className="video-count">
            {String(visible.length).padStart(2, "0")} / {tr("Reels", "व्हिडिओ", "रील्स")}
          </span>
        </div>
        <div
          className="video-filters"
          role="group"
          aria-label={tr("Video categories", "व्हिडिओ विषय", "वीडियो श्रेणियाँ")}
        >
          {(Object.keys(reelCategories) as ReelCategory[]).map((key) => (
            <Button
              key={key}
              variant="ghost"
              className={category === key ? "video-filter is-active" : "video-filter"}
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {reelCategories[key][language]}
            </Button>
          ))}
        </div>
        <div className="video-grid">
          {visible.map((reel) => (
            <article className="reel-card" key={reel.id}>
              <Button
                variant="ghost"
                className="reel-cover"
                aria-label={`${tr("Watch", "पाहा", "देखें")}: ${reel[language]}`}
                onClick={() => setSelected(reel)}
              >
                <img src={reel.cover} alt={reel[language]} loading="lazy" />
                <span className="reel-category">{reelCategories[reel.category][language]}</span>
                <span className="reel-play">
                  <Play size={24} fill="currentColor" />
                </span>
                <span className="reel-cover-footer">
                  <Instagram size={17} />
                  <span>{tr("Watch reel", "रील पाहा", "रील देखें")}</span>
                  <ArrowUpRight size={19} />
                </span>
              </Button>
              <h3>{reel[language]}</h3>
              <p>{reel.description[language]}</p>
              <a
                className="reel-original"
                href={reelUrl(reel.id)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tr("Original post", "मूळ पोस्ट", "मूल पोस्ट")}
                <ArrowUpRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <footer className="video-footer">
        <div>
          <Instagram size={25} />
          <span>
            <strong>@mpomrajenimbalkar</strong>
            <small>{tr("More moments on Instagram", "इन्स्टाग्रामवरील आणखी क्षण", "इंस्टाग्राम पर और पल")}</small>
          </span>
        </div>
        <Button asChild variant="saffron">
          <a
            href="https://www.instagram.com/mpomrajenimbalkar/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {tr("Visit on Instagram", "इन्स्टाग्रामवर भेट द्या", "इंस्टाग्राम देखें")}
            <ArrowUpRight />
          </a>
        </Button>
      </footer>
      <ThemeSwitcher language={language} />
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="reel-dialog">
          {selected && (
            <>
              <DialogTitle>{selected[language]}</DialogTitle>
              <DialogDescription>
                {tr(
                  "The video opens on the original Instagram post. You may need to sign in to Instagram.",
                  "व्हिडिओ मूळ इन्स्टाग्राम पोस्टवर उघडतो. इन्स्टाग्रामवर लॉगिन आवश्यक असू शकते.",
                  "वीडियो मूल इंस्टाग्राम पोस्ट पर खुलेगा। इंस्टाग्राम पर साइन-इन करना पड़ सकता है।",
                )}
              </DialogDescription>
              <Button asChild variant="ghost" className="reel-preview">
                <a
                  href={reelUrl(selected.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tr("Open the video on Instagram", "इन्स्टाग्रामवर व्हिडिओ उघडा", "इंस्टाग्राम पर वीडियो खोलें")}
                >
                  <img src={selected.cover} alt={selected[language]} />
                  <span className="reel-play">
                    <Play size={24} fill="currentColor" />
                  </span>
                </a>
              </Button>
              <Button asChild variant="saffron">
                <a href={reelUrl(selected.id)} target="_blank" rel="noopener noreferrer">
                  {tr("Watch on Instagram", "इन्स्टाग्रामवर पाहा", "इंस्टाग्राम पर देखें")}
                  <ArrowUpRight />
                </a>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
