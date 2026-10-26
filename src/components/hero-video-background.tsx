import { useEffect, useRef, useState } from "react";
import type { HeroClip } from "@/lib/hero-videos";

interface HeroVideoBackgroundProps {
  clips: readonly HeroClip[];
  language: "en" | "mr";
}

// Silent, autoplaying montage that cross-fades between clips, mirroring whitehouse.gov's
// hero treatment. Falls back to a static poster when the visitor prefers reduced motion.
export function HeroVideoBackground({ clips, language }: HeroVideoBackgroundProps) {
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRefs.current[active];
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [active, reducedMotion]);

  const firstClip = clips[0];
  const activeClip = clips[active];

  if (reducedMotion) {
    return firstClip ? <img src={firstClip.poster} alt="" className="video-hero-image" /> : null;
  }

  return (
    <div className="video-hero-bg" aria-hidden="true">
      {clips.map((clip, index) => (
        <img
          key={`ambient-${clip.src}`}
          src={clip.poster}
          alt=""
          className={`video-hero-ambient ${index === active ? "is-active" : ""}`}
        />
      ))}
      <div className="video-hero-stage">
      {clips.map((clip, index) => (
        <video
          key={clip.src}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          className={`video-hero-bg-layer ${index === active ? "is-active" : ""}`}
          src={clip.src}
          poster={clip.poster}
          muted
          playsInline
          preload="auto"
          autoPlay={index === 0}
          onEnded={() => setActive((current) => (current + 1) % clips.length)}
        />
      ))}
      </div>
      <span className="video-hero-bg-caption">{activeClip?.caption[language]}</span>
    </div>
  );
}
