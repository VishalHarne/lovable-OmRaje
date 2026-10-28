import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { fbPosts, type Lang } from "@/lib/fb-posts";

const POST_MS = 7500;

export function PostShowcase({ language }: { language: Lang }) {
  const [active, setActive] = useState(0);
  const total = fbPosts.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % total), POST_MS);
    return () => window.clearInterval(timer);
  }, [active, total]);

  const go = (step: number) => setActive((i) => (i + step + total) % total);
  const current = fbPosts[active];

  return (
    <div className="pw" style={{ ["--accent" as string]: current?.accent }}>
      <div className="pw-ambient" aria-hidden="true">
        {fbPosts.map((post, index) => (
          <img key={post.id} src={post.photos[0]} alt="" className={index === active ? "is-on" : ""} />
        ))}
      </div>
      <div className="pw-grain" aria-hidden="true" />

      <div className="pw-stage">
        {fbPosts.map((post, index) => {
          const isActive = index === active;
          const shots = post.photos.slice(0, 3);
          return (
            <article
              key={post.id}
              className={`pw-card pw-n${shots.length} ${isActive ? "is-active" : ""}`}
              style={{ ["--accent" as string]: post.accent }}
              aria-hidden={!isActive}
            >
              <div className="pw-collage">
                {shots.map((src, i) => (
                  <figure key={src} className={`pw-shot pw-shot-${i + 1}`}>
                    <img src={src} alt={i === 0 ? post.title[language] : ""} />
                  </figure>
                ))}
                <span className="pw-place"><MapPin aria-hidden="true" />{post.place[language]}</span>
              </div>

              <div className="pw-copy">
                <span className="pw-num" aria-hidden="true">0{index + 1}</span>
                <p className="pw-kicker"><i />{post.tag[language]}</p>
                <h3 className="pw-title"><span>{post.title[language]}</span></h3>
                <p className="pw-body"><span>{post.body[language]}</span></p>
                <div className="pw-tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <a className="pw-cta" href="https://www.facebook.com/omprakashrajenimbalkar" target="_blank" rel="noopener noreferrer">
                  <span>{language === "en" ? "See the full post" : "संपूर्ण पोस्ट पहा"}</span><ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <div className="pw-nav">
        <div className="pw-index" role="tablist" aria-label={language === "en" ? "Posts" : "पोस्ट"}>
          {fbPosts.map((post, index) => (
            <button key={post.id} type="button" role="tab" aria-selected={index === active} aria-label={post.title[language]} className={index === active ? "is-active" : ""} onClick={() => setActive(index)}>
              <b>0{index + 1}</b><i><em /></i>
            </button>
          ))}
        </div>
        <div className="pw-arrows">
          <button type="button" aria-label={language === "en" ? "Previous post" : "मागील पोस्ट"} onClick={() => go(-1)}><ArrowLeft /></button>
          <button type="button" aria-label={language === "en" ? "Next post" : "पुढील पोस्ट"} onClick={() => go(1)}><ArrowRight /></button>
        </div>
      </div>
    </div>
  );
}