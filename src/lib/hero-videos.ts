// Looping background reel for the videos page hero, in the style of whitehouse.gov:
// a silent, autoplaying montage that cross-fades between clips while the headline sits on top.
// Clips are portrait (9:16); the background shows each full frame uncropped so no head is cut off.
// Prefixed so assets resolve under the GitHub Pages sub-path as well as locally.
const base = import.meta.env.BASE_URL;

export const heroClips = [
  {
    src: `${base}videos/hero-flood-relief.mp4`,
    poster: `${base}videos/hero-flood-relief.jpg`,
    caption: {
      en: "Crossing the flooded crossing with villagers",
      mr: "पूरग्रस्त ओढा ग्रामस्थांसह पार करताना",
    },
  },
  {
    src: `${base}videos/hero-field-visit.mp4`,
    poster: `${base}videos/hero-field-visit.jpg`,
    caption: { en: "Walking the fields with farmers", mr: "शेतकऱ्यांसमवेत बांधावर फेरफटका" },
  },
  {
    src: `${base}videos/hero-community.mp4`,
    poster: `${base}videos/hero-community.jpg`,
    caption: {
      en: "Listening to the community, on site",
      mr: "प्रत्यक्ष जागेवर जनतेचे म्हणणे ऐकताना",
    },
  },
] as const;
export type HeroClip = (typeof heroClips)[number];
