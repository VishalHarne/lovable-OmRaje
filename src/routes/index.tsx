import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { PostShowcase } from "@/components/post-showcase";
import {
  TurnstileWidget,
  TurnstileWidgetError,
  type TurnstileStatus,
  type TurnstileWidgetHandle,
} from "@/components/turnstile-widget";
import {
  grievanceTopics,
  SubmissionApiError,
  submitGrievance,
  submitResume,
  type CandidatePayload,
  type CandidateRole,
  type GrievancePayload,
} from "@/lib/backend-api";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  LoaderCircle,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
  Wheat,
  GraduationCap,
  House,
  MapPinned,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitch } from "@/components/language-switch";
import type { Lang } from "@/lib/fb-posts";
import portrait from "@/assets/om-raje/portrait.webp";
import nightRally from "@/assets/om-raje/night-rally-enhanced.jpg";
import nightSpeech from "@/assets/om-raje/night-speech-enhanced.jpg";
import fCitizen from "@/assets/om-raje/field-citizen-meet.webp";
import fTribute from "@/assets/om-raje/field-shivaji-tribute.webp";
import focusFarmers from "@/assets/om-raje/focus-farmers.svg";
import focusYouth from "@/assets/om-raje/focus-youth.svg";
import focusFamilies from "@/assets/om-raje/focus-families.svg";
import focusVillages from "@/assets/om-raje/focus-villages.svg";
import heroBannerTitle from "@/assets/om-raje/hero-banner-title.jpg";
import landingCover from "@/assets/om-raje/landing-cover.jpg";
import heroBanner1 from "@/assets/om-raje/hero-banner-1.jpg";
import heroBanner2 from "@/assets/om-raje/hero-banner-2.jpg";
import heroBanner3 from "@/assets/om-raje/hero-banner-3.jpg";
import heroBanner4 from "@/assets/om-raje/hero-banner-4.jpg";
import omdada01 from "@/assets/om-raje/omdada-01.jfif";
import omdada02 from "@/assets/om-raje/omdada-02.jfif";
import omdada03 from "@/assets/om-raje/omdada-03.jfif";
import omdada04 from "@/assets/om-raje/omdada-04.jfif";
import omdada05 from "@/assets/om-raje/omdada-05.jfif";
import omdada06 from "@/assets/om-raje/omdada-06.jfif";
import omdada07 from "@/assets/om-raje/omdada-07.jfif";
import omdada08 from "@/assets/om-raje/omdada-08.jfif";
import omdada09 from "@/assets/om-raje/omdada-09.jfif";

type Language = Lang;

const content = {
  en: {
    nav: ["About", "Public work", "Careers", "Events", "Grievances", "Connect"],
    heroTitle: "Many Problems, One Solution — Your OmRaje!",
    explore: "Explore the work",
    contact: "Get in touch",
    principles: ["Listening first", "Working together", "Moving forward"],
    aboutTitle: "Dharashiv is my home. Its people are my purpose.",
    aboutLead: "Our life, Dharashiv.",
    aboutBody:
      "For me this is not just a slogan; it captures the meaning of my entire politics. Wherever I am today and whatever I am is because of the love and trust of the people of Dharashiv, and I never forget that. That is why I strive to do everything possible for Dharashiv and its people. My bond with Dharashiv is not merely political; it is an affection rooted in its soil and its people.",
    timeline: "A Journey of Public Service.",
    years: [
      ["2009", "Elected as a Member of the Maharashtra Legislative Assembly (MLA)"],
      ["2019", "Elected to the 17th Lok Sabha from Dharashiv."],
      ["2024", "Re-elected to the 18th Lok Sabha from Dharashiv."],
    ],
    workTitle: "Let's Walk Together, Let's Build a Brighter Future!",
    workBody: "I firmly believe that every endeavour succeeds not through individual efforts alone, but through teamwork and collective commitment. This belief has always been the driving force behind my work. Let us come together, move forward as one, and build a brighter future for our people.",
    workCards: [
      ["On the ground", "Talking with people across the constituency and understanding local issues.", "Community"],
      ["People's issues", "A place to raise your concern and learn the right next step.", "Citizen help"],
      ["Opportunity for all", "Bringing employment and career opportunities to young people.", "Employment"],
    ],
    galleryTitle: "In the Hearts of the People, By Their Side",
    galleryNote: "Moments from the field",
    imageCaptions: ["Listening where it matters.", "Hands-on service.", "A conversation with the community."],
    fieldTitle: "Our Land, Our People",
    fieldParagraphs: [
      "There is a unique warmth and sense of belonging in the soil of Dharashiv. The land and its people have always showered me with immense love, trust, and blessings.",
      "This love and trust have been my constant inspiration to serve. I have always strived to do everything possible for our land and our people, and I will continue to do so with unwavering dedication.",
      "I have always felt indebted to this land and every person who calls it home, and I will remain so throughout my life.",
      "Our Land, Our People — our strength, our inspiration, and our identity.",
    ],
    initiativeTitle: "Dreams Empowered, Futures Guided.",
    initiativeBody:
      "Registration for a proposed employment fair for job seekers and employers in Dharashiv. Dates and participation details will be shared once officially confirmed.",
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
    formDisclaimer: "Your details will be sent securely.",
    formSuccess: "Interest submitted successfully",
    formSuccessNote: "Our system has received your details.",
    consent: "I consent to my details being sent and used to contact me.",
    resumeFile: "Résumé file (optional)",
    resumeFileHint: "PDF, DOC or DOCX — up to 10 MB",
    invalidResumeFile: "Please choose a PDF, DOC or DOCX file up to 10 MB.",
    submitting: "Sending…",
    securityLoading: "Loading security check…",
    securityUnavailable: "The security check is unavailable. Please try again shortly.",
    turnstileFailed: "The security check was not completed. Please try again.",
    verificationFailed: "The security check failed. Please try again.",
    verificationUnavailable: "The security check is temporarily unavailable. Please try again later.",
    submissionInvalid: "Your details could not be validated. Please review the form and send again.",
    submissionFailed: "Your details could not be sent. Please try again.",
    eventTitle: "Everything is possible when we come together.",
    eventBody: "Official dates for upcoming public meetings and the employment fair will appear here once confirmed.",
    eventStatus: "Updates coming soon",
    eventName: "Dharashiv public dialogue programme",
    eventSub: "Official date, venue and registration details will be shared here.",
    eventDate: "Date to be announced",
    eventsContact: "Get in touch",
    contactTitle: "Your Call, Our Commitment.",
    contactBody:
      "Raise a local issue or ask a question. Fill in the form to send us your message.",
    grievanceTitle: "Tell us your concern",
    grievanceSubtitle: "Describe what you need help with.",
    concernName: "Your name",
    concernPhoneHint: "Enter a 10-digit Indian number or an international number with country code.",
    topic: "What is the concern about?",
    topicPlaceholder: "Select a topic",
    topics: ["Roads & infrastructure", "Water & agriculture", "Public services", "Employment", "Other"],
    message: "Your message",
    sendMessage: "Send message",
    grievanceDisclaimer: "Your message will be sent securely.",
    grievanceSuccess: "Message submitted successfully",
    grievanceSuccessNote: "Our system has received your message.",
    facebook: "Facebook",
    socialConnectHint: "Connect",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    socialTitle: "Connect with us.",
    socialIntro: "Follow our updates and stay connected with the community.",
    socialLink: "Find us on social media",
    socialNote:
      "These links open the respective social media pages or channel.",
    footerLine: "In service. Together. Towards progress.",
    footerLabel: "Public service website concept · Dharashiv, Maharashtra",
    top: "Back to top",
  },
  hi: {
    nav: ["परिचय", "जनकार्य", "रोज़गार", "कार्यक्रम", "शिकायतें", "कनेक्ट"],
    heroTitle: "समस्याएँ अनेक, समाधान एक… आपका अपना ओमराजे!",
    explore: "कार्य देखें",
    contact: "संपर्क करें",
    principles: ["पहले सुनना", "मिलकर काम करना", "आगे बढ़ना"],
    aboutTitle: "धाराशिव... मेरी साँस, मेरा जुनून!",
    aboutLead: "अपना जीवन, धाराशिव।",
    aboutBody:
      "यह मेरे लिए केवल एक नारा नहीं, बल्कि मेरी राजनीति का सार है। आज मैं जहाँ हूँ और जो कुछ भी हूँ, वह धाराशिव के लोगों के प्रेम और विश्वास के कारण है—इस बात का मुझे हमेशा एहसास रहता है। इसलिए मैं धाराशिव और यहाँ के लोगों के लिए हर संभव प्रयास करता हूँ। धाराशिव से मेरा रिश्ता केवल राजनीति का नहीं, बल्कि यहाँ की मिट्टी और लोगों से आत्मीयता का है।",
    timeline: "जनसेवा का सफर",
    years: [
      ["२००९", "महाराष्ट्र विधानसभा विधायक के रूप में निर्वाचित"],
      ["२०१९", "धाराशिव से १७वीं लोकसभा के लिए निर्वाचित।"],
      ["२०२४", "धाराशिव से १८वीं लोकसभा के लिए पुनः निर्वाचित।"],
    ],
    workTitle: "साथ चलें, उज्ज्वल भविष्य बनाएँ!",
    workBody: "मेरा दृढ़ विश्वास है कि सामूहिक प्रयास और टीमवर्क से ही हर कार्य सफल होता है। इसी सोच के साथ मैं निरंतर कार्यरत हूँ। आइए, हम सब मिलकर आगे बढ़ें और अपने लोगों का उज्ज्वल भविष्य बनाएँ।",
    workCards: [
      ["लोगों के बीच", "निर्वाचन क्षेत्र के लोगों से संवाद और स्थानीय मुद्दों को समझना।", "जनभागीदारी"],
      ["जनता के मुद्दे", "समस्याएँ सामने रखने और अगला सही कदम जानने का मंच।", "नागरिक सहायता"],
      ["सबके लिए अवसर", "युवाओं तक रोज़गार और करियर के अवसरों की जानकारी पहुँचाना।", "रोज़गार"],
    ],
    galleryTitle: "जनता के दिल में, जनता के साथ",
    galleryNote: "जनता के बीच के कुछ पल",
    imageCaptions: ["जहाँ ज़रूरत, वहीं संवाद।", "सेवा के लिए हमेशा तत्पर।", "समुदाय के साथ संवाद।"],
    fieldTitle: "अपनी मिट्टी, अपने लोग",
    fieldParagraphs: [
      "धाराशिव की मिट्टी में अपनापन और आत्मीयता की एक अनोखी खुशबू है। इस मिट्टी और यहाँ के लोगों ने मुझे हमेशा भरपूर प्यार, विश्वास और आशीर्वाद दिया है।",
      "इसी प्यार और विश्वास ने मुझे जनसेवा के लिए निरंतर प्रेरित किया है। इसलिए अपनी मिट्टी और अपने लोगों के लिए जो भी संभव है, उसे करने के लिए मैं हमेशा प्रयासरत रहा हूँ और आगे भी रहूँगा।",
      "इस मिट्टी और यहाँ के हर व्यक्ति के प्रति मैं हमेशा ऋणी रहा हूँ और जीवनभर रहूँगा।",
      "अपनी मिट्टी, अपने लोग — यही मेरी ताकत, यही मेरी प्रेरणा और यही मेरी पहचान है।",
    ],
    initiativeTitle: "सपनों को अवसर, भविष्य की दिशा।",
    initiativeBody:
      "धाराशिव में नौकरी चाहने वालों और नियोक्ताओं के लिए प्रस्तावित रोज़गार मेले का पंजीकरण। तारीख़ और भागीदारी की जानकारी आधिकारिक पुष्टि के बाद साझा की जाएगी।",
    register: "अपनी रुचि दर्ज करें",
    formTitle: "अपना अगला कदम बढ़ाएँ",
    formSubtitle: "उम्मीदवारों और नियोक्ताओं के लिए",
    name: "पूरा नाम",
    phone: "मोबाइल नंबर",
    email: "ईमेल पता (वैकल्पिक)",
    role: "मैं हूँ…",
    candidate: "नौकरी तलाशने वाला / वाली",
    employer: "नियोक्ता",
    town: "तहसील / शहर",
    choose: "एक विकल्प चुनें",
    submitInterest: "रुचि दर्ज करें",
    formDisclaimer: "आपकी जानकारी सुरक्षित रूप से भेजी जाएगी।",
    formSuccess: "रुचि सफलतापूर्वक सबमिट हुई",
    formSuccessNote: "हमारे सिस्टम ने आपकी जानकारी स्वीकार कर ली है।",
    consent: "मैं अपनी जानकारी भेजे जाने और संपर्क के लिए उपयोग किए जाने की सहमति देता/देती हूँ।",
    resumeFile: "रिज़्यूमे फ़ाइल (वैकल्पिक)",
    resumeFileHint: "PDF, DOC या DOCX — अधिकतम 10 MB",
    invalidResumeFile: "कृपया 10 MB तक की PDF, DOC या DOCX फ़ाइल चुनें।",
    submitting: "भेजा जा रहा है…",
    securityLoading: "सुरक्षा जाँच लोड हो रही है…",
    securityUnavailable: "सुरक्षा जाँच उपलब्ध नहीं है। कृपया कुछ देर बाद फिर प्रयास करें।",
    turnstileFailed: "सुरक्षा जाँच पूरी नहीं हुई। कृपया फिर से कोशिश करें।",
    verificationFailed: "सुरक्षा जाँच विफल हुई। कृपया फिर से कोशिश करें।",
    verificationUnavailable: "सुरक्षा जाँच अस्थायी रूप से उपलब्ध नहीं है। कृपया बाद में फिर प्रयास करें।",
    submissionInvalid: "जानकारी जाँची नहीं जा सकी। कृपया फ़ॉर्म देखकर फिर भेजें।",
    submissionFailed: "जानकारी भेजी नहीं जा सकी। कृपया फिर से कोशिश करें।",
    eventTitle: "मिलकर करें तो हर काम बेहतर होता है।",
    eventBody: "आगामी जनसभाओं और रोज़गार मेले की तारीख़ें पुष्टि के बाद यहाँ दी जाएँगी।",
    eventStatus: "जानकारी जल्द आएगी",
    eventName: "धाराशिव जनसंवाद कार्यक्रम",
    eventSub: "पुष्ट तारीख़, स्थान और पंजीकरण की जानकारी यहाँ साझा की जाएगी।",
    eventDate: "तारीख़ घोषित होना बाकी",
    eventsContact: "संपर्क करें",
    contactTitle: "आपकी पुकार, हमारा साथ।",
    contactBody:
      "स्थानीय समस्या बताएँ या सवाल पूछें। अपना संदेश हमें भेजने के लिए फ़ॉर्म भरें।",
    grievanceTitle: "अपनी समस्या बताएँ",
    grievanceSubtitle: "बताएँ कि आपको किस मदद की ज़रूरत है।",
    concernName: "आपका नाम",
    concernPhoneHint: "10 अंकों का भारतीय नंबर या देश कोड के साथ अंतरराष्ट्रीय नंबर दर्ज करें।",
    topic: "समस्या किस बारे में है?",
    topicPlaceholder: "विषय चुनें",
    topics: ["सड़कें और बुनियादी सुविधाएँ", "पानी और कृषि", "जनसेवाएँ", "रोज़गार", "अन्य"],
    message: "आपका संदेश",
    sendMessage: "संदेश भेजें",
    grievanceDisclaimer: "आपका संदेश सुरक्षित रूप से भेजा जाएगा।",
    grievanceSuccess: "संदेश सफलतापूर्वक सबमिट हुआ",
    grievanceSuccessNote: "हमारे सिस्टम ने आपका संदेश स्वीकार कर लिया है।",
    facebook: "फ़ेसबुक",
    socialConnectHint: "जुड़ें",
    whatsapp: "व्हाट्सऐप",
    instagram: "इंस्टाग्राम",
    socialTitle: "हमसे जुड़ें।",
    socialIntro: "हमारी जानकारी पाएँ और समुदाय से जुड़े रहें।",
    socialLink: "सोशल मीडिया पर हमसे जुड़ें",
    socialNote:
      "ये लिंक संबंधित सोशल मीडिया पेज या चैनल खोलते हैं।",
    footerLine: "सेवा में। साथ में। प्रगति की ओर।",
    footerLabel: "जनसेवा वेबसाइट की संकल्पना · धाराशिव, महाराष्ट्र",
    top: "ऊपर जाएँ",
  },
  mr: {
    nav: ["परिचय", "जनसेवा", "रोजगार", "कार्यक्रम", "तक्रारी", "कनेक्ट"],
    heroTitle: "अडचणी अनेक, उपाय एक… तुमचा ओमराजे!",
    explore: "कार्य जाणून घ्या",
    contact: "संपर्क साधा",
    principles: ["आधी ऐकून घेऊ", "एकत्र काम करू", "पुढे वाटचाल करू"],
    aboutTitle: "धाराशिव... माझा श्वास, माझा ध्यास!",
    aboutLead: "आपला जीव, धाराशिव.",
    aboutBody:
      "हे माझ्यासाठी केवळ घोषवाक्य नव्हे तर एकूणच माझ्या राजकारणाचा अर्थ या घोषणेत येतो. जीवनात आज जिथे आहे, जे आहे ते केवळ धाराशिवकरांच्या प्रेमामुळे, विश्र्वासामुळे ही जाणीव कायमच मनात आहे त्यामुळे धाराशिव आणि धाराशिवच्या जनतेसाठी यथाशक्ती शक्य ते करण्याचा माझा प्रयत्न असतो. धाराशिवशी नातं केवळ राजकारणाचं नाही, तर मातीशी आणि माणसांशी जोडलेल्या जिव्हाळ्याचं आहे.",
    timeline: "प्रवास जनसेवेचा",
    years: [
      ["२००९", "महाराष्ट्र विधानसभेचे आमदार म्हणून निवड"],
      ["२०१९", "धाराशिव मतदारसंघातून १७व्या लोकसभेवर निवड."],
      ["२०२४", "धाराशिव मतदारसंघातून १८व्या लोकसभेवर पुन्हा निवड."],
    ],
    workTitle: "एकत्र चालूया, उज्ज्वल भविष्य घडवूया!",
    workBody: "माझा ठाम विश्वास आहे की कोणतेही कार्य हे एकट्याने नव्हे, तर टीमवर्क आणि सामूहिक प्रयत्नांतून यशस्वी होत असते. याच विचाराने मी सदैव कार्यरत आहे. चला, आपण सर्वजण एकत्र येऊन, एकजुटीने वाटचाल करूया आणि आपल्या जनतेचे उज्ज्वल भविष्य घडवूया.",
    workCards: [
      ["जनतेत राहून", "मतदारसंघातील नागरिकांशी संवाद साधणे आणि स्थानिक प्रश्न समजून घेणे.", "लोकसहभाग"],
      ["जनतेचे प्रश्न", "आपली अडचण मांडण्यासाठी आणि पुढचे योग्य पाऊल जाणून घेण्यासाठी व्यासपीठ.", "नागरिक मदत"],
      ["सर्वांसाठी संधी", "रोजगार आणि करिअरच्या संधींची माहिती युवकांपर्यंत पोहोचवणे.", "रोजगार"],
    ],
    galleryTitle: "जनतेच्या मनात, जनतेच्या सोबत.",
    galleryNote: "कार्य क्षेत्रातील काही क्षण",
    imageCaptions: ["जिथे गरज, तिथे संवाद.", "सेवेसाठी सदैव तत्पर.", "समुदायाशी संवाद."],
    fieldTitle: "आपली माती, आपली माणसं.",
    fieldParagraphs: [
      "धाराशिवच्या मातीमध्ये एक वेगळाच आपुलकीचा ओलावा आहे. या मातीने आणि इथल्या माणसांनी मला कायम भरभरून प्रेम, विश्वास आणि आशीर्वाद दिले आहेत.",
      "या प्रेमाने आणि विश्वासानेच मला जनसेवेची प्रेरणा दिली आहे. त्यामुळे आपल्या मातीसाठी, आपल्या माणसांसाठी जे जे शक्य आहे, ते करण्यासाठी मी सदैव प्रयत्नशील राहिलो आहे आणि यापुढेही राहीन.",
      "या मातीचे आणि इथल्या प्रत्येक माणसाचे ऋण मी कायम मानत आलो आहे आणि आयुष्यभर मानत राहीन.",
      "आपली माती, आपली माणसं — हेच माझं बळ, हीच माझी प्रेरणा आणि हीच माझी ओळख.",
    ],
    initiativeTitle: "स्वप्नांना संधी, भविष्याची दिशा.",
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
    formDisclaimer: "तुमची माहिती सुरक्षितपणे पाठवली जाईल.",
    formSuccess: "आवड यशस्वीपणे सबमिट झाली",
    formSuccessNote: "आमच्या प्रणालीने तुमची माहिती स्वीकारली आहे.",
    consent: "माझी माहिती पाठवून संपर्कासाठी वापरण्यास मी संमती देतो/देते.",
    resumeFile: "रेझ्युमे फाइल (ऐच्छिक)",
    resumeFileHint: "PDF, DOC किंवा DOCX — कमाल 10 MB",
    invalidResumeFile: "कृपया 10 MB पर्यंतची PDF, DOC किंवा DOCX फाइल निवडा.",
    submitting: "पाठवत आहे…",
    securityLoading: "सुरक्षा तपासणी लोड होत आहे…",
    securityUnavailable: "सुरक्षा तपासणी उपलब्ध नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.",
    turnstileFailed: "सुरक्षा तपासणी पूर्ण झाली नाही. कृपया पुन्हा प्रयत्न करा.",
    verificationFailed: "सुरक्षा तपासणी अयशस्वी झाली. कृपया पुन्हा प्रयत्न करा.",
    verificationUnavailable: "सुरक्षा तपासणी तात्पुरती उपलब्ध नाही. कृपया नंतर पुन्हा प्रयत्न करा.",
    submissionInvalid: "माहिती तपासता आली नाही. कृपया फॉर्म पाहून पुन्हा पाठवा.",
    submissionFailed: "माहिती पाठवता आली नाही. कृपया पुन्हा प्रयत्न करा.",
    eventTitle: "एकत्र आलो, तर प्रत्येक गोष्ट शक्य.",
    eventBody: "आगामी जनसंवाद व रोजगार मेळाव्याच्या अधिकृत तारखा निश्चित झाल्यावर येथे दिल्या जातील.",
    eventStatus: "अद्ययावत माहिती लवकरच",
    eventName: "धाराशिव जनसंवाद कार्यक्रम",
    eventSub: "अधिकृत तारीख, ठिकाण आणि नोंदणीची माहिती येथे दिली जाईल.",
    eventDate: "तारीख जाहीर होणे बाकी",
    eventsContact: "संपर्क साधा",
    contactTitle: "हाक तुमची, साथ आमची.",
    contactBody:
      "स्थानिक प्रश्न मांडा किंवा माहिती विचारा. तुमचा संदेश आम्हाला पाठवण्यासाठी फॉर्म भरा.",
    grievanceTitle: "तुमची अडचण सांगा",
    grievanceSubtitle: "कशाबाबत मदत हवी आहे ते लिहा.",
    concernName: "तुमचे नाव",
    concernPhoneHint: "१० अंकी भारतीय क्रमांक किंवा देश कोडसह आंतरराष्ट्रीय क्रमांक लिहा.",
    topic: "अडचणीचा विषय",
    topicPlaceholder: "विषय निवडा",
    topics: ["रस्ते व पायाभूत सुविधा", "पाणी व शेती", "सार्वजनिक सेवा", "रोजगार", "इतर"],
    message: "तुमचा संदेश",
    sendMessage: "संदेश पाठवा",
    grievanceDisclaimer: "तुमचा संदेश सुरक्षितपणे पाठवला जाईल.",
    grievanceSuccess: "संदेश यशस्वीपणे सबमिट झाला",
    grievanceSuccessNote: "आमच्या प्रणालीने तुमचा संदेश स्वीकारला आहे.",
    facebook: "फेसबुक",
    socialConnectHint: "जुडा",
    whatsapp: "व्हॉट्सॲप",
    instagram: "इन्स्टाग्राम",
    socialTitle: "आमच्याशी जोडलेले राहा.",
    socialIntro: "आमच्या घडामोडी जाणून घ्या आणि समुदायाशी जोडलेले राहा.",
    socialLink: "समाजमाध्यमांवर आमच्याशी जोडा",
    socialNote:
      "या लिंक्स संबंधित समाजमाध्यम पृष्ठे किंवा चॅनेल उघडतात.",
    footerLine: "सेवेत. सोबतीने. प्रगतीकडे.",
    footerLabel: "लोकसेवा संकेतस्थळाची संकल्पना · धाराशिव, महाराष्ट्र",
    top: "सुरुवातीला जा",
  },
} as const;

const navigationIds = ["about", "work", "careers", "events", "contact", "social"];
const showCalendarSection = false;
const showPrinciples = false;
const showFocusAreas = false;
const coverSlides = [heroBannerTitle, heroBanner1, heroBanner2, heroBanner3, heroBanner4];
const fieldWall = [
  { src: nightRally, en: "Evening public gathering", hi: "शाम की जनसभा", mr: "सायंकाळची जाहीर सभा" },
  { src: fCitizen, en: "Listening to residents", hi: "नागरिकों की बात सुनते हुए", mr: "नागरिकांशी संवाद" },
  { src: fTribute, en: "Tribute to Chhatrapati Shivaji Maharaj", hi: "छत्रपति शिवाजी महाराज को अभिवादन", mr: "छत्रपती शिवाजी महाराजांना अभिवादन" },
  { src: nightSpeech, en: "Voice of Dharashiv", hi: "धाराशिव की आवाज़", mr: "धाराशिवचा आवाज" },
  { src: omdada01, en: "A conversation with the press", hi: "पत्रकारों से बातचीत", mr: "माध्यमांशी संवाद" },
  { src: omdada02, en: "Among residents", hi: "लोगों के बीच", mr: "नागरिकांमध्ये" },
  { src: omdada04, en: "Listening, even in the rain", hi: "बारिश में लोगों की बात सुनते हुए", mr: "पावसातही नागरिकांचे म्हणणे ऐकताना" },
  { src: omdada05, en: "A conversation in the fields", hi: "खेतों के बीच संवाद", mr: "शेतात संवाद" },
  { src: omdada06, en: "Sharing a meal", hi: "साथ बैठकर भोजन", mr: "एकत्र भोजन" },
  { src: omdada08, en: "Addressing a gathering", hi: "सभा को संबोधित करते हुए", mr: "सभेला संबोधित करताना" },
];
const pictures = [omdada03, omdada07, omdada09];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ओम राजे निंबाळकर | धाराशिव जनसेवा" },
      {
        name: "description",
        content:
          "धाराशिव में जनकार्य, स्थानीय अवसरों और अपनी बात साझा करने के तरीकों की जानकारी। मराठी, हिंदी और अंग्रेज़ी में उपलब्ध।",
      },
      { property: "og:title", content: "ओम राजे निंबाळकर | धाराशिव जनसेवा" },
      {
        property: "og:description",
        content:
          "धाराशिव में जनकार्य, स्थानीय अवसरों और अपनी बात साझा करने के तरीकों की जानकारी। मराठी, हिंदी और अंग्रेज़ी में उपलब्ध।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

export function HomePage() {
  const [language, setLanguage] = useState<Language>("mr");
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [interestResult, setInterestResult] = useState<{
    id: string;
    confirmationUnconfirmed: boolean;
    resumeUnconfirmed: boolean;
  } | null>(null);
  const [messageSent, setMessageSent] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [interestError, setInterestError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"interest" | "message" | null>(null);
  const [interestTurnstileStatus, setInterestTurnstileStatus] = useState<TurnstileStatus>("loading");
  const [messageTurnstileStatus, setMessageTurnstileStatus] = useState<TurnstileStatus>("loading");
  const interestTurnstileRef = useRef<TurnstileWidgetHandle>(null);
  const messageTurnstileRef = useRef<TurnstileWidgetHandle>(null);
  const submissionInFlight = useRef(false);
  const t = content[language];
  const tr = (en: string, mr: string, hi: string) =>
    language === "en" ? en : language === "mr" ? mr : hi;
  const slides = coverSlides;

  const onInterestTurnstileStatusChange = useCallback(
    (status: TurnstileStatus) => setInterestTurnstileStatus(status),
    [],
  );
  const onMessageTurnstileStatusChange = useCallback(
    (status: TurnstileStatus) => setMessageTurnstileStatus(status),
    [],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((index) => (index + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const updateHeaderVisibility = () => setHeaderVisible(window.scrollY > 24);
    updateHeaderVisibility();
    window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateHeaderVisibility);
  }, []);



  function closeMenu() {
    setMenuOpen(false);
  }

  type FormSubmission =
    | { kind: "interest"; payload: CandidatePayload; file?: File }
    | { kind: "message"; payload: GrievancePayload };

  function isCandidateRole(value: string): value is CandidateRole {
    return value === "job_seeker" || value === "employer";
  }

  function isGrievanceTopic(value: string): value is (typeof grievanceTopics)[number] {
    return grievanceTopics.some((topic) => topic === value);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>, kind: "interest" | "message") {
    event.preventDefault();
    if (submissionInFlight.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const turnstile =
      kind === "interest" ? interestTurnstileRef.current : messageTurnstileRef.current;
    const turnstileStatus =
      kind === "interest" ? interestTurnstileStatus : messageTurnstileStatus;
    const setError = kind === "interest" ? setInterestError : setMessageError;
    const setSent = kind === "interest" ? setInterestSent : setMessageSent;
    const turnstileUnavailableMessage = t.securityUnavailable;

    if (turnstileStatus !== "ready" || !turnstile) {
      setError(turnstileUnavailableMessage);
      return;
    }

    let submission: FormSubmission;
    if (kind === "interest") {
      const selectedFile = data.get("file");
      if (selectedFile instanceof File && selectedFile.name) {
        const validExtension = /\.(pdf|doc|docx)$/i.test(selectedFile.name);
        if (
          selectedFile.size === 0 ||
          selectedFile.size > 10 * 1024 * 1024 ||
          !validExtension
        ) {
          setInterestError(t.invalidResumeFile);
          return;
        }
      }
      const role = String(data.get("role") ?? "");
      if (!isCandidateRole(role)) {
        setInterestError(t.submissionInvalid);
        return;
      }
      const file =
        selectedFile instanceof File && selectedFile.name ? selectedFile : undefined;
      submission = {
        kind,
        payload: {
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          email: String(data.get("email") ?? ""),
          role,
          town: String(data.get("town") ?? ""),
          consent: data.get("consent") === "on",
        },
        ...(file ? { file } : {}),
      };
    } else {
      const topic = String(data.get("topic") ?? "");
      if (!isGrievanceTopic(topic)) {
        setMessageError(t.submissionInvalid);
        return;
      }
      submission = {
        kind,
        payload: {
          name: String(data.get("concern-name") ?? ""),
          phone: String(data.get("concern-phone") ?? ""),
          email: String(data.get("concern-email") ?? ""),
          topic,
          message: String(data.get("message") ?? ""),
          consent: data.get("consent") === "on",
        },
      };
    }

    submissionInFlight.current = true;
    setSubmitting(kind);
    setError(null);
    setSent(false);
    if (kind === "interest") setInterestResult(null);

    try {
      const token = await turnstile.execute();
      if (submission.kind === "interest") {
        const result = await submitResume(submission.payload, token, submission.file);
        setInterestResult({
          id: result.id,
          confirmationUnconfirmed: result.emailStatus !== "sent",
          resumeUnconfirmed: !!submission.file && result.resumeEmailStatus !== "sent",
        });
        setInterestSent(true);
      } else {
        await submitGrievance(submission.payload, token);
        setMessageSent(true);
      }
      form.reset();
    } catch (error) {
      let errorMessage: string = t.submissionFailed;
      if (error instanceof TurnstileWidgetError) {
        errorMessage = error.code
          ? `${t.turnstileFailed} (Cloudflare code: ${error.code})`
          : t.turnstileFailed;
      } else if (error instanceof SubmissionApiError) {
        if (error.status === 400) errorMessage = t.submissionInvalid;
        else if (error.status === 403) errorMessage = t.verificationFailed;
        else if (error.status === 503) errorMessage = t.verificationUnavailable;
      }
      setError(errorMessage);
    } finally {
      turnstile.reset();
      submissionInFlight.current = false;
      setSubmitting(null);
    }
  }

  return (
    <main className="site site-marathi" lang={language}>
      <section className="landing-cover">
        <img
          className="landing-cover-image"
          src={landingCover}
          alt="ओमराजे यांच्या सार्वजनिक कामाची झलक — अडचणी अनेक, उपाय एक!"
          fetchPriority="high"
        />
      </section>

      <header className={`site-header floating-header${headerVisible ? " is-visible" : ""}`}>
        <a
          className="brand brand-wordmark brand-wordmark-mr"
          href="#home"
          aria-label={tr("OmRaje Nimbalkar, home", "ओमराजे निंबाळकर, मुख्यपृष्ठ", "ओमराजे निंबालकर, मुख्यपृष्ठ")}
          onClick={closeMenu}
        >
          <BrandWordmark language={language} />
        </a>
        <nav id="main-navigation" className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label={tr("Main navigation", "मुख्य नेव्हिगेशन", "मुख्य नेविगेशन")}>
          {t.nav.map((item, index) => {
            const sectionId = navigationIds[index];
            if (sectionId === "events" && !showCalendarSection) return null;
            if (sectionId === "careers") {
              return (
                <a key={sectionId} href="#careers" onClick={closeMenu}>
                  {item}
                </a>
              );
            }
            return (
              <a key={sectionId} href={`#${sectionId}`} onClick={closeMenu}>
                {item}
              </a>
            );
          })}
          <Link className="home-video-link" to="/videos" onClick={closeMenu}>{tr("Media", "मीडिया", "मीडिया")}</Link>
        </nav>
        <div className="header-tools">
                    <LanguageSwitch language={language} onChange={setLanguage} />
          <button
            className="menu-switch"
            type="button"
            aria-controls="main-navigation"
                      aria-label={menuOpen ? tr("Close navigation", "नेव्हिगेशन बंद करा", "नेविगेशन बंद करें") : tr("Open navigation", "नेव्हिगेशन उघडा", "नेविगेशन खोलें")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero" id="home" aria-label={t.heroTitle}>
        {slides.map((src, index) => (
          <img
            key={src}
            className={`hero-image ${index === slide ? "is-active" : index === (slide - 1 + slides.length) % slides.length ? "is-prev" : ""}`}
            src={src}
            alt={index === slide ? tr("Om Raje interacting with citizens in Dharashiv", "ओम राजे धाराशिवमधील नागरिकांशी संवाद साधताना", "ओम राजे धाराशिव के नागरिकों से संवाद करते हुए") : ""}
            aria-hidden={index === slide ? undefined : true}
          />
        ))}
        <div className="hero-copy">
          <h1>{t.heroTitle}</h1>
        </div>
        <div className="hero-footnote"><span className="hero-live-dot" />        {tr("Always among the people", "सदैव जनतेत", "हमेशा जनता के बीच")}</div>
                <div className="hero-controls" aria-label={tr("Selected photos", "निवडक छायाचित्रे", "चुनिंदा तस्वीरें")}>
          <div className="hero-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={index === slide ? "hero-dot is-active" : "hero-dot"}
                aria-label={tr("Photo ", "छायाचित्र ", "तस्वीर ") + (index + 1)}
                aria-current={index === slide}
                onClick={() => setSlide(index)}
              />
            ))}
          </div>
          <span>{String(slide + 1).padStart(2, "0")} <i>/</i> {String(slides.length).padStart(2, "0")}</span>
        </div>
      </section>

      {showPrinciples && <div className="principle-strip" aria-label={tr("Our values", "आपली मूल्ये", "हमारे मूल्य")}>
        {t.principles.map((principle, index) => (
          <div className="principle" key={principle}><span>0{index + 1}</span><strong>{principle}</strong></div>
        ))}
      </div>}

      {showFocusAreas && <div className="impact-band"       aria-label={tr("Focus areas", "प्राधान्य क्षेत्रे", "प्रमुख क्षेत्र")}>
              {(language === "en"
                ? [["Farmers", "Water, crops and rural support"], ["Youth", "Employment and skills fairs"], ["Families", "Health and welfare schemes"], ["Villages", "Roads and local works"]]
                : language === "hi"
          ? [["किसान", "पानी, फसल और ग्रामीण सहायता"], ["युवा", "रोज़गार और कौशल मेले"], ["परिवार", "स्वास्थ्य और कल्याण योजनाएँ"], ["गाँव", "सड़कें और स्थानीय कार्य"]]
          : [["शेतकरी", "पाणी, पीक व ग्रामीण मदत"], ["युवा", "रोजगार व कौशल्य मेळावे"], ["कुटुंबे", "आरोग्य व कल्याण योजना"], ["गावे", "रस्ते व स्थानिक कामे"]]
        ).map(([title, body], index) => {
          const focus = [
            { image: focusFarmers, icon: <Wheat aria-hidden="true" /> },
            { image: focusYouth, icon: <GraduationCap aria-hidden="true" /> },
            { image: focusFamilies, icon: <House aria-hidden="true" /> },
            { image: focusVillages, icon: <MapPinned aria-hidden="true" /> },
          ][index] ?? { image: focusFarmers, icon: <Wheat aria-hidden="true" /> };
          return (
            <div className="impact-item" key={title}>
              <img className="impact-bg" src={focus.image} alt="" aria-hidden="true" />
              <span className="impact-icon">{focus.icon}</span>
              <strong>{title}</strong>
              <span>{body}</span>
            </div>
          );
        })}
      </div>}

      <section className="content-section about-section" id="about">
        <div className="about-grid">
          <figure className="portrait-frame">
            <img src={portrait} alt={tr("Portrait of Om Raje Nimbalkar", "ओम राजे निंबाळकर यांचे छायाचित्र", "ओम राजे निंबालकर का चित्र")} />
                        <figcaption><span>{tr("Dharashiv, Maharashtra", "धाराशिव, महाराष्ट्र", "धाराशिव, महाराष्ट्र")}</span><span>·</span><span>{tr("For the people", "जनतेसाठी", "जनता के लिए")}</span></figcaption>
          </figure>
          <div className="about-copy">
            <h2>{t.aboutTitle}</h2>
            <p className="about-description"><strong>{t.aboutLead}</strong>{" "}{t.aboutBody}</p>
            <a className="section-link" href="#timeline">{t.timeline}<ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
        <div className="timeline" id="timeline">
          <div className="timeline-label">
            <h3>{t.timeline}</h3>
          </div>
          <ol className="timeline-list">
            {t.years.map(([year, detail]) => (
              <li className="timeline-item" key={year}>
                <span className="timeline-marker" aria-hidden="true" />
                <strong>{year}</strong>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="work-section content-section" id="work">
        <div className="work-heading"><h2>{t.workTitle}</h2><p>{t.workBody}</p></div>
        <PostShowcase language={language} />
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="gallery-heading">
          <h2 id="gallery-title">{t.galleryTitle}</h2>
          <p>{t.galleryNote}<ArrowDownRight aria-hidden="true" /></p>
        </div>
        <div className="photo-gallery">
          {pictures.map((picture, index) => (
            <figure className={`gallery-photo gallery-photo-${index + 1}`} key={picture}>
              <img src={picture} alt={t.imageCaptions[index]} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      <section className="field-wall" aria-labelledby="field-wall-title">
        <div className="field-wall-card">
          <div className="field-wall-head">
            <h2 id="field-wall-title">{t.fieldTitle}</h2>
            <p className="field-wall-copy">{t.fieldParagraphs.join(" ")}</p>
          </div>
          <div className="field-wall-grid">
            {fieldWall.map((item, index) => (
              <figure className={`field-tile field-tile-${index + 1}`} key={item.hi}>
                <img src={item.src} alt={item[language]} loading="lazy" />
                <figcaption>{item[language]}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="initiative-section content-section" id="careers">
        <div className="initiative-grid">
          <div className="initiative-copy">
            <h2>{t.initiativeTitle}</h2>
            <p>{t.initiativeBody}</p>
            <Button asChild variant="ink" size="large"><a href="#register">{t.register}<ArrowRight aria-hidden="true" /></a></Button>
            <span className="initiative-script" aria-hidden="true">{tr("Jobs", "रोजगार", "रोज़गार")}</span>
          </div>
          <div className="form-panel" id="register">
            <FormHeading eyebrow={tr("Career", "करिअर", "करियर")} title={t.formTitle} subtitle={t.formSubtitle} />
            <form
              className="preview-form"
              aria-busy={submitting === "interest"}
              onSubmit={(event) => submitForm(event, "interest")}
              onChange={() => {
                setInterestSent(false);
                setInterestResult(null);
                setInterestError(null);
              }}
            >
              <label>{t.name}<input autoComplete="name" name="name" required placeholder={t.name} /></label>
              <div className="form-row">
                <label>{t.phone}<input autoComplete="tel" name="phone" required type="tel" pattern="[0-9+() -]{10,16}" placeholder="+91" /></label>
                <label>{t.email}<input autoComplete="email" name="email" type="email" required placeholder="name@email.com" /></label>
              </div>
              <label>{t.role}<select name="role" required defaultValue=""><option value="" disabled>{t.choose}</option><option value="job_seeker">{t.candidate}</option><option value="employer">{t.employer}</option></select></label>
              <label>{t.town}<input autoComplete="address-level2" name="town" required placeholder={t.town} /></label>
              <label>
                {t.resumeFile}
                <input
                  name="file"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </label>
              <p className="form-note">{t.resumeFileHint}</p>
              <label className="form-consent"><input type="checkbox" name="consent" required /> {t.consent}</label>
              <TurnstileWidget ref={interestTurnstileRef} onStatusChange={onInterestTurnstileStatusChange} />
              {interestTurnstileStatus === "loading" && <p className="form-note" role="status">{t.securityLoading}</p>}
              {interestTurnstileStatus === "error" && <p className="form-note" role="alert">{t.securityUnavailable}</p>}
              <Button
                variant="saffron"
                size="large"
                className="form-submit"
                type="submit"
                disabled={submitting !== null}
              >
                {submitting === "interest" ? <><LoaderCircle className="animate-spin" aria-hidden="true" />{t.submitting}</> : <>{t.submitInterest}<ArrowUpRight aria-hidden="true" /></>}
              </Button>
              {interestSent && <p className="form-note" role="status"><strong>{t.formSuccess}.</strong> {t.formSuccessNote}</p>}
              {interestResult && (
                <p className="form-note">
                  {tr("Application ID", "अर्ज क्रमांक", "आवेदन क्रमांक")}: {interestResult.id}
                </p>
              )}
              {interestResult && (interestResult.resumeUnconfirmed || interestResult.confirmationUnconfirmed) && (
                <p className="form-note" role="alert">
                  {interestResult.resumeUnconfirmed && tr(
                    "Your application was saved, but delivery of your résumé to our team could not be confirmed. ",
                    "तुमचा अर्ज नोंदवला आहे, पण तुमचा रेझ्युमे आमच्या टीमला पोहोचल्याची खात्री करता आली नाही. ",
                    "आपका आवेदन दर्ज हो गया है, लेकिन आपका रिज़्यूमे हमारी टीम तक पहुँचने की पुष्टि नहीं हो सकी। ",
                  )}
                  {interestResult.confirmationUnconfirmed && tr(
                    "Your confirmation email could not be confirmed. ",
                    "पुष्टीकरण ईमेल पाठवल्याची खात्री करता आली नाही. ",
                    "पुष्टिकरण ईमेल भेजे जाने की पुष्टि नहीं हो सकी। ",
                  )}
                  {tr(
                    "Please do not resubmit; contact us with your application ID.",
                    "कृपया पुन्हा अर्ज करू नका; अर्ज क्रमांकासह आमच्याशी संपर्क साधा.",
                    "कृपया दोबारा आवेदन न करें; आवेदन क्रमांक के साथ हमसे संपर्क करें।",
                  )}
                </p>
              )}
              {interestError && <p className="form-note" role="alert">{interestError}</p>}
              <p className="form-note"><ShieldCheck aria-hidden="true" />{t.formDisclaimer}</p>
            </form>
          </div>
        </div>
      </section>

      {showCalendarSection && (
        <section className="events-section content-section" id="events">
          <div className="events-grid">
            <div className="events-copy"><h2>{t.eventTitle}</h2><p>{t.eventBody}</p><a className="section-link light-link" href="#contact">{t.eventsContact}<ArrowUpRight aria-hidden="true" /></a></div>
            <article className="event-panel">
              <div className="event-panel-top"><span className="event-symbol"><Sparkles aria-hidden="true" /></span><span className="event-status">{t.eventStatus}</span></div>
              <p className="event-placeholder">{tr("Yet to be announced", "जाहीर होणे बाकी", "घोषणा बाकी")}<span>२०२६</span></p>
              <h3>{t.eventName}</h3><p className="event-description">{t.eventSub}</p>
              <div className="event-date"><span><i />{t.eventDate}</span><ArrowUpRight aria-hidden="true" /></div>
            </article>
          </div>
        </section>
      )}

      <section className="contact-section content-section" id="contact">
        <div className="contact-grid">
          <div className="contact-intro">
            <h2>{t.contactTitle}</h2>
            <p>{t.contactBody}</p>
            <a className="section-link" href="#social">{t.socialLink}<ArrowRight aria-hidden="true" /></a>
          </div>
          <div className="form-panel grievance-panel">
            <FormHeading eyebrow={tr("Citizen help", "नागरिक मदत", "नागरिक सहायता")} title={t.grievanceTitle} subtitle={t.grievanceSubtitle} />
            <form
              className="preview-form"
              aria-busy={submitting === "message"}
              onSubmit={(event) => submitForm(event, "message")}
              onChange={() => {
                setMessageSent(false);
                setMessageError(null);
              }}
            >
              <label>{t.concernName}<input name="concern-name" autoComplete="name" required placeholder={t.concernName} /></label>
              <div className="form-row">
                <label>{t.phone}<input name="concern-phone" autoComplete="tel" type="tel" required pattern={"[0-9]{10}|\\+[0-9]{8,15}"} maxLength={16} aria-describedby="grievance-phone-hint" placeholder="+91" /></label>
                <label>{t.email}<input name="concern-email" autoComplete="email" type="email" maxLength={254} placeholder="name@email.com" /></label>
              </div>
              <p className="form-note" id="grievance-phone-hint">{t.concernPhoneHint}</p>
              <label>{t.topic}<select name="topic" required defaultValue=""><option value="" disabled>{t.topicPlaceholder}</option>{t.topics.map((topic, index) => <option key={grievanceTopics[index]} value={grievanceTopics[index]}>{topic}</option>)}</select></label>
              <label>{t.message}<textarea name="message" required minLength={5} maxLength={2000} placeholder={t.message} /></label>
              <label className="form-consent"><input type="checkbox" name="consent" required /> {t.consent}</label>
              <TurnstileWidget ref={messageTurnstileRef} onStatusChange={onMessageTurnstileStatusChange} />
              {messageTurnstileStatus === "loading" && <p className="form-note" role="status">{t.securityLoading}</p>}
              {messageTurnstileStatus === "error" && <p className="form-note" role="alert">{t.securityUnavailable}</p>}
              <Button
                variant="ink"
                size="large"
                className="form-submit"
                type="submit"
                disabled={submitting !== null}
              >
                {submitting === "message" ? <><LoaderCircle className="animate-spin" aria-hidden="true" />{t.submitting}</> : <>{t.sendMessage}<ArrowUpRight aria-hidden="true" /></>}
              </Button>
              {messageSent && <p className="form-note" role="status"><strong>{t.grievanceSuccess}.</strong> {t.grievanceSuccessNote}</p>}
              {messageError && <p className="form-note" role="alert">{messageError}</p>}
              <p className="form-note"><ShieldCheck aria-hidden="true" />{t.grievanceDisclaimer}</p>
            </form>
          </div>
        </div>
      </section>

      <section className="social-section content-section" id="social">
        <div className="social-heading"><h2>{t.socialTitle}</h2><p>{t.socialIntro}</p></div>
        <div className="social-list">
          <a href="https://www.facebook.com/omprakashrajenimbalkar" target="_blank" rel="noopener noreferrer" className="social-link">
            <span className="social-badge">f</span><span><strong>{t.facebook}</strong><small>{t.socialConnectHint}</small></span><ArrowUpRight aria-hidden="true" />
          </a>
          <a href="https://whatsapp.com/channel/0029Va5C0Iv5a2437j5qgV3X" target="_blank" rel="noreferrer" className="social-link">
            <span className="social-badge social-whatsapp"><MessageCircle aria-hidden="true" /></span><span><strong>{t.whatsapp}</strong><small>{t.socialConnectHint}</small></span><ArrowUpRight aria-hidden="true" />
          </a>
          <a href="https://www.instagram.com/mpomrajenimbalkar/" target="_blank" rel="noopener noreferrer" className="social-link">
            <span className="social-badge social-instagram">◎</span><span><strong>{t.instagram}</strong><small>{t.socialConnectHint}</small></span><ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <p className="social-disclaimer">{t.socialNote}</p>
      </section>

      <footer className="site-footer">
        <a
          className="brand brand-wordmark footer-brand brand-wordmark-mr"
          href="#home"
          aria-label={tr("OmRaje Nimbalkar, home", "ओमराजे निंबाळकर, मुख्यपृष्ठ", "ओमराजे निंबालकर, मुख्यपृष्ठ")}
        >
          <BrandWordmark language={language} />
        </a>
        <p className="footer-motto">{t.footerLine}</p>
        <p className="footer-label">{t.footerLabel}</p>
        <a className="back-top" href="#home">{t.top}<ArrowUpRight aria-hidden="true" /></a>
      </footer>
      <ThemeSwitcher language={language} />
    </main>
  );
}

function BrandWordmark({ language }: { language: Language }) {
  return (
    <span className="brand-wordmark-content" aria-hidden="true">
      <span className="brand-signature" lang={language}>
        {language === "en" ? "OmRaje" : "ओमराजे"}
      </span>
      <span className="brand-nameplate" lang={language}>
        <i />
        {language === "en" ? "Nimbalkar" : language === "mr" ? "निंबाळकर" : "निंबालकर"}
        <i />
      </span>
      <span className="brand-district" lang={language}>
        {language === "en" ? "Dharashiv · Maharashtra" : "धाराशिव · महाराष्ट्र"}
      </span>
    </span>
  );
}

function FormHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <div className="form-heading"><div><span className="form-eyebrow">{eyebrow}</span><h3>{title}</h3><p>{subtitle}</p></div><span className="form-icon"><HeartHandshake aria-hidden="true" /></span></div>;
}
