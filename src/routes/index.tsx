import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import fieldVisit from "@/assets/om-raje/field-visit-enhanced.jpg";
import portrait from "@/assets/om-raje/portrait.webp";
import communityVisit from "@/assets/om-raje/community-visit.webp";
import citizenMeeting from "@/assets/om-raje/citizen-meeting.webp";
import publicMeeting from "@/assets/om-raje/public-meeting-enhanced.jpg";
import partySymbol from "@/assets/om-raje/party-symbol.webp";
import coverOne from "@/assets/om-raje/cover-1.png";
import coverThreeNew from "@/assets/om-raje/cover-3.png";
import coverFourNew from "@/assets/om-raje/cover-4.png";
import coverFive from "@/assets/om-raje/cover-5.png";
import nightRally from "@/assets/om-raje/night-rally-enhanced.jpg";
import nightSpeech from "@/assets/om-raje/night-speech-enhanced.jpg";
import fSmile from "@/assets/om-raje/field-smile.webp";
import fSitIn from "@/assets/om-raje/field-sit-in.webp";
import fVillage from "@/assets/om-raje/field-village-visit.webp";
import fStage from "@/assets/om-raje/field-stage-address.webp";
import fCitizen from "@/assets/om-raje/field-citizen-meet.webp";
import fTribute from "@/assets/om-raje/field-shivaji-tribute.webp";

type Language = "en" | "mr";

const content = {
  en: {
    nav: ["About", "Public work", "Initiatives", "Events", "Contact"],
    heroEyebrow: "YOUR VOICE. YOUR CONSTITUENCY.",
    heroTitle: "Listening first. Moving forward, together.",
    heroBody:
      "A people-first space for Dharashiv — to follow public work, find opportunity and make your voice heard.",
    explore: "Explore the work",
    contact: "Get in touch",
    principles: ["Listening first", "Working together", "Moving forward"],
    aboutOverline: "01 / A PEOPLE’S REPRESENTATIVE",
    aboutTitle: "Grounded in the people. Focused on what’s next.",
    aboutBody:
      "Omprakash Raje Nimbalkar is a Maharashtra politician who has represented the Osmanabad—now Dharashiv—constituency in the Lok Sabha and served in the Maharashtra Legislative Assembly.",
    aboutNote:
      "A citizen-facing space to share public updates, opportunities and ways to get involved. Details and dates will be updated when officially announced.",
    timeline: "A journey in public service",
    timelineNote: "Elected service in Maharashtra",
    years: [
      ["2009", "Elected to the Maharashtra Legislative Assembly."],
      ["2019", "Elected to the 17th Lok Sabha from Osmanabad."],
      ["2024", "Re-elected to the 18th Lok Sabha from Dharashiv."],
    ],
    workOverline: "02 / WORK THAT MATTERS",
    workTitle: "Progress starts with showing up.",
    workBody:
      "Public life is built on listening, following through and keeping people connected to the work that affects them.",
    workCards: [
      ["On the ground", "Listening to local voices and staying connected with people across the constituency.", "Community"],
      ["People’s issues", "A space to bring concerns forward and help residents find the right next step.", "Citizen help"],
      ["Opportunity for all", "Connecting young people with employment information and career opportunities.", "Employment"],
    ],
    galleryOverline: "IN THE CONSTITUENCY",
    galleryTitle: "Closer to the people.",
    galleryNote: "Moments from the field",
    imageCaptions: ["Listening where it matters.", "Every voice deserves a hearing.", "Closer to the community."],
    initiativeOverline: "03 / THE NEXT STEP",
    initiativeLabel: "ROJGAR MELAVA · EMPLOYMENT FAIR",
    initiativeTitle: "Opportunity should be within reach.",
    initiativeBody:
      "A proposed employment fair registration desk for job seekers and employers in Dharashiv. Dates and participation details will be shared once officially confirmed.",
    register: "Register your interest",
    formTitle: "Take your next step",
    formSubtitle: "For candidates and employers",
    name: "Full name",
    phone: "Mobile number",
    email: "Email address (optional)",
    role: "I am a…",
    candidate: "Job seeker",
    employer: "Employer",
    town: "Taluka / town",
    choose: "Select one",
    submitInterest: "Submit interest",
    formDisclaimer:
      "Preview form only. Your details are not stored or sent to an office.",
    formSuccess: "Interest noted in this preview",
    formSuccessNote: "No information was sent. Check back for officially announced event details.",
    eventOverline: "04 / MARK YOUR CALENDAR",
    eventTitle: "Good things are better when we do them together.",
    eventBody: "Upcoming public meetings and employment-fair dates will appear here once confirmed.",
    eventStatus: "UPDATES COMING SOON",
    eventName: "Dharashiv public programme",
    eventSub: "Verified dates, venues and registration details will be shared here.",
    eventDate: "Date to be announced",
    eventsContact: "Get in touch",
    contactOverline: "05 / YOUR VOICE MATTERS",
    contactTitle: "Let’s make things better.",
    contactBody:
      "Raise a local concern or ask a question. This preview does not deliver submissions; an official office contact channel is needed before launch.",
    grievanceTitle: "Share a concern",
    grievanceSubtitle: "Tell us what you need help with.",
    concernName: "Your name",
    concernContact: "Phone or email",
    topic: "What is this about?",
    topicPlaceholder: "Choose a topic",
    topics: ["Roads & infrastructure", "Water & agriculture", "Public services", "Employment", "Other"],
    message: "Your message",
    sendMessage: "Prepare my message",
    grievanceDisclaimer: "Preview only. Your message is not sent or stored.",
    grievanceSuccess: "Message drafted",
    grievanceSuccessNote: "This preview cannot deliver messages. An official contact channel needs to be added.",
    facebook: "Find on Facebook",
    facebookHint: "Search for Om Raje Nimbalkar",
    whatsapp: "WhatsApp",
    whatsappHint: "Open WhatsApp to share a message",
    instagram: "Find on Instagram",
    socialNote:
      "Social links open public search or sharing pages. No official WhatsApp number or verified page has been provided.",
    footerLine: "In service. In solidarity. In progress.",
    footerLabel: "A public-service website concept · Dharashiv, Maharashtra",
    top: "Back to top",
  },
  mr: {
    nav: ["परिचय", "लोककार्य", "उपक्रम", "कार्यक्रम", "संपर्क"],
    heroEyebrow: "तुमचा आवाज. तुमचा मतदारसंघ.",
    heroTitle: "आधी ऐकून घेऊ. एकत्र पुढे जाऊ.",
    heroBody: "धाराशिवसाठी जनतेचे व्यासपीठ — लोककार्य, संधी आणि आपला आवाज पोहोचवण्याचा मार्ग.",
    explore: "कार्य जाणून घ्या",
    contact: "संपर्क साधा",
    principles: ["आधी ऐकून घेऊ", "एकत्र काम करू", "पुढे वाटचाल करू"],
    aboutOverline: "०१ / जनतेचा प्रतिनिधी",
    aboutTitle: "जनतेशी नाळ. उद्याच्या विकासावर लक्ष.",
    aboutBody:
      "ओमप्रकाश राजे निंबाळकर हे महाराष्ट्रातील राजकारणी आहेत. त्यांनी उस्मानाबाद—आताचा धाराशिव—लोकसभा मतदारसंघाचे प्रतिनिधित्व केले असून महाराष्ट्र विधानसभेवरही काम केले आहे.",
    aboutNote:
      "लोककार्य, संधी आणि सहभागाची माहिती नागरिकांपर्यंत पोहोचवण्यासाठी हे व्यासपीठ आहे. कार्यक्रम व तारखा अधिकृत घोषणा झाल्यानंतर अद्ययावत केल्या जातील.",
    timeline: "लोकसेवेचा प्रवास",
    timelineNote: "महाराष्ट्रातील निवडून दिलेली सेवा",
    years: [
      ["२००९", "महाराष्ट्र विधानसभेवर निवड."],
      ["२०१९", "उस्मानाबाद मतदारसंघातून १७व्या लोकसभेवर निवड."],
      ["२०२४", "धाराशिव मतदारसंघातून १८व्या लोकसभेवर पुन्हा निवड."],
    ],
    workOverline: "०२ / लोकहिताचे कार्य",
    workTitle: "बदलाची सुरुवात जनतेतून.",
    workBody: "लोकसेवा म्हणजे लोकांचे प्रश्न ऐकणे, त्यांचा पाठपुरावा करणे आणि आवश्यक माहिती पोहोचवणे.",
    workCards: [
      ["जनतेत राहून", "मतदारसंघातील नागरिकांशी संवाद साधणे आणि स्थानिक प्रश्न समजून घेणे.", "लोकसहभाग"],
      ["जनतेचे प्रश्न", "आपली अडचण मांडण्यासाठी आणि पुढचे योग्य पाऊल जाणून घेण्यासाठी व्यासपीठ.", "नागरिक मदत"],
      ["सर्वांसाठी संधी", "रोजगार आणि करिअरच्या संधींची माहिती युवकांपर्यंत पोहोचवणे.", "रोजगार"],
    ],
    galleryOverline: "मतदारसंघात",
    galleryTitle: "जनतेच्या अधिक जवळ.",
    galleryNote: "कार्य क्षेत्रातील काही क्षण",
    imageCaptions: ["जिथे प्रश्न, तिथे संवाद.", "प्रत्येक आवाज महत्त्वाचा.", "समुदायासोबत, समुदायासाठी."],
    initiativeOverline: "०३ / पुढचे पाऊल",
    initiativeLabel: "रोजगार मेळावा · नोकरीची संधी",
    initiativeTitle: "संधी प्रत्येकापर्यंत पोहोचली पाहिजे.",
    initiativeBody:
      "धाराशिवमधील नोकरी शोधणारे उमेदवार आणि नियोक्त्यांसाठी प्रस्तावित रोजगार मेळावा नोंदणी. अधिकृत खात्री झाल्यानंतर तारीख व सहभागाची माहिती जाहीर केली जाईल.",
    register: "आपली आवड नोंदवा",
    formTitle: "पुढचे पाऊल उचला",
    formSubtitle: "उमेदवार आणि नियोक्त्यांसाठी",
    name: "पूर्ण नाव",
    phone: "मोबाईल क्रमांक",
    email: "ई-मेल (ऐच्छिक)",
    role: "मी आहे…",
    candidate: "नोकरी शोधणारा / शोधणारी",
    employer: "नियोक्ता",
    town: "तालुका / गाव",
    choose: "एक पर्याय निवडा",
    submitInterest: "आवड नोंदवा",
    formDisclaimer: "डेमो फॉर्म. तुमची माहिती साठवली किंवा कार्यालयात पाठवली जात नाही.",
    formSuccess: "डेमोमध्ये आवड नोंदवली",
    formSuccessNote: "कोणतीही माहिती पाठवलेली नाही. अधिकृत घोषणांसाठी पुन्हा येथे पाहा.",
    eventOverline: "०४ / दिनदर्शिकेत नोंद करा",
    eventTitle: "एकत्र आलो, तर प्रत्येक गोष्ट शक्य.",
    eventBody: "आगामी जनसंवाद व रोजगार मेळाव्याच्या अधिकृत तारखा निश्चित झाल्यावर येथे दिल्या जातील.",
    eventStatus: "अद्ययावत माहिती लवकरच",
    eventName: "धाराशिव जनसंवाद कार्यक्रम",
    eventSub: "अधिकृत तारीख, ठिकाण आणि नोंदणीची माहिती येथे दिली जाईल.",
    eventDate: "तारीख जाहीर होणे बाकी",
    eventsContact: "संपर्क साधा",
    contactOverline: "०५ / तुमचा आवाज महत्त्वाचा",
    contactTitle: "चला, बदल घडवूया.",
    contactBody:
      "स्थानिक प्रश्न मांडा किंवा माहिती विचारा. या झलकमधून संदेश पाठवले जात नाहीत—प्रकाशनापूर्वी कार्यालयाचे अधिकृत संपर्क माध्यम आवश्यक आहे.",
    grievanceTitle: "तुमची अडचण सांगा",
    grievanceSubtitle: "कशाबाबत मदत हवी आहे ते लिहा.",
    concernName: "तुमचे नाव",
    concernContact: "फोन किंवा ई-मेल",
    topic: "अडचणीचा विषय",
    topicPlaceholder: "विषय निवडा",
    topics: ["रस्ते व पायाभूत सुविधा", "पाणी व शेती", "सार्वजनिक सेवा", "रोजगार", "इतर"],
    message: "तुमचा संदेश",
    sendMessage: "संदेश तयार करा",
    grievanceDisclaimer: "डेमो फॉर्म. तुमचा संदेश पाठवला किंवा साठवला जात नाही.",
    grievanceSuccess: "संदेशाचा मसुदा तयार",
    grievanceSuccessNote: "या झलकमधून संदेश पाठवता येत नाही. अधिकृत संपर्क माध्यम जोडणे आवश्यक आहे.",
    facebook: "फेसबुकवर शोधा",
    facebookHint: "ओम राजे निंबाळकर यांचा शोध घ्या",
    whatsapp: "व्हॉट्सॲप",
    whatsappHint: "व्हॉट्सॲपवर संदेश शेअर करा",
    instagram: "इन्स्टाग्रामवर शोधा",
    socialNote:
      "समाजमाध्यमांच्या लिंक्स सार्वजनिक शोध व शेअर पृष्ठे उघडतात. अधिकृत व्हॉट्सॲप क्रमांक किंवा सत्यापित पेजची लिंक उपलब्ध नाही.",
    footerLine: "सेवेत. सोबतीने. प्रगतीकडे.",
    footerLabel: "लोकसेवा संकेतस्थळाची संकल्पना · धाराशिव, महाराष्ट्र",
    top: "सुरुवातीला जा",
  },
} as const;

const navigationIds = ["about", "work", "initiatives", "events", "contact"];
const coverSlides = [coverOne, fieldVisit, nightSpeech, coverThreeNew, coverFourNew, coverFive];
const fieldWall = [
  { src: fSmile, en: "Among supporters", mr: "कार्यकर्त्यांसोबत" },
  { src: nightRally, en: "Evening public gathering", mr: "सायंकाळची जाहीर सभा" },
  { src: fCitizen, en: "Listening to residents", mr: "नागरिकांशी संवाद" },
  { src: fSitIn, en: "Standing with farmers", mr: "शेतकऱ्यांच्या पाठीशी" },
  { src: fTribute, en: "Tribute to Chhatrapati Shivaji Maharaj", mr: "छत्रपती शिवाजी महाराजांना अभिवादन" },
  { src: fVillage, en: "Village visit", mr: "गाव भेट" },
  { src: fStage, en: "Addressing the people", mr: "जनतेला संबोधन" },
  { src: nightSpeech, en: "Voice for Dharashiv", mr: "धाराशिवचा आवाज" },
];
const pictures = [communityVisit, citizenMeeting, publicMeeting];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Om Raje Nimbalkar | Dharashiv Public Service" },
      {
        name: "description",
        content:
          "Discover public work, local opportunities and ways to share your voice across Dharashiv. Available in English and Marathi.",
      },
      { property: "og:title", content: "Om Raje Nimbalkar | Dharashiv Public Service" },
      {
        property: "og:description",
        content:
          "Discover public work, local opportunities and ways to share your voice across Dharashiv. Available in English and Marathi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [language, setLanguage] = useState<Language>("mr");
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const t = content[language];
  const alternate = language === "en" ? "mr" : "en";
  const slides = coverSlides;

  function closeMenu() {
    setMenuOpen(false);
  }

  function submitPreview(event: FormEvent<HTMLFormElement>, kind: "interest" | "message") {
    event.preventDefault();
    if (kind === "interest") setInterestSent(true);
    else setMessageSent(true);
  }

  return (
    <main className={`site ${language === "mr" ? "site-marathi" : ""}`} lang={language}>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Om Raje Nimbalkar, home" onClick={closeMenu}>
          <img src={partySymbol} alt="Shiv Sena symbol" />
          <span className="brand-label"><strong>OM RAJE</strong><small>NIMBALKAR · धाराशिव</small></span>
        </a>
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
          {t.nav.map((item, index) => (
            <a key={navigationIds[index]} href={`#${navigationIds[index]}`} onClick={closeMenu}>
              {item}
            </a>
          ))}
          <Button asChild variant="ghost" className="home-video-link"><Link to="/videos" onClick={closeMenu}>{language === 'en' ? 'Videos' : 'व्हिडिओ'}<ArrowUpRight size={13} /></Link></Button>
        </nav>
        <div className="header-tools">
          <button
            className="language-switch"
            type="button"
            onClick={() => setLanguage(alternate)}
            aria-label={language === "en" ? "Switch to Marathi" : "Switch to English"}
          >
            <span className={language === "en" ? "language-current" : ""}>EN</span>
            <span aria-hidden="true">/</span>
            <span className={language === "mr" ? "language-current" : ""}>मराठी</span>
          </button>
          <button
            className="menu-switch"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero" id="home" aria-label={t.heroEyebrow}>
        <img key={slides[slide % slides.length]} className="hero-image" src={slides[slide % slides.length]} alt="Om Raje meeting residents in Dharashiv" />
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span />{t.heroEyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-description">{t.heroBody}</p>
        </div>
        <div className="hero-footnote"><span className="hero-live-dot" />{language === "en" ? "ALWAYS IN THE FIELD" : "सदैव जनतेत"}</div>
        <div className="hero-controls" aria-label="Featured photos">
          <button
            className="icon-control"
            type="button"
            aria-label={language === "en" ? "Previous photo" : "मागील छायाचित्र"}
            onClick={() => setSlide((index) => (index - 1 + slides.length) % slides.length)}
          ><ChevronLeft /></button>
          <span>{String((slide % slides.length) + 1).padStart(2, "0")} <i>/</i> {String(slides.length).padStart(2, "0")}</span>
          <button
            className="icon-control"
            type="button"
            aria-label={language === "en" ? "Next photo" : "पुढील छायाचित्र"}
            onClick={() => setSlide((index) => (index + 1) % slides.length)}
          ><ChevronRight /></button>
        </div>
      </section>

      <div className="principle-strip" aria-label={language === "en" ? "Our values" : "आपली मूल्ये"}>
        {t.principles.map((principle, index) => (
          <div className="principle" key={principle}><span>0{index + 1}</span><strong>{principle}</strong><ArrowUpRight aria-hidden="true" /></div>
        ))}
      </div>

      <div className="impact-band" aria-label={language === "en" ? "Focus areas" : "प्राधान्य क्षेत्रे"}>
        {(language === "en"
          ? [["Farmers", "Water, crops & rural support"], ["Youth", "Jobs & skill melavas"], ["Families", "Health & welfare access"], ["Villages", "Roads & local works"]]
          : [["शेतकरी", "पाणी, पीक व ग्रामीण मदत"], ["युवा", "रोजगार व कौशल्य मेळावे"], ["कुटुंबे", "आरोग्य व कल्याण योजना"], ["गावे", "रस्ते व स्थानिक कामे"]]
        ).map(([title, body]) => (
          <div className="impact-item" key={title}><HeartHandshake aria-hidden="true" /><strong>{title}</strong><span>{body}</span></div>
        ))}
      </div>

      <section className="content-section about-section" id="about">
        <SectionMarker number={t.aboutOverline} />
        <div className="about-grid">
          <figure className="portrait-frame">
            <img src={portrait} alt="Portrait of Om Raje Nimbalkar" />
            <figcaption><span>धाराशिव, महाराष्ट्र</span><span>·</span><span>FOR THE PEOPLE</span></figcaption>
          </figure>
          <div className="about-copy">
            <h2>{t.aboutTitle}</h2>
            <p className="about-description">{t.aboutBody}</p>
            <div className="context-note"><Sparkles aria-hidden="true" /><p>{t.aboutNote}</p></div>
            <a className="section-link" href="#timeline">{t.timeline}<ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
        <div className="timeline" id="timeline">
          <div className="timeline-label"><h3>{t.timeline}</h3><p>{t.timelineNote}</p></div>
          <div className="timeline-list">
            {t.years.map(([year, detail], index) => (
              <article className="timeline-item" key={year}>
                <span className="timeline-marker">{index === 2 ? <Check aria-hidden="true" /> : null}</span>
                <strong>{year}</strong><p>{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="work-section content-section" id="work">
        <SectionMarker number={t.workOverline} inverse />
        <div className="work-heading"><h2>{t.workTitle}</h2><p>{t.workBody}</p></div>
        <div className="work-grid">
          {t.workCards.map(([title, body, label], index) => {
            const icons = [<UsersRound aria-hidden="true" />, <HeartHandshake aria-hidden="true" />, <Sparkles aria-hidden="true" />];
            return (
              <article className="work-item" key={title}>
                <span className="work-number">0{index + 1}</span>
                <span className="work-symbol">{icons[index]}</span>
                <h3>{title}</h3><p>{body}</p>
                <span className="work-category">{label}<ArrowUpRight aria-hidden="true" /></span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="gallery-section" aria-label={t.galleryOverline}>
        <div className="gallery-heading">
          <div><p className="eyebrow">{t.galleryOverline}</p><h2>{t.galleryTitle}</h2></div>
          <p>{t.galleryNote}<ArrowDownRight aria-hidden="true" /></p>
        </div>
        <div className="photo-gallery">
          {pictures.map((picture, index) => (
            <figure className={`gallery-photo gallery-photo-${index + 1}`} key={picture}>
              <img src={picture} alt={t.imageCaptions[index]} loading="lazy" />
              <figcaption><span>0{index + 1} / DHARASHIV</span><strong>{t.imageCaptions[index]}</strong></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="field-wall" aria-label={language === "en" ? "In the field" : "जनतेत"}>
        <div className="field-wall-head">
          <p className="eyebrow">{language === "en" ? "ON THE GROUND" : "प्रत्यक्ष जनतेत"}</p>
          <h2>{language === "en" ? "Every village. Every voice." : "प्रत्येक गाव. प्रत्येक आवाज."}</h2>
        </div>
        <div className="field-wall-grid">
          {fieldWall.map((item, index) => (
            <figure className={`field-tile field-tile-${index + 1}`} key={item.en}>
              <img src={item.src} alt={item[language]} loading="lazy" />
              <figcaption>{item[language]}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="initiative-section content-section" id="initiatives">
        <SectionMarker number={t.initiativeOverline} />
        <div className="initiative-grid">
          <div className="initiative-copy">
            <span className="initiative-label"><span />{t.initiativeLabel}</span>
            <h2>{t.initiativeTitle}</h2>
            <p>{t.initiativeBody}</p>
            <Button asChild variant="ink" size="large"><a href="#register">{t.register}<ArrowRight aria-hidden="true" /></a></Button>
            <span className="initiative-script" aria-hidden="true">रोजगार</span>
          </div>
          <div className="form-panel" id="register">
            {interestSent ? (
              <SuccessPanel title={t.formSuccess} body={t.formSuccessNote} onReset={() => setInterestSent(false)} resetLabel={language === "en" ? "Submit another response" : "दुसरी नोंद करा"} />
            ) : (
              <>
                <FormHeading eyebrow="ROJGAR MELAVA / रोजगार मेळावा" title={t.formTitle} subtitle={t.formSubtitle} />
                <form className="preview-form" onSubmit={(event) => submitPreview(event, "interest")}>
                  <label>{t.name}<input autoComplete="name" name="name" required placeholder={t.name} /></label>
                  <div className="form-row">
                    <label>{t.phone}<input autoComplete="tel" name="phone" required type="tel" pattern="[0-9+() -]{10,16}" placeholder="+91" /></label>
                    <label>{t.email}<input autoComplete="email" name="email" type="email" placeholder="name@email.com" /></label>
                  </div>
                  <label>{t.role}<select name="role" required defaultValue=""><option value="" disabled>{t.choose}</option><option>{t.candidate}</option><option>{t.employer}</option></select></label>
                  <label>{t.town}<input autoComplete="address-level2" name="town" required placeholder={t.town} /></label>
                  <Button variant="saffron" size="large" className="form-submit" type="submit">{t.submitInterest}<ArrowUpRight aria-hidden="true" /></Button>
                  <p className="form-note"><ShieldCheck aria-hidden="true" />{t.formDisclaimer}</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="events-section content-section" id="events">
        <SectionMarker number={t.eventOverline} inverse />
        <div className="events-grid">
          <div className="events-copy"><h2>{t.eventTitle}</h2><p>{t.eventBody}</p><a className="section-link light-link" href="#contact">{t.eventsContact}<ArrowUpRight aria-hidden="true" /></a></div>
          <article className="event-panel">
            <div className="event-panel-top"><span className="event-symbol"><Sparkles aria-hidden="true" /></span><span className="event-status">{t.eventStatus}</span></div>
            <p className="event-placeholder">TBA<span>2026</span></p>
            <h3>{t.eventName}</h3><p className="event-description">{t.eventSub}</p>
            <div className="event-date"><span><i />{t.eventDate}</span><ArrowUpRight aria-hidden="true" /></div>
          </article>
        </div>
      </section>

      <section className="contact-section content-section" id="contact">
        <SectionMarker number={t.contactOverline} />
        <div className="contact-intro"><h2>{t.contactTitle}</h2><p>{t.contactBody}</p></div>
        <div className="contact-grid">
          <div className="social-list">
            <a href="https://www.facebook.com/search/top?q=om%20raje%20nimbalkar" target="_blank" rel="noreferrer" className="social-link">
              <span className="social-badge">f</span><span><strong>{t.facebook}</strong><small>{t.facebookHint}</small></span><ArrowUpRight aria-hidden="true" />
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(language === "en" ? "Hello, I would like to get in touch with the Dharashiv public office." : "नमस्कार, मला धाराशिवच्या जनसंपर्क कार्यालयाशी संपर्क साधायचा आहे.")}`} target="_blank" rel="noreferrer" className="social-link">
              <span className="social-badge social-whatsapp"><MessageCircle aria-hidden="true" /></span><span><strong>{t.whatsapp}</strong><small>{t.whatsappHint}</small></span><ArrowUpRight aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/explore/search/keyword/?q=om%20raje%20nimbalkar" target="_blank" rel="noreferrer" className="social-link">
              <span className="social-badge social-instagram">◎</span><span><strong>{t.instagram}</strong><small>Om Raje Nimbalkar</small></span><ArrowUpRight aria-hidden="true" />
            </a>
            <p className="social-disclaimer">{t.socialNote}</p>
          </div>
          <div className="form-panel grievance-panel">
            {messageSent ? (
              <SuccessPanel title={t.grievanceSuccess} body={t.grievanceSuccessNote} onReset={() => setMessageSent(false)} resetLabel={language === "en" ? "Write another message" : "दुसरा संदेश लिहा"} />
            ) : (
              <>
                <FormHeading eyebrow="CITIZEN HELP DESK / नागरिक मदत" title={t.grievanceTitle} subtitle={t.grievanceSubtitle} />
                <form className="preview-form" onSubmit={(event) => submitPreview(event, "message")}>
                  <label>{t.concernName}<input name="concern-name" autoComplete="name" required placeholder={t.concernName} /></label>
                  <div className="form-row">
                    <label>{t.concernContact}<input name="concern-contact" required placeholder={t.concernContact} /></label>
                    <label>{t.topic}<select name="topic" required defaultValue=""><option value="" disabled>{t.topicPlaceholder}</option>{t.topics.map((topic) => <option key={topic}>{topic}</option>)}</select></label>
                  </div>
                  <label>{t.message}<textarea name="message" required placeholder={t.message} /></label>
                  <Button variant="ink" size="large" className="form-submit" type="submit">{t.sendMessage}<ArrowUpRight aria-hidden="true" /></Button>
                  <p className="form-note"><ShieldCheck aria-hidden="true" />{t.grievanceDisclaimer}</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home"><img src={partySymbol} alt="" /><span className="brand-label"><strong>OM RAJE</strong><small>NIMBALKAR · धाराशिव</small></span></a>
        <p className="footer-motto">{t.footerLine}</p>
        <p className="footer-label">{t.footerLabel}</p>
        <a className="back-top" href="#home">{t.top}<ArrowUpRight aria-hidden="true" /></a>
      </footer>
    </main>
  );
}

function SectionMarker({ number, inverse = false }: { number: string; inverse?: boolean }) {
  return <div className={`section-marker ${inverse ? "section-marker-inverse" : ""}`}><span>{number}</span><i aria-hidden="true">✳</i></div>;
}

function FormHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <div className="form-heading"><div><span className="form-eyebrow">{eyebrow}</span><h3>{title}</h3><p>{subtitle}</p></div><span className="form-icon"><HeartHandshake aria-hidden="true" /></span></div>;
}

function SuccessPanel({ title, body, onReset, resetLabel }: { title: string; body: string; onReset: () => void; resetLabel: string }) {
  return <div className="success-panel"><span className="success-check"><Check aria-hidden="true" /></span><h3>{title}</h3><p>{body}</p><Button variant="text" type="button" onClick={onReset}>{resetLabel}<ArrowRight aria-hidden="true" /></Button></div>;
}