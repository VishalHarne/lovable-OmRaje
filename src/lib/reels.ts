
const base = import.meta.env.BASE_URL;

export const reelCategories = {
  all: { hi: 'सभी पल', mr: 'सर्व क्षण' },
  field: { hi: 'जनता के बीच', mr: 'प्रत्यक्ष जनतेत' },
  work: { hi: 'जनकार्य', mr: 'लोककार्य' },
  culture: { hi: 'संस्कृति और समुदाय', mr: 'संस्कृती व समाज' },
};
export type ReelCategory = keyof typeof reelCategories;
export const reels = [
  { id: 'DO1LoqWDfW5', cover: `${base}reels/DO1LoqWDfW5.jpg`, category: 'field', hi: 'बारिश से प्रभावित खेतों का दौरा', mr: 'अतिवृष्टीग्रस्त शेतीची पाहणी', description: { hi: 'भूम के साबळेवाड़ी में भारी बारिश के बाद खेतों का दौरा।', mr: 'साबळेवाडी, भूम — अतिवृष्टीनंतर शेतकऱ्यांच्या पिकांची पाहणी.' } },
  { id: 'DPd7X9GCd2A', cover: `${base}reels/DPd7X9GCd2A.jpg`, category: 'work', hi: 'विकास कार्यों की झलक', mr: 'विकासकामांचा आढावा', description: { hi: 'ओम राजे निंबालकर द्वारा साझा की गई जनकार्य की जानकारी।', mr: 'ओम राजे निंबाळकर यांनी शेअर केलेला लोककार्याचा आढावा.' } },
  { id: 'DScbK7RDfQ1', cover: `${base}reels/DScbK7RDfQ1.jpg`, category: 'culture', hi: 'अपनी परंपराओं से जुड़ाव', mr: 'आपल्या परंपरांशी नाळ', description: { hi: 'गोवर्धनवाड़ी के खेत में परिवार के साथ वेळ अमावस्या का उत्सव।', mr: 'गोवर्धनवाडी येथील शेतात कुटुंबासमवेत वेळ अमावस्या साजरी.' } },
  { id: 'DeUdiWVNutH', cover: `${base}reels/DeUdiWVNutH.jpg`, category: 'field', hi: 'किसानों की समस्याएँ आगे रखते हुए', mr: 'शेतकऱ्यांचे प्रश्न मांडताना', description: { hi: 'केंद्रीय आकलन दल के दौरे के दौरान सूखे की स्थिति पर चर्चा।', mr: 'केंद्रीय पाहणी पथकासमोर दुष्काळी परिस्थिती व शेतकऱ्यांच्या अडचणी मांडताना.' } },
  { id: 'Deo2FZ6yk7U', cover: `${base}reels/Deo2FZ6yk7U.jpg`, category: 'culture', hi: 'तुळजापुर की ओर दौड़', mr: 'तुळजापूरकडे धाव', description: { hi: 'मूल पोस्ट के अनुसार धाराशिव से तुळजापुर तक २१ किलोमीटर की दौड़।', mr: 'मूळ पोस्टमध्ये दिल्याप्रमाणे धाराशिव ते तुळजापूर २१ किलोमीटर धाव.' } },
  { id: 'DeVs_M0p8hl', cover: `${base}reels/DeVs_M0p8hl.jpg`, category: 'culture', hi: 'भक्ति का एक पल', mr: 'श्रद्धेचा क्षण', description: { hi: 'मराठवाड़ा के किसान परिवारों के लिए नवरात्रि की शुभकामनाएँ और प्रार्थना।', mr: 'नवरात्रोत्सवाच्या शुभेच्छा व मराठवाड्यातील शेतकरी कुटुंबांसाठी प्रार्थना.' } },
] as const;
export type Reel = (typeof reels)[number];
export function reelUrl(id: string) { return `https://www.instagram.com/mpomrajenimbalkar/reel/${id}/`; }