/**
 * Urdu (اردو) UI dictionary. Mirrors `en.ts` exactly — the `Dict` type makes any
 * missing or mistyped key a compile error. Direction is RTL.
 */
import type { Dict } from "./en";

const ur: Dict = {
  dir: "rtl",
  langName: "اردو",

  common: {
    appName: "گارڈین اے آئی",
    tagline: "اے آئی ایمرجنسی رسپانس معاون",
    analyze: "ایمرجنسی کا تجزیہ کریں",
    reAnalyze: "جوابات کے ساتھ دوبارہ تجزیہ",
    analyzing: "تجزیہ جاری ہے",
    back: "واپس",
    backHome: "ہوم پر واپس",
    newEmergency: "نئی ایمرجنسی",
    close: "بند کریں",
    cancel: "منسوخ",
    retry: "دوبارہ کوشش کریں",
    loading: "لوڈ ہو رہا ہے",
    optional: "اختیاری",
    yes: "ہاں",
    no: "نہیں",
    notSure: "یقین نہیں",
    clear: "صاف کریں",
    remove: "ہٹا دیں",
    download: "ڈاؤن لوڈ",
    share: "شیئر کریں",
    copy: "کاپی کریں",
    copied: "کاپی ہو گیا",
    print: "پرنٹ کریں",
    showMore: "مزید دیکھیں",
    showLess: "کم دیکھیں",
    mockBadge: "فرضی ڈیٹا",
    demoMode: "ڈیمو موڈ",
    poweredBy: "بنیادی ورژن — فرضی اے آئی سروسز",
    step: (n: number) => `مرحلہ ${n}`,
  },

  nav: {
    home: "ہوم",
    language: "زبان",
    theme: "تھیم",
    lightMode: "لائٹ موڈ پر جائیں",
    darkMode: "ڈارک موڈ پر جائیں",
  },

  landing: {
    badge: "ہیکاتھون بنیاد · فرضی اے آئی",
    heroTitlePre: "پُرسکون، رہنمائی سے بھرپور جواب",
    heroTitleAccent: "جب ہر سیکنڈ قیمتی ہو",
    heroSubtitle:
      "ایمرجنسی کو سادہ الفاظ، آواز یا تصویر کے ذریعے بیان کریں۔ گارڈین اے آئی شدت کا اندازہ لگاتا ہے، فوری اقدامات بتاتا ہے، اور قریبی مدد کی نشاندہی کرتا ہے — ابتدائی طبی رہنمائی کی بنیاد پر۔",
    ctaPrimary: "ایمرجنسی رپورٹ کریں",
    ctaSecondary: "طریقہ کار دیکھیں",
    trust1: "محتاط، غیر تشخیصی رہنمائی",
    trust2: "انگریزی اور اردو میں کام کرتا ہے",
    trust3: "چند سیکنڈ میں واضح ترجیح",

    howTitle: "گارڈین اے آئی کیسے مدد کرتا ہے",
    howSubtitle: "چار مراحل — گھبراہٹ بھری تفصیل سے واضح لائحہ عمل تک۔",
    step1Title: "بیان کریں",
    step1Desc: "منظر کو لکھیں، بولیں یا تصویر اپ لوڈ کریں — انگریزی یا اردو میں۔",
    step2Title: "جائزہ",
    step2Desc: "اے آئی ایجنٹ منظر کو پڑھتے ہیں، خطرے کی علامات کو تولتے ہیں، اور شدت طے کرتے ہیں۔",
    step3Title: "اقدام",
    step3Desc: "موجودہ صورتحال کے لیے ترجیحی، مستند ابتدائی طبی اقدامات حاصل کریں۔",
    step4Title: "رابطہ",
    step4Desc: "قریب ترین موزوں ہسپتال دیکھیں اور متعلقہ افراد کو پہلے سے مطلع کریں۔",

    answersTitle: "ہر جائزہ پانچ سوالوں کا جواب دیتا ہے",
    q1: "کیا ہوا؟",
    q2: "کتنا سنگین ہے؟",
    q3: "ابھی مجھے کیا کرنا چاہیے؟",
    q4: "مدد کہاں سے ملے گی؟",
    q5: "کسے مطلع کیا گیا؟",

    disclaimerTitle: "اہم",
    disclaimer:
      "گارڈین اے آئی ابتدائی طبی رہنمائی فراہم کرتا ہے اور پیشہ ورانہ طبی نگہداشت کا متبادل نہیں۔ حقیقی ایمرجنسی میں فوراً اپنی مقامی ایمرجنسی سروس کو کال کریں۔ یہ ورژن مظاہرے کے لیے فرضی اے آئی اور ڈیٹا استعمال کرتا ہے۔",
  },

  emergency: {
    title: "ایمرجنسی رپورٹ کریں",
    subtitle: "جو کچھ بتا سکتے ہیں بتائیں۔ مختصر تفصیل بھی مددگار ہے۔",

    describeLabel: "کیا ہو رہا ہے؟",
    describePlaceholder:
      "مثلاً بازار کے قریب موٹرسائیکل نے ایک راہگیر کو ٹکر ماری۔ وہ زمین پر ہے، سر سے خون بہہ رہا ہے اور جواب نہیں دے رہا…",
    describeHint: "سادہ زبان کافی ہے — انگریزی، اردو یا رومن اردو۔",
    charCount: (n: number, max: number) => `${n} / ${max}`,

    voiceLabel: "یا آواز کے ذریعے بیان کریں",
    voiceStart: "ریکارڈنگ شروع کریں",
    voiceStop: "روکیں",
    voiceRecording: "ریکارڈنگ جاری…",
    voiceTranscribing: "متن میں تبدیل ہو رہا ہے…",
    voiceTranscript: "نقل",
    voiceUse: "یہ متن استعمال کریں",
    voiceHint: "اس ورژن میں آواز فرضی سروس کے ذریعے متن میں بدلی جاتی ہے۔",

    imageLabel: "منظر کی تصویر شامل کریں",
    imageUpload: "تصویر اپ لوڈ کریں",
    imageCapture: "کیمرہ استعمال کریں",
    imageRemove: "تصویر ہٹائیں",
    imageHint: "تصویر منظر کا جائزہ لینے میں مدد دیتی ہے۔ فرضی وژن سروس تجزیہ کرتی ہے۔",
    imageSelected: "تصویر منسلک ہے",

    locationLabel: "مقام",
    locationDetect: "میرا مقام استعمال کریں",
    locationDetecting: "مقام معلوم کیا جا رہا ہے…",
    locationDenied: "مقام کی اجازت مسترد — نیچے دستی طور پر درج کریں۔",
    locationPlaceholder: "علاقہ، گلی یا نشانی",
    locationUsing: (label: string) => `استعمال میں: ${label}`,
    locationHint: "قریب ترین ہسپتال تلاش کرنے کے لیے۔ ڈیمو کے لیے پہلے سے لاہور۔",

    historyLabel: "مریض کی تفصیلات",
    historyToggle: "مریض کی تفصیلات شامل کریں",
    historyName: "نام",
    historyAge: "عمر",
    historyBlood: "خون کا گروپ",
    historyAllergies: "الرجی",
    historyConditions: "معلوم بیماریاں",
    historyMedications: "ادویات",
    historyNotes: "دیگر نوٹس",
    historyPrivacy: "صرف اس سیشن کے لیے۔ کبھی محفوظ یا ریکارڈ نہیں ہوتیں (سیکشن 28)۔",

    scenarioLabel: "ڈیمو منظرنامے",
    scenarioHint: "فلو جلدی آزمانے کے لیے تیار شدہ منظرنامہ لوڈ کریں۔",
    scenarioClear: "منظرنامہ صاف کریں",

    summaryTitle: "اب تک کی معلومات",
    summaryEmpty: "ایمرجنسی بیان کرنے سے آغاز کریں۔ آپ کی تفصیلات یہاں ظاہر ہوں گی۔",
    summaryDescription: "تفصیل",
    summaryImage: "منظر کی تصویر",
    summaryLocation: "مقام",
    summaryPatient: "مریض کی تفصیلات",
    summaryScenario: "منظرنامہ",
    summaryVoice: "آواز کا پیغام",

    analyzeHint: "گارڈین اے آئی شدت اور اگلے اقدامات کا جائزہ لے گا۔",
    analyzeEmpty: "تجزیے کے لیے تفصیل، تصویر یا منظرنامہ شامل کریں۔",
  },

  analysis: {
    title: "ایمرجنسی کا تجزیہ",
    subtitle: "گارڈین اے آئی ایجنٹ صورتحال کا جائزہ لے رہے ہیں…",
    understanding: "صورتحال سمجھی جا رہی ہے",
    vision: "منظر کی تصویر پڑھی جا رہی ہے",
    triage: "خطرے کی علامات تولی جا رہی ہیں",
    knowledge: "ابتدائی طبی رہنمائی سے رجوع",
    location: "قریب ترین مدد تلاش کی جا رہی ہے",
    safety: "حفاظتی جانچ جاری ہے",
    report: "آپ کی رپورٹ تیار کی جا رہی ہے",
    done: "جائزہ تیار ہے",
  },

  results: {
    q1What: "کیا ہوا",
    q2Serious: "کتنا سنگین ہے",
    q3Now: "ابھی کیا کرنا ہے",
    q4Help: "مدد کہاں سے ملے",
    q5Notified: "کسے مطلع کیا گیا",

    visionTitle: "منظر کی تصویر",
    visionUsable: "تجزیہ شدہ",
    visionUnusable: "تصویر واضح نہیں — آپ کی تفصیل استعمال کی گئی",
    visionDetections: "تصویر میں شناخت شدہ",
    visionNone: "کوئی تصویر فراہم نہیں کی گئی۔",

    priorityConfidence: (pct: number) => `${pct}% اعتماد`,
    whyTitle: "یہ ترجیح کیوں",

    dangerTitle: "خطرے کی علامات",
    dangerNone: "فراہم کردہ معلومات سے کوئی خاص خطرے کی علامت سامنے نہیں آئی۔",

    conditionsTitle: "ممکنہ حالات",
    conditionsCaution:
      "غور کرنے کے لیے امکانات — تشخیص نہیں۔ کسی پیشہ ور کو تصدیق کرنی ہوگی۔",
    likelihoodPOSSIBLE: "ممکنہ",
    likelihoodSUSPECTED: "مشتبہ",
    likelihoodUNLIKELY: "بعید",

    actionsTitle: "فوری اقدامات",
    actionsSubtitle: "یہ ابھی، ترتیب سے کریں۔",
    actionCritical: "نازک",

    clarifyTitle: "چند فوری سوالات",
    clarifySubtitle: "آپ کے جوابات جائزے کو بہتر بناتے ہیں۔ تیار ہوں تو دوبارہ تجزیہ کریں۔",
    clarifyWhy: "یہ کیوں اہم ہے",

    hospitalTitle: "تجویز کردہ ہسپتال",
    hospitalDistance: (km: number) => `${km.toFixed(1)} کلومیٹر دور`,
    hospitalEta: (min: number) => `~${min} منٹ`,
    hospitalTransport: "آمدورفت",
    hospitalCall: "کال کریں",
    hospitalDirections: "راستہ",
    hospitalCapabilities: "سہولیات",
    hospitalAlternatives: "دیگر اختیارات",
    hospitalOpen: "ابھی کھلا ہے",
    hospitalNone: "اس معاملے کے لیے کوئی ہسپتال تجویز نہیں۔",

    notifyTitle: "اطلاعات",
    notifySubtitle: "اس ڈیمو کے لیے فرضی — حقیقت میں کسی سے رابطہ نہیں کیا جاتا۔",
    channelFamily: "خاندان / ایمرجنسی رابطہ",
    channelHospital: "وصول کنندہ ہسپتال",
    channelEmergency: "ایمرجنسی سروس (1122)",
    stateSIMULATED_SENT: "فرضی — بھیج دیا",
    statePREPARED: "تیار",
    stateNOT_SENT: "نہیں بھیجا",

    preAlertTitle: "ہسپتال کو پیشگی اطلاع",
    preAlertSummary: "خلاصہ پہلے سے بھیجا گیا",
    preAlertEta: "متوقع وقت",
    preAlertDanger: "نشان زد خطرے کی علامات",
    preAlertSimulated: "فرضی — حقیقت میں کوئی پیغام نہیں بھیجا گیا",

    sourcesTitle: "رہنمائی کے ذرائع",
    sourcesSubtitle: "یہ جائزہ ان حوالوں پر مبنی ہے۔",
    sourceScore: (pct: number) => `${pct}% مطابقت`,

    reportTitle: "حوالگی رپورٹ",
    reportSubtitle: "یہ رپورٹ ریسکیو یا وصول کنندہ ہسپتال کے ساتھ شیئر کریں۔",
    reportRef: "حوالہ",
    reportTime: "وقت",
    reportDownload: "رپورٹ ڈاؤن لوڈ کریں",
    reportCopy: "خلاصہ کاپی کریں",
    reportShare: "شیئر کریں",

    safetyTitle: "حفاظتی جانچ",
    safetyPassed: "حفاظتی توثیق کامیاب",
    safetyReview: "جائزے کے لیے نشان زد",
    safetyEmergency: "ابھی ایمرجنسی سروس سے رابطہ کریں",

    disclaimerTitle: "یاد رکھیں",
  },

  priority: {
    CRITICAL: {
      label: "نازک",
      tagline: "جان لیوا — فوری اقدام کریں اور مدد بلائیں",
    },
    HIGH: {
      label: "زیادہ",
      tagline: "فوری — بروقت طبی توجہ درکار",
    },
    MODERATE: {
      label: "درمیانہ",
      tagline: "جلد کسی پیشہ ور کو دکھائیں",
    },
    LOW: {
      label: "کم",
      tagline: "معمولی — بنیادی ابتدائی طبی امداد سے سنبھالیں",
    },
  },

  incident: {
    ROAD_ACCIDENT: "ٹریفک حادثہ",
    MEDICAL_EMERGENCY: "طبی ایمرجنسی",
    CARDIAC: "دل کی ایمرجنسی",
    BLEEDING: "شدید خون بہنا",
    FALL: "گرنا / چوٹ",
    BURN: "جلنا",
    FIRE: "آگ",
    BREATHING: "سانس کی دشواری",
    MINOR_INJURY: "معمولی چوٹ",
    UNKNOWN: "غیر متعین",
  },

  errors: {
    analyzeFailed: "تجزیہ ناکام",
    backendDown:
      "گارڈین اے آئی بیک اینڈ تک رسائی نہیں۔ یقینی بنائیں کہ سرور پورٹ 8000 پر چل رہا ہے۔",
    generic: "کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔",
    sessionMissing: "وہ سیشن نہیں مل سکا۔",
  },
};

export default ur;
