/**
 * English UI dictionary — the source of truth for all copy. `ur.ts` must mirror
 * this shape exactly (enforced by the `Dict` type). No component hardcodes
 * user-facing text; everything routes through here (Section 30).
 */
const en = {
  dir: "ltr" as "ltr" | "rtl",
  langName: "English",

  common: {
    appName: "Guardian AI",
    tagline: "AI emergency response assistant",
    analyze: "Analyze emergency",
    reAnalyze: "Re-analyze with answers",
    analyzing: "Analyzing",
    back: "Back",
    backHome: "Back to home",
    newEmergency: "New emergency",
    close: "Close",
    cancel: "Cancel",
    retry: "Try again",
    loading: "Loading",
    optional: "optional",
    yes: "Yes",
    no: "No",
    notSure: "Not sure",
    clear: "Clear",
    remove: "Remove",
    download: "Download",
    share: "Share",
    copy: "Copy",
    copied: "Copied",
    print: "Print",
    showMore: "Show more",
    showLess: "Show less",
    mockBadge: "Mock data",
    demoMode: "Demo mode",
    poweredBy: "Foundation build — mock AI services",
    step: (n: number) => `Step ${n}`,
  },

  nav: {
    home: "Home",
    language: "Language",
    theme: "Theme",
    lightMode: "Switch to light mode",
    darkMode: "Switch to dark mode",
  },

  landing: {
    badge: "Hackathon foundation · mock AI",
    heroTitlePre: "Calm, guided response",
    heroTitleAccent: "when every second counts",
    heroSubtitle:
      "Describe an emergency in plain words, voice, or a photo. Guardian AI assesses severity, tells you what to do right now, and points you to the nearest help — grounded in first-aid guidance.",
    ctaPrimary: "Report an emergency",
    ctaSecondary: "See how it works",
    trust1: "Cautious, non-diagnostic guidance",
    trust2: "Works in English & Urdu",
    trust3: "Clear priority in seconds",

    howTitle: "How Guardian AI helps",
    howSubtitle: "Four steps, from a panicked description to a clear plan of action.",
    step1Title: "Describe",
    step1Desc: "Type, speak, or upload a photo of the scene — in English or Urdu.",
    step2Title: "Assess",
    step2Desc: "AI agents read the scene, weigh danger signs, and rank the severity.",
    step3Title: "Act",
    step3Desc: "Get prioritized, grounded first-aid steps for the situation right now.",
    step4Title: "Connect",
    step4Desc: "See the nearest capable hospital and pre-alert the right people.",

    answersTitle: "Every assessment answers five questions",
    q1: "What happened?",
    q2: "How serious is it?",
    q3: "What should I do right now?",
    q4: "Where can I get help?",
    q5: "Who has been notified?",

    disclaimerTitle: "Important",
    disclaimer:
      "Guardian AI provides first-aid guidance and does not replace professional medical care. In a real emergency, call your local emergency service immediately. This build uses simulated AI and mock data for demonstration.",
  },

  emergency: {
    title: "Report an emergency",
    subtitle: "Share whatever you can. Even a short description helps.",

    describeLabel: "What's happening?",
    describePlaceholder:
      "e.g. A motorbike hit a pedestrian near the market. He's on the ground, bleeding from the head and not responding…",
    describeHint: "Plain language is fine — English, Urdu, or Roman Urdu.",
    charCount: (n: number, max: number) => `${n} / ${max}`,

    voiceLabel: "Or describe by voice",
    voiceStart: "Start recording",
    voiceStop: "Stop",
    voiceRecording: "Recording…",
    voiceTranscribing: "Transcribing…",
    voiceTranscript: "Transcript",
    voiceUse: "Use this text",
    voiceHint: "Voice is transcribed by a mock service in this build.",

    imageLabel: "Add a photo of the scene",
    imageUpload: "Upload photo",
    imageCapture: "Use camera",
    imageRemove: "Remove photo",
    imageHint: "A photo helps assess the scene. Analyzed by a mock vision service.",
    imageSelected: "Photo attached",

    locationLabel: "Location",
    locationDetect: "Use my location",
    locationDetecting: "Locating…",
    locationDenied: "Location permission denied — enter it manually below.",
    locationPlaceholder: "Area, street, or landmark",
    locationUsing: (label: string) => `Using: ${label}`,
    locationHint: "Used to find the nearest hospital. Defaults to Lahore for the demo.",

    historyLabel: "Patient details",
    historyToggle: "Add patient details",
    historyName: "Name",
    historyAge: "Age",
    historyBlood: "Blood group",
    historyAllergies: "Allergies",
    historyConditions: "Known conditions",
    historyMedications: "Medications",
    historyNotes: "Other notes",
    historyPrivacy: "Kept only for this session. Never logged or stored (Section 28).",

    scenarioLabel: "Demo scenarios",
    scenarioHint: "Load a prepared scenario to try the flow quickly.",
    scenarioClear: "Clear scenario",

    summaryTitle: "What we have so far",
    summaryEmpty: "Start by describing the emergency. Your details appear here.",
    summaryDescription: "Description",
    summaryImage: "Scene photo",
    summaryLocation: "Location",
    summaryPatient: "Patient details",
    summaryScenario: "Scenario",
    summaryVoice: "Voice note",

    analyzeHint: "Guardian AI will assess severity and next steps.",
    analyzeEmpty: "Add a description, photo, or scenario to analyze.",
  },

  analysis: {
    title: "Analyzing emergency",
    subtitle: "Guardian AI agents are assessing the situation…",
    understanding: "Understanding the situation",
    vision: "Reading the scene photo",
    triage: "Weighing danger signs",
    knowledge: "Consulting first-aid guidance",
    location: "Finding nearest help",
    safety: "Running safety checks",
    report: "Preparing your report",
    done: "Assessment ready",
  },

  results: {
    q1What: "What happened",
    q2Serious: "How serious it is",
    q3Now: "What to do right now",
    q4Help: "Where to get help",
    q5Notified: "Who has been notified",

    visionTitle: "Scene photo",
    visionUsable: "Analyzed",
    visionUnusable: "Photo unclear — used your description instead",
    visionDetections: "Detected in image",
    visionNone: "No photo was provided.",

    priorityConfidence: (pct: number) => `${pct}% confidence`,
    whyTitle: "Why this priority",

    dangerTitle: "Danger signs",
    dangerNone: "No specific danger signs identified from what was shared.",

    conditionsTitle: "Possible conditions",
    conditionsCaution:
      "Possibilities to consider — not a diagnosis. A professional must confirm.",
    likelihoodPOSSIBLE: "Possible",
    likelihoodSUSPECTED: "Suspected",
    likelihoodUNLIKELY: "Unlikely",

    actionsTitle: "Immediate actions",
    actionsSubtitle: "Do these now, in order.",
    actionCritical: "Critical",

    clarifyTitle: "A few quick questions",
    clarifySubtitle: "Your answers sharpen the assessment. Re-analyze when ready.",
    clarifyWhy: "Why this matters",

    hospitalTitle: "Recommended hospital",
    hospitalDistance: (km: number) => `${km.toFixed(1)} km away`,
    hospitalEta: (min: number) => `~${min} min`,
    hospitalTransport: "Transport",
    hospitalCall: "Call",
    hospitalDirections: "Directions",
    hospitalCapabilities: "Capabilities",
    hospitalAlternatives: "Other options",
    hospitalOpen: "Open now",
    hospitalNone: "No hospital recommendation for this case.",

    notifyTitle: "Notifications",
    notifySubtitle: "Simulated for this demo — nobody is really contacted.",
    channelFamily: "Family / emergency contact",
    channelHospital: "Receiving hospital",
    channelEmergency: "Emergency service (1122)",
    stateSIMULATED_SENT: "Simulated — sent",
    statePREPARED: "Prepared",
    stateNOT_SENT: "Not sent",

    preAlertTitle: "Hospital pre-alert",
    preAlertSummary: "Summary sent ahead",
    preAlertEta: "ETA",
    preAlertDanger: "Flagged danger signs",
    preAlertSimulated: "SIMULATED — no message actually sent",

    sourcesTitle: "Guidance sources",
    sourcesSubtitle: "The assessment is grounded in these references.",
    sourceScore: (pct: number) => `${pct}% match`,

    reportTitle: "Handover report",
    reportSubtitle: "Share this with responders or the receiving hospital.",
    reportRef: "Reference",
    reportTime: "Time",
    reportDownload: "Download report",
    reportCopy: "Copy summary",
    reportShare: "Share",

    safetyTitle: "Safety checks",
    safetyPassed: "Passed safety validation",
    safetyReview: "Flagged for review",
    safetyEmergency: "Contact emergency services now",

    disclaimerTitle: "Remember",
  },

  priority: {
    CRITICAL: {
      label: "Critical",
      tagline: "Life-threatening — act now and call for help",
    },
    HIGH: {
      label: "High",
      tagline: "Urgent — needs prompt medical attention",
    },
    MODERATE: {
      label: "Moderate",
      tagline: "Should be seen by a professional soon",
    },
    LOW: {
      label: "Low",
      tagline: "Minor — manage with basic first aid",
    },
  },

  incident: {
    ROAD_ACCIDENT: "Road accident",
    MEDICAL_EMERGENCY: "Medical emergency",
    CARDIAC: "Cardiac emergency",
    BLEEDING: "Severe bleeding",
    FALL: "Fall / injury",
    BURN: "Burn",
    FIRE: "Fire",
    BREATHING: "Breathing difficulty",
    MINOR_INJURY: "Minor injury",
    UNKNOWN: "Unclassified",
  },

  errors: {
    analyzeFailed: "Analysis failed",
    backendDown:
      "Could not reach the Guardian AI backend. Make sure the server is running on port 8000.",
    generic: "Something went wrong. Please try again.",
    sessionMissing: "That session could not be found.",
  },
};

export type Dict = typeof en;
export default en;
