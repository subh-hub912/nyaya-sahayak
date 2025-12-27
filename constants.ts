
import React from 'react';
import { MockResponse, Language, Lawyer } from './types';

export const COLORS = {
  black: '#000000',
  gold: '#c5a059',
  white: '#ffffff',
  grey: '#f8fafc',
  border: '#e2e8f0'
};

export const LANGUAGES: { code: Language; label: string; native: string; voice: string }[] = [
  { code: 'EN', label: 'English', native: 'English', voice: 'en-IN' },
  { code: 'HI', label: 'Hindi', native: 'हिन्दी', voice: 'hi-IN' },
  { code: 'BN', label: 'Bengali', native: 'বাংলা', voice: 'bn-IN' },
  { code: 'TE', label: 'Telugu', native: 'తెలుగు', voice: 'te-IN' },
  { code: 'MR', label: 'Marathi', native: 'मराठी', voice: 'mr-IN' }
];

export const TRANSLATIONS: Record<Language, any> = {
  EN: {
    portal_citizen: "Citizen Portal",
    portal_expert: "Professional",
    portal_display: "Live Display",
    hero_title: "How can we assist you?",
    hero_subtitle: "Empowering citizens with clarity on the Constitution and the new laws of Bharat.",
    btn_speak: "Speak Your Issue",
    btn_scan: "Scan Documents",
    btn_stop: "Stop & Analyze",
    btn_new: "Ask New Question",
    btn_aid: "Find Legal Counsel",
    label_listening: "Suno: Hearing you",
    label_thinking: "Thinking: Analyzing Case",
    label_processed: "Case Description",
    label_roadmap: "Step-by-Step Justice Map",
    label_insight: "Expert Summary",
    label_source: "Verified Citation",
    label_briefing: "Audio Briefing",
    label_official: "Official Source",
    label_marketplace: "Verified Legal Counsel Near You",
    label_fee: "Genuine Fee",
    label_wins: "Wins",
    label_losses: "Losses",
    label_cases: "Cases Solved",
    btn_consult: "Instant Consult",
    placeholder_type: "Or type your query here...",
    quick_topics: "Quick Topics",
    topics: {
      fir: "Register an FIR",
      property: "Property Dispute",
      fraud: "Financial Fraud",
      bail: "Bail Rules",
      violence: "Domestic Violence"
    },
    board: {
      title: "Court Display Board",
      subtitle: "Real-time hearing status. Track your item number.",
      feed_status: "Live Statutory Feed",
      complex: "Court Complex",
      room: "Select Courtroom",
      hearing: "Currently Hearing",
      on_deck: "On Deck",
      tracker_title: "Wait Tracker",
      tracker_desc: "Enter your item number from the daily cause list.",
      your_item: "Your Item Number",
      wait_time: "Estimated Wait",
      passed: "Case Passed",
      report: "Report to bench immediately",
      disclaimer: "Disclaimer",
      disclaimer_text: "Wait times are automated projections and may vary."
    },
    expert: {
      feed_title: "Legal Intelligence Workbench",
      btn_brief: "Export Case Dossier",
      entry: "Intelligence Entry",
      brain: "AI Statutory Core",
      placeholder: "Enter case fact, citation, or technical query...",
      btn_analyze: "Process Query",
      citations_title: "Statutory Reference",
      dossier_title: "Dossier Access",
      dossier_desc: "All analysis is verified against the 2024 Bharatiya Nyaya Sanhita updates.",
      tools: {
        search: "Global Precedent Search",
        convert: "IPC-BNS Converter",
        draft: "Draft Petition",
        verify: "BSB Evidence Check"
      }
    }
  },
  HI: {
    portal_citizen: "नागरिक पोर्टल",
    portal_expert: "पेशेवर मोड",
    portal_display: "लाइव डिस्प्ले",
    hero_title: "हम आपकी क्या सहायता कर सकते हैं?",
    hero_subtitle: "संविधान और भारत के नए कानूनों पर स्पष्टता के साथ नागरिकों को सशक्त बनाना।",
    btn_speak: "अपनी समस्या बताएं",
    btn_scan: "दस्तावेज़ स्कैन करें",
    btn_stop: "रोकें और विश्लेषण करें",
    btn_new: "नया प्रश्न पूछें",
    btn_aid: "वकील खोजें",
    label_listening: "सुन रहे हैं...",
    label_thinking: "सोच रहे हैं: मामले का विश्लेषण...",
    label_processed: "मामले का विवरण",
    label_roadmap: "न्याय का चरण-दर-चरण मार्ग",
    label_insight: "विशेषज्ञ सारांश",
    label_source: "सत्यापित उद्धरण",
    label_briefing: "ऑडियो ब्रीफिंग",
    label_official: "आधिकारिक स्रोत",
    label_marketplace: "आपके पास सत्यापित कानूनी सलाहकार",
    label_fee: "वास्तविक शुल्क",
    label_wins: "जीत",
    label_losses: "हार",
    label_cases: "हल किए गए मामले",
    btn_consult: "तुरंत परामर्श",
    placeholder_type: "या यहाँ अपना प्रश्न लिखें...",
    quick_topics: "त्वरित विषय",
    topics: {
      fir: "FIR दर्ज करें",
      property: "संपत्ति विवाद",
      fraud: "वित्तीय धोखाधड़ी",
      bail: "ज़मानत के नियम",
      violence: "घरेलू हिंसा"
    },
    board: {
      title: "कोर्ट डिस्प्ले बोर्ड",
      subtitle: "वास्तविक समय सुनवाई स्थिति। अपना आइटम नंबर ट्रैक करें।",
      feed_status: "लाइव वैधानिक फीड",
      complex: "कोर्ट कॉम्प्लेक्स",
      room: "कोर्ट रूम चुनें",
      hearing: "अभी सुनवाई चल रही है",
      on_deck: "अगली बारी",
      tracker_title: "प्रतीक्षा ट्रैकर",
      tracker_desc: "दैनिक कारण सूची से अपना आइटम नंबर दर्ज करें।",
      your_item: "आपका आइटम नंबर",
      wait_time: "अनुमानित प्रतीक्षा",
      passed: "केस गुजर चुका है",
      report: "तुरंत बेंच को रिपोर्ट करें",
      disclaimer: "अस्वीकरण",
      disclaimer_text: "प्रतीक्षा समय स्वचालित अनुमान हैं और भिन्न हो सकते हैं।"
    },
    expert: {
      feed_title: "कानूनी इंटेलिजेंस वर्कबेंच",
      btn_brief: "केस डोजियर निर्यात करें",
      entry: "इंटेलिजेंस प्रविष्टि",
      brain: "AI वैधानिक कोर",
      placeholder: "केस तथ्य, उद्धरण, या तकनीकी प्रश्न दर्ज करें...",
      btn_analyze: "प्रक्रिया प्रश्न",
      citations_title: "वैधानिक संदर्भ",
      dossier_title: "डोजियर एक्सेस",
      dossier_desc: "सभी विश्लेषण 2024 भारतीय न्याय संहिता अपडेट के विरुद्ध सत्यापित हैं।",
      tools: {
        search: "वैश्विक नज़ीर खोज",
        convert: "IPC-BNS कनवर्टर",
        draft: "याचिका का मसौदा",
        verify: "BSB साक्ष्य जांच"
      }
    }
  },
  // Other languages following similar patterns...
  BN: { expert: { feed_title: "আইনি ইন্টেলিজেন্স ওয়ার্কবেঞ্চ", btn_brief: "রপ্তানি করুন", entry: "এন্ট্রি", brain: "AI কোর", placeholder: "টাইপ করুন...", btn_analyze: "বিশ্লেষণ", citations_title: "আইনি রেফারেন্স", dossier_title: "ডোজিয়ার", dossier_desc: "2024 BNS আপডেট দ্বারা যাচাইকৃত।", tools: { search: "অনুসন্ধান", convert: "কপি", draft: "খসড়া", verify: "যাচাই" } } },
  TE: { expert: { feed_title: "లీగల్ ఇంటెలిజెన్స్ వర్క్‌బెంచ్", btn_brief: "ఎగుమతి", entry: "ఎంట్రీ", brain: "AI కోర్", placeholder: "టైప్ చేయండి...", btn_analyze: "విశ్లేషించు", citations_title: "లీగల్ రిఫరెన్స్", dossier_title: "డోసియర్", dossier_desc: "2024 BNS అప్‌డేట్‌ల ప్రకారం.", tools: { search: "శోధన", convert: "మార్చు", draft: "డ్రాఫ్ట్", verify: "ధృవీకరణ" } } },
  MR: { expert: { feed_title: "लीगल इंटेलिजेंस वर्कबेंच", btn_brief: "निर्यात करा", entry: "एंट्री", brain: "AI कोअर", placeholder: "टाईप करा...", btn_analyze: "विश्लेषण", citations_title: "कायदेशीर संदर्भ", dossier_title: "डोजियर", dossier_desc: "2024 BNS अपडेटनुसार.", tools: { search: "शोध", convert: "रूपांतर", draft: "मसुदा", verify: "तपासणी" } } }
};

export const MOCK_LAWYERS: Lawyer[] = [
  {
    id: "l1",
    name: "Adv. Rajesh Sharma",
    specialization: ["Criminal", "Bail Rules"],
    fee: 1500,
    wins: 342,
    losses: 45,
    rating: 4.8,
    feedbackCount: 120,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    isVerified: true,
    court: "Saket Court, Delhi"
  },
  {
    id: "l2",
    name: "Adv. Priya Mukherjee",
    specialization: ["Civil", "Property"],
    fee: 2000,
    wins: 215,
    losses: 12,
    rating: 4.9,
    feedbackCount: 85,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    isVerified: true,
    court: "Calcutta City Court"
  },
  {
    id: "l3",
    name: "Adv. Vikram Singh",
    specialization: ["Criminal", "Cyber"],
    fee: 1200,
    wins: 156,
    losses: 32,
    rating: 4.5,
    feedbackCount: 210,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    isVerified: true,
    court: "Jaipur District Court"
  },
  {
    id: "l4",
    name: "Adv. Ananya Iyer",
    specialization: ["Family", "Domestic Violence"],
    fee: 800,
    wins: 412,
    losses: 18,
    rating: 4.9,
    feedbackCount: 450,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    isVerified: true,
    court: "Madras High Court"
  },
  {
    id: "l5",
    name: "Adv. Rahul Deshmukh",
    specialization: ["Corporate", "Financial Fraud"],
    fee: 3500,
    wins: 98,
    losses: 5,
    rating: 4.7,
    feedbackCount: 40,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    isVerified: true,
    court: "Bombay High Court"
  }
];

export const ICONS = {
  SCALE: createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }),
    React.createElement('path', { d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }),
    React.createElement('path', { d: "M7 21h10" }),
    React.createElement('path', { d: "M12 3v18" }),
    React.createElement('path', { d: "M3 7h18" })
  )),
  GAVEL: createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { d: "m14.5 12.5-8-8a2.12 2.12 0 0 1 3-3l8 8" }),
    React.createElement('path', { d: "m3.22 20.78 3-3" }),
    React.createElement('path', { d: "m15.5 15.5 2-2a2.12 2.12 0 0 0-3-3l-2 2" }),
    React.createElement('path', { d: "m2 9 3 3 7-7-3-3-7 7Z" })
  )),
  MIC: createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" }),
    React.createElement('path', { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
    React.createElement('line', { x1: "12", x2: "12", y1: "19", y2: "22" })
  )),
  DOC: createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
    React.createElement('polyline', { points: "14 2 14 8 20 8" })
  )),
  UPLOAD: createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    React.createElement('polyline', { points: "17 8 12 3 7 8" }),
    React.createElement('line', { x1: "12", x2: "12", y1: "3", y2: "15" })
  )),
  GLOBE: createIcon(React.createElement(React.Fragment, null,
    React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
    React.createElement('line', { x1: "2", y1: "12", x2: "22", y2: "12" }),
    React.createElement('path', { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
  )),
  CHATS: createIcon(React.createElement('path', { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })),
  USER_VOICE: createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" }),
    React.createElement('path', { d: "M19 10v2a7 7 0 0 1-14 0v-2" })
  )),
  TV: createIcon(React.createElement(React.Fragment, null,
    React.createElement('rect', { x: "2", y: "3", width: "20", height: "14", rx: "2" }),
    React.createElement('line', { x1: "8", y1: "21", x2: "16", y2: "21" }),
    React.createElement('line', { x1: "12", x2: "17", y2: "21" }),
    React.createElement('line', { x1: "12", y1: "17", x2: "12", y2: "21" })
  )),
  BUILDING: createIcon(React.createElement(React.Fragment, null,
    React.createElement('rect', { x: "4", y: "2", width: "16", height: "20", rx: "2" }),
    React.createElement('line', { x1: "9", y1: "22", x2: "9", y2: "18" }),
    React.createElement('line', { x1: "15", y1: "22", x2: "15", y2: "18" })
  )),
  TIMER: createIcon(React.createElement(React.Fragment, null,
    React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
    React.createElement('polyline', { points: "12 6 12 12 16 14" })
  )),
  POLICE: createIcon(React.createElement('path', { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })),
  HOME: createIcon(React.createElement('path', { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" })),
  MONEY: createIcon(React.createElement('path', { d: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })),
  UNLOCK: createIcon(React.createElement(React.Fragment, null,
    React.createElement('rect', { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
    React.createElement('path', { d: "M7 11V7a5 5 0 0 1 9.9-1" })
  )),
  SHIELD: createIcon(React.createElement('path', { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })),
  LAPTOP: createIcon(React.createElement(React.Fragment, null,
    React.createElement('rect', { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
    React.createElement('line', { x1: "2", x2: "22", y1: "20", y2: "20" })
  )),
  SHOP: createIcon(React.createElement('path', { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" })),
  TRAFFIC: createIcon(React.createElement('rect', { x: "8", y: "2", width: "8", height: "20", rx: "2", ry: "2" })),
  FOLDER: createIcon(React.createElement('path', { d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" })),
  KEY: createIcon(React.createElement('path', { d: "m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778ZM12 7l.3 1.3 1.3.3-1.3.3-.3 1.3-.3-1.3-1.3-.3 1.3-.3.3-1.3Z" })),
  CHECK: createIcon(React.createElement('polyline', { points: "20 6 9 17 4 12" })),
  STAR: createIcon(React.createElement('path', { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })),
  USERS: createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
    React.createElement('circle', { cx: "9", cy: "7", r: "4" }),
    React.createElement('path', { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
    React.createElement('path', { d: "M16 3.13a4 4 0 0 1 0 7.75" })
  )),
  VOLUME: createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { d: "M11 5L6 9H2v6h4l5 4V5z" }),
    React.createElement('path', { d: "M15.54 8.46a5 5 0 0 1 0 7.07" }),
    React.createElement('path', { d: "M19.07 4.93a10 10 0 0 1 0 14.14" })
  )),
  SEARCH: createIcon(React.createElement(React.Fragment, null,
    React.createElement('circle', { cx: "11", cy: "11", r: "8" }),
    React.createElement('line', { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
  )),
  LAYERS: createIcon(React.createElement(React.Fragment, null,
    React.createElement('polygon', { points: "12 2 2 7 12 12 22 7 12 2" }),
    React.createElement('polyline', { points: "2 17 12 22 22 17" }),
    React.createElement('polyline', { points: "2 12 12 17 22 12" })
  )),
  PENCIL: createIcon(React.createElement(React.Fragment, null,
    React.createElement('path', { d: "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" })
  ))
};

function createIcon(paths: React.ReactNode) {
  return React.createElement('svg', { 
    width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", 
    stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" 
  }, paths);
}

export const GENERIC_RESPONSE: MockResponse = {
  keywords: [],
  response: "I am currently scrutinizing the provisions of the Bharatiya Nyaya Sanhita (BNS) and the Bharatiya Nagarik Suraksha Sanhita (BNSS) to provide a precise legal interpretation. This inquiry necessitates a rigorous analysis of the recent legislative transitions effective July 1, 2024.",
  citations: [{
    section: "Introductory Statues",
    act: "BNS / BNSS / BSB 2023",
    summary: "New criminal legislation of India governing procedure and punishment."
  }]
};
