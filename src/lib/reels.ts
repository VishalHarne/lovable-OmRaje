
export const reelCategories = {
  all: { en: 'All moments', mr: 'सर्व क्षण' },
  field: { en: 'In the field', mr: 'प्रत्यक्ष जनतेत' },
  work: { en: 'Public work', mr: 'लोककार्य' },
  culture: { en: 'Culture & community', mr: 'संस्कृती व समाज' },
};
export type ReelCategory = keyof typeof reelCategories;
export const reels = [
  { id: 'DO1LoqWDfW5', cover: '/reels/DO1LoqWDfW5.jpg', category: 'field', en: 'A visit to rain-affected farms', mr: 'अतिवृष्टीग्रस्त शेतीची पाहणी', description: { en: 'From Sablewadi, Bhoom — a field visit following heavy rainfall.', mr: 'साबळेवाडी, भूम — अतिवृष्टीनंतर शेतकऱ्यांच्या पिकांची पाहणी.' } },
  { id: 'DPd7X9GCd2A', cover: '/reels/DPd7X9GCd2A.jpg', category: 'work', en: 'Development, in focus', mr: 'विकासकामांचा आढावा', description: { en: 'A public-work update shared by Om Raje Nimbalkar.', mr: 'ओम राजे निंबाळकर यांनी शेअर केलेला लोककार्याचा आढावा.' } },
  { id: 'DScbK7RDfQ1', cover: '/reels/DScbK7RDfQ1.jpg', category: 'culture', en: 'Rooted in our traditions', mr: 'आपल्या परंपरांशी नाळ', description: { en: 'Celebrating Vel Amavasya with family at the farm in Govardhanwadi.', mr: 'गोवर्धनवाडी येथील शेतात कुटुंबासमवेत वेळ अमावस्या साजरी.' } },
  { id: 'DeUdiWVNutH', cover: '/reels/DeUdiWVNutH.jpg', category: 'field', en: 'Taking farmers’ concerns forward', mr: 'शेतकऱ्यांचे प्रश्न मांडताना', description: { en: 'Discussing drought conditions during the central assessment team’s visit.', mr: 'केंद्रीय पाहणी पथकासमोर दुष्काळी परिस्थिती व शेतकऱ्यांच्या अडचणी मांडताना.' } },
  { id: 'Deo2FZ6yk7U', cover: '/reels/Deo2FZ6yk7U.jpg', category: 'culture', en: 'The road to Tuljapur', mr: 'तुळजापूरकडे धाव', description: { en: 'A 21-kilometre run from Dharashiv to Tuljapur, as shared in the original post.', mr: 'मूळ पोस्टमध्ये दिल्याप्रमाणे धाराशिव ते तुळजापूर २१ किलोमीटर धाव.' } },
  { id: 'DeVs_M0p8hl', cover: '/reels/DeVs_M0p8hl.jpg', category: 'culture', en: 'A moment of devotion', mr: 'श्रद्धेचा क्षण', description: { en: 'Navratri greetings and a prayer for farming families across Marathwada.', mr: 'नवरात्रोत्सवाच्या शुभेच्छा व मराठवाड्यातील शेतकरी कुटुंबांसाठी प्रार्थना.' } },
] as const;
export type Reel = (typeof reels)[number];
export function reelUrl(id: string) { return `https://www.instagram.com/mpomrajenimbalkar/reel/${id}/`; }