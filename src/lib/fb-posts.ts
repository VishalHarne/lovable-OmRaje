import p11 from "@/assets/om-raje/posts/fb-p1-1.jpg";
import p12 from "@/assets/om-raje/posts/fb-p1-2.jpg";
import p13 from "@/assets/om-raje/posts/fb-p1-3.jpg";
import p14 from "@/assets/om-raje/posts/fb-p1-4.jpg";
import p21 from "@/assets/om-raje/posts/fb-p2-1.jpg";
import p22 from "@/assets/om-raje/posts/fb-p2-2.jpg";
import p23 from "@/assets/om-raje/posts/fb-p2-3.jpg";
import p31 from "@/assets/om-raje/posts/fb-p3-1.jpg";
import p32 from "@/assets/om-raje/posts/fb-p3-2.jpg";
import p41 from "@/assets/om-raje/posts/fb-p4-1.jpg";
import p42 from "@/assets/om-raje/posts/fb-p4-2.jpg";
import p43 from "@/assets/om-raje/posts/fb-p4-3.jpg";

export type Lang = "en" | "mr";
type Bi = Record<Lang, string>;

export type FbPost = {
  id: string;
  photos: string[];
  tag: Bi;
  place: Bi;
  title: Bi;
  body: Bi;
  tags: string[];
  accent: string;
};

export const fbPosts: FbPost[] = [
  {
    id: "shetkari-samvad",
    photos: [p11, p12, p13, p14],
    tag: { en: "FARMERS", mr: "शेतकरी" },
    place: { en: "Jalkot, Dharashiv", mr: "जळकोट, धाराशिव" },
    title: { en: "Shetkari Samvad: listening to drought-hit farmers", mr: "शेतकरी संवाद: दुष्काळग्रस्तांशी थेट संवाद" },
    body: {
      en: "A direct dialogue with farmers of Jalkot and nearby villages on drought, farming challenges and their demands, with the promise to carry every concern to the administration and keep following up until it is resolved.",
      mr: "जळकोट व परिसरातील दुष्काळग्रस्त शेतकऱ्यांच्या समस्या, अडीअडचणी आणि अपेक्षा जाणून घेण्यासाठी ‘शेतकरी संवाद कार्यक्रम’ पार पडला. शेतकऱ्यांच्या प्रश्नांना वाचा फोडून ते शासन-प्रशासनापर्यंत पोहोचवण्याचा आणि सातत्याने पाठपुरावा करण्याचा निर्धार.",
    },
    tags: ["#शेतकरीसंवाद", "#जळकोट", "#मराठवाडा"],
    accent: "#f5a524",
  },
  {
    id: "janata-darbar",
    photos: [p21, p22, p23],
    tag: { en: "JANATA DARBAR", mr: "जनता दरबार" },
    place: { en: "Public Relations Office, Dharashiv", mr: "जनसंपर्क कार्यालय, धाराशिव" },
    title: { en: "Your problem is my personal responsibility", mr: "जनतेचे प्रश्न म्हणजे माझी वैयक्तिक जबाबदारी!" },
    body: {
      en: "Every complaint heard seriously and sensitively, departments contacted at once and many issues settled on the spot. The Janata Darbar exists to find a way out of trouble and stand up for citizens' rights.",
      mr: "आलेल्या प्रत्येक तक्रारीकडे गांभीर्याने आणि संवेदनशीलतेने पाहिलं. संबंधित विभागांशी त्वरित संपर्क साधत अनेक समस्यांवर जागेवरच तोडगा काढला. आपल्या प्रेमाला, विश्वासाला आणि पाठिंब्याला खंबीरपणे न्याय देईन हेच माझं वचन!",
    },
    tags: ["#जनता_दरबार", "#लोकसेवा", "#MissionDharashiv"],
    accent: "#ff6b35",
  },
  {
    id: "dasara-melava",
    photos: [p31, p32],
    tag: { en: "SHIV SENA", mr: "शिवसेना" },
    place: { en: "NESCO Centre, Goregaon, Mumbai", mr: "नेस्को सेंटर, गोरेगाव, मुंबई" },
    title: { en: "Shiv Sena's Diamond Jubilee Dasara Melava", mr: "शिवसेनेचा हिरक महोत्सवी दसरा मेळावा" },
    body: {
      en: "On Vijayadashami, Deputy CM Eknath Shinde addressed the Melava, pledging that every Shiv Sainik will walk to the farmers' fields with the saffron flag on the shoulder, and stand by farmers to the last drop of blood.",
      mr: "विजयादशमीच्या शुभदिनी उपमुख्यमंत्री एकनाथजी शिंदे यांनी संबोधित केले — भगवा खांद्यावर घेऊन प्रत्येक शिवसैनिक शेतकऱ्यांच्या बांधावर जाईल. ‘आम्ही भाषण देणारे नाही, तर शेतकऱ्यांची चूल पेटवणारे आहोत.’",
    },
    tags: ["#शिवसेना", "#दसरामेळावा", "#भगवा"],
    accent: "#ff8a1f",
  },
  {
    id: "hospital-inauguration",
    photos: [p41, p42, p43],
    tag: { en: "HEALTHCARE", mr: "आरोग्य" },
    place: { en: "Dharashiv", mr: "धाराशिव" },
    title: { en: "Deshmukh Multispeciality Hospital & Trauma Care opens", mr: "देशमुख मल्टिस्पेशालिटी हॉस्पिटल व ट्रॉमा केअर सेंटरचे उद्घाटन" },
    body: {
      en: "At the grand inauguration, best wishes to the directors, doctors and team. Modern medical facilities, quality healthcare and emergency treatment under one roof, a commendable step for the people of Dharashiv.",
      mr: "धाराशिव शहरासह परिसरातील नागरिकांना आधुनिक वैद्यकीय सुविधा, दर्जेदार आरोग्यसेवा आणि आपत्कालीन उपचार एकाच छताखाली उपलब्ध व्हावेत, या उद्देशाने सुरू झालेला उपक्रम निश्चितच कौतुकास्पद आहे.",
    },
    tags: ["#Dharashiv", "#Healthcare", "#TraumaCare"],
    accent: "#2dd4bf",
  },
];