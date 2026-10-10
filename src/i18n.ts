import { LanguageCode } from './types';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  statusOperational: string;
  emergencyMode: string;
  emergencyModeActive: string;
  exitEmergencyMode: string;
  simulateDisasters: string;
  launchDashboard: string;
  reportEmergency: string;
  viewLiveSituation: string;
  heroTitle: string;
  heroSubtitle: string;
  activeEmergencies: string;
  peopleAtRisk: string;
  rescueTeamsActive: string;
  hospitalsAvailable: string;
  sheltersOpen: string;
  emergencyRequests: string;
  criticalAlerts: string;
  aiDisasterDetection: string;
  liveDisasterMap: string;
  predictiveAnalytics: string;
  emergencyAlerts: string;
  evacuationPlanner: string;
  rescueOperations: string;
  hospitalCoordination: string;
  resourceManagement: string;
  missingPersons: string;
  communicationCenter: string;
  adminAnalytics: string;
  citizenView: string;
  sendEmergencyAlert: string;
  submitReport: string;
  useCurrentLocation: string;
  aiAssistant: string;
  prototypeDisclaimer: string;
  quickActions: string;
  findShelter: string;
  requestRescue: string;
  nearestHospital: string;
  evacuationRoute: string;
  roleCitizen: string;
  roleResponder: string;
  roleAdmin: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  English: {
    appName: 'RESQ AI',
    appSubtitle: 'AI-Powered Disaster Communication & Emergency Response',
    statusOperational: 'SYSTEM STATUS: OPERATIONAL',
    emergencyMode: '🚨 ACTIVATE EMERGENCY MODE',
    emergencyModeActive: '⚠️ CRITICAL INCIDENT ACTIVE — EMERGENCY PROTOCOL 1',
    exitEmergencyMode: 'DEACTIVATE EMERGENCY MODE',
    simulateDisasters: 'Simulate Disasters',
    launchDashboard: 'Launch Emergency Dashboard',
    reportEmergency: 'Report Emergency',
    viewLiveSituation: 'View Live Situation',
    heroTitle: 'When Every Second Matters, AI Responds.',
    heroSubtitle: 'An intelligent disaster communication and emergency response platform designed to detect threats, alert communities, and coordinate rescue operations.',
    activeEmergencies: 'Active Incidents',
    peopleAtRisk: 'People at Risk',
    rescueTeamsActive: 'Rescue Teams Active',
    hospitalsAvailable: 'Hospitals Available',
    sheltersOpen: 'Shelters Open',
    emergencyRequests: 'Emergency Requests',
    criticalAlerts: 'Critical Alerts',
    aiDisasterDetection: 'AI Disaster Detection Engine',
    liveDisasterMap: 'Live Disaster Map',
    predictiveAnalytics: 'Predictive Analytics & AI Forecasts',
    emergencyAlerts: 'Emergency Alert Broadcast System',
    evacuationPlanner: 'Intelligent Evacuation Planner',
    rescueOperations: 'Rescue Operations Center',
    hospitalCoordination: 'Hospital & Triage Coordination',
    resourceManagement: 'Emergency Resource Management',
    missingPersons: 'Missing Person & Survivor Registry',
    communicationCenter: 'Emergency Dispatch & Radio Comms',
    adminAnalytics: 'Command Analytics & Performance',
    citizenView: 'Citizen Rapid SOS Portal',
    sendEmergencyAlert: 'SEND EMERGENCY ALERT',
    submitReport: 'Submit Emergency Report',
    useCurrentLocation: 'Use My Current GPS Location',
    aiAssistant: 'RESQ AI Assistant',
    prototypeDisclaimer: 'Prototype Simulation — Emergency data, alerts, locations and AI predictions shown in this demonstration are simulated. This application does not replace official emergency services.',
    quickActions: 'Quick Safety Actions',
    findShelter: 'Find Nearest Shelter',
    requestRescue: 'Request Immediate Rescue',
    nearestHospital: 'Locate Nearest Hospital',
    evacuationRoute: 'Calculate Evacuation Route',
    roleCitizen: 'Citizen',
    roleResponder: 'Rescue Responder',
    roleAdmin: 'Command Administrator',
  },
  Telugu: {
    appName: 'RESQ AI',
    appSubtitle: 'ఏఐ ఆధారిత విపత్తు నిర్వహణ మరియు అత్యవసర సహాయ వ్యవస్థ',
    statusOperational: 'వ్యవస్థ స్థితి: పూర్తి స్థాయిలో పని చేస్తోంది',
    emergencyMode: '🚨 అత్యవసర మోడ్ యాక్టివేట్ చేయండి',
    emergencyModeActive: '⚠️ తీవ్ర అత్యవసర పరిస్థితి యాక్టివ్ — ప్రోటోకాల్ 1',
    exitEmergencyMode: 'అత్యవసర మోడ్ ముగించండి',
    simulateDisasters: 'విపత్తును అనుకరించండి (డెమో)',
    launchDashboard: 'కమాండ్ డ్యాష్‌బోర్డ్ తెరవండి',
    reportEmergency: 'సహాయం కోసం నివేదించండి',
    viewLiveSituation: 'ప్రత్యక్ష పరిస్థితిని చూడండి',
    heroTitle: 'ప్రతి క్షణం అమూల్యమైనప్పుడు, AI స్పందిస్తుంది.',
    heroSubtitle: 'ముప్పులను గుర్తించి, ప్రజలను హెచ్చరించి, సహాయక చర్యలను సమన్వయం చేసే అధునాతన అత్యవసర వ్యవస్థ.',
    activeEmergencies: 'యాక్టివ్ ప్రమాదాలు',
    peopleAtRisk: 'ముప్పులో ఉన్న జనాభా',
    rescueTeamsActive: 'సహాయక బృందాలు',
    hospitalsAvailable: 'అందుబాటులో ఉన్న ఆసుపత్రులు',
    sheltersOpen: 'పునరావాస కేంద్రాలు',
    emergencyRequests: 'అత్యవసర విజ్ఞప్తులు',
    criticalAlerts: 'తీవ్రమైన హెచ్చరికలు',
    aiDisasterDetection: 'AI విపత్తు గుర్తింపు ఇంజిన్',
    liveDisasterMap: 'లైవ్ విపత్తు మ్యాప్',
    predictiveAnalytics: 'ముందస్తు అంచనాలు & AI విశ్లేషణ',
    emergencyAlerts: 'అత్యవసర హెచ్చరికల ప్రసార వ్యవస్థ',
    evacuationPlanner: 'సురక్షిత తరలింపు ప్లానర్',
    rescueOperations: 'రెస్క్యూ ఆపరేషన్స్ కేంద్రం',
    hospitalCoordination: 'ఆసుపత్రుల సమన్వయం',
    resourceManagement: 'వనరుల నిర్వహణ',
    missingPersons: 'గల్లంతైన వారి వివరాలు',
    communicationCenter: 'కమ్యూనికేషన్ కేంద్రం',
    adminAnalytics: 'అనలిటిక్స్ & పనితీరు',
    citizenView: 'పౌరుల తక్షణ SOS పోర్టల్',
    sendEmergencyAlert: 'అత్యవసర హెచ్చరిక పంపండి',
    submitReport: 'సహాయం రిపోర్ట్ చేయండి',
    useCurrentLocation: 'నా ప్రస్తుత జీపీఎస్ లొకేషన్',
    aiAssistant: 'RESQ AI అసిస్టెంట్',
    prototypeDisclaimer: 'ప్రోటోటైప్ సిమ్యులేషన్ — ఇక్కడ చూపబడిన డేటా, స్థానాలు మరియు AI అంచనాలు కేవలం ప్రదర్శన కోసం మాత్రమే. ఇది అధికారిక ప్రభుత్వ సేవలకు ప్రత్యామ్నాయం కాదు.',
    quickActions: 'త్వరిత చర్యలు',
    findShelter: 'సమీప ఆశ్రయం కనుగొనండి',
    requestRescue: 'తక్షణ సహాయం కోరండి',
    nearestHospital: 'సమీప ఆసుపత్రి',
    evacuationRoute: 'సురక్షిత మార్గం',
    roleCitizen: 'పౌరుడు (Citizen)',
    roleResponder: 'రెస్క్యూ అధికారి (Responder)',
    roleAdmin: 'కమాండ్ అడ్మిన్ (Admin)',
  },
  Hindi: {
    appName: 'RESQ AI',
    appSubtitle: 'एआई-संचालित आपदा संचार एवं आपातकालीन प्रतिक्रिया प्रणाली',
    statusOperational: 'सिस्टम स्थिति: पूर्णतः सक्रिय एवं क्रियाशील',
    emergencyMode: '🚨 इमरजेंसी मोड सक्रिय करें',
    emergencyModeActive: '⚠️ गंभीर आपातकालीन स्थिति सक्रिय — प्रोटोकॉल 1',
    exitEmergencyMode: 'इमरजेंसी मोड समाप्त करें',
    simulateDisasters: 'आपदा सिमुलेशन (डेमो)',
    launchDashboard: 'कमांड डैशबोर्ड खोलें',
    reportEmergency: 'आपातकाल रिपोर्ट करें',
    viewLiveSituation: 'लाइव स्थिति देखें',
    heroTitle: 'जब हर सेकंड कीमती हो, तब AI तुरंत कदम उठाता है।',
    heroSubtitle: 'खतरों का पता लगाने, समुदायों को सचेत करने और बचाव कार्यों का समन्वय करने के लिए बुद्धिमान आपदा प्रबंधन प्रणाली।',
    activeEmergencies: 'सक्रिय घटनाएं',
    peopleAtRisk: 'जोखिम में नागरिक',
    rescueTeamsActive: 'तैनात बचाव दल',
    hospitalsAvailable: 'उपलब्ध अस्पताल',
    sheltersOpen: 'राहत शिविर',
    emergencyRequests: 'आपातकालीन अनुरोध',
    criticalAlerts: 'गंभीर अलर्ट',
    aiDisasterDetection: 'एआई आपदा पहचान इंजन',
    liveDisasterMap: 'लाइव आपदा मानचित्र',
    predictiveAnalytics: 'पूर्वानुमान एवं एआई विश्लेषण',
    emergencyAlerts: 'आपातकालीन प्रसारण प्रणाली',
    evacuationPlanner: 'सुरक्षित निकास मार्ग योजना',
    rescueOperations: 'बचाव अभियान केंद्र',
    hospitalCoordination: 'अस्पताल एवं ट्राइएज समन्वय',
    resourceManagement: 'राहत सामग्री एवं संसाधन प्रबंधन',
    missingPersons: 'लापता व्यक्ति एवं उत्तरजीवी ट्रैकर',
    communicationCenter: 'आपातकालीन नियंत्रण कक्ष संचार',
    adminAnalytics: 'कमांड एनालिटिक्स',
    citizenView: 'नागरिक त्वरित एसओएस पोर्टल',
    sendEmergencyAlert: 'आपातकालीन अलर्ट भेजें',
    submitReport: 'रिपोर्ट सबमिट करें',
    useCurrentLocation: 'मेरी वर्तमान जीपीएस लोकेशन',
    aiAssistant: 'RESQ AI सहायक',
    prototypeDisclaimer: 'प्रोटोटाइप सिमुलेशन — इस प्रदर्शन में दिखाए गए आपातकालीन डेटा, अलर्ट और एआई भविष्यवाणियां सिमुलेटेड हैं। यह वास्तविक आधिकारिक आपातकालीन सेवाओं का स्थान नहीं लेता है।',
    quickActions: 'त्वरित सुरक्षा उपाय',
    findShelter: 'निकटतम राहत शिविर',
    requestRescue: 'त्वरित बचाव का अनुरोध करें',
    nearestHospital: 'निकटतम अस्पताल',
    evacuationRoute: 'निकासी मार्ग देखें',
    roleCitizen: 'नागरिक (Citizen)',
    roleResponder: 'बचाव दल (Responder)',
    roleAdmin: 'कमांड एडमिन (Admin)',
  },
};
