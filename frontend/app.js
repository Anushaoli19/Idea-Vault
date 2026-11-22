/**
 * NIE Idea Vault - Core Application Engine
 * ============================================================================
 * Provides client-side data management, REST API integration, duplicate detection,
 * optimistic voting with localStorage persistence, search, filtering, and sorting.
 */

// Global Configuration
const API_BASE = (typeof window !== 'undefined' && window.location && window.location.port === '5000') 
  ? '' 
  : 'http://127.0.0.1:5000';
const USE_MOCK = false;

/**
 * Backend Data Adapter
 * ============================================================================
 * Normalizes backend SQLite model to frontend UI contract:
 * - Maps `interested_students` -> `interests`
 * - Fallbacks for fields not stored in backend DB (department, tags, author, BOM, team slots)
 * - Computes upvoted and interested boolean flags from localStorage
 */
function adaptBackendIdea(raw) {
  if (!raw) return null;
  const upvotedSet = getStoredSet(STORAGE_KEYS.UPVOTES);
  const interestedSet = getStoredSet(STORAGE_KEYS.INTERESTS);
  const isUpvoted = upvotedSet.has(raw.id);
  const isInterested = interestedSet.has(raw.id);

  let parsedBom = [];
  try {
    if (typeof raw.bom_json === "string") parsedBom = JSON.parse(raw.bom_json);
    else if (Array.isArray(raw.bom)) parsedBom = raw.bom;
  } catch (e) { parsedBom = []; }

  let parsedTags = [];
  try {
    if (typeof raw.tags_json === "string") parsedTags = JSON.parse(raw.tags_json);
    else if (Array.isArray(raw.tags)) parsedTags = raw.tags;
    else parsedTags = [raw.category || "Innovation", "Capstone"];
  } catch (e) { parsedTags = [raw.category || "Innovation"]; }

  return {
    id: raw.id,
    nieId: raw.nieId || `NIE-25-${(raw.category || 'ENG').slice(0, 3).toUpperCase()}-${raw.id}`,
    title: raw.title || "Untitled Innovation",
    description: raw.description || "",
    category: raw.category || "General",
    department: raw.department || raw.category || "Computer Science & Engineering (CSE)",
    departmentShort: (raw.department || raw.category || "CSE").slice(0, 4).toUpperCase(),
    categoriesBadge: raw.category ? `${raw.category} • Capstone` : "Engineering • Capstone",
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
    timeAgo: raw.timeAgo || "Recently active",
    upvotes: typeof raw.upvotes === "number" ? raw.upvotes : 0,
    interests: typeof raw.interested_students === "number" ? raw.interested_students : (raw.interests || 0),
    isUpvoted: isUpvoted,
    isInterested: isInterested,
    tags: parsedTags,
    authorName: raw.author_name || raw.authorName || "NIE Student",
    authorUsn: raw.author_usn || raw.authorUsn || "4NI21CS089",
    authorBatch: raw.author_batch || raw.authorBatch || "Class of 2025",
    authorAvatar: raw.author_avatar || raw.authorAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR",
    problemStatement: raw.problem_statement || raw.problemStatement || raw.description || "",
    proposedSolution: raw.proposed_solution || raw.proposedSolution || raw.description || "",
    architecture: raw.architecture || "Cloud & Edge Architecture",
    hardware: raw.hardware || "Standard campus laboratory development boards.",
    stage: raw.stage || "Prototype",
    bom: parsedBom.length ? parsedBom : [
      { item: "Compute Core", spec: "Edge Gateway / Cloud VM", qty: 1, cost: "₹4,500" },
      { item: "Sensor Suite", spec: "Multi-parameter telemetry", qty: 2, cost: "₹1,800" }
    ],
    roles: raw.roles || raw.teamSlots || [
      { role_title: "Backend Developer", skills_required: "Python, SQLite" },
      { role_title: "Frontend Lead", skills_required: "HTML5, Tailwind CSS, JavaScript" }
    ],
    teamSlots: (raw.roles || raw.teamSlots || []).map(r => ({
      role: r.role_title || r.role || "Technical Lead",
      status: r.status || "Available",
      skills: r.skills_required || r.skills || "Engineering"
    })),
    interestedUsers: raw.interested_users || raw.interestedUsers || [
      { student_name: "Pooja Hegde", student_id: "4NI21IS045", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFW21bJ0r1x2GgN0E_3x4y5z6" },
      { student_name: "Aditya Verma", student_id: "4NI21EC012", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1_q2w3e4r5t6y7u8" }
    ]
  };
}


// LocalStorage Keys for State Management
const STORAGE_KEYS = {
  UPVOTES: 'idea_vault_upvotes',
  INTERESTS: 'idea_vault_interests',
  BOOKMARKS: 'idea_vault_bookmarks',
  CUSTOM_IDEAS: 'idea_vault_custom_ideas',
  USER_PROFILE: 'idea_vault_user_profile',
  SETTINGS: 'idea_vault_settings'
};

/**
 * Default Settings
 */
const DEFAULT_SETTINGS = {
  theme: "light",
  accent: "indigo",
  email_notifs: 1,
  in_app_notifs: 1,
  digest_frequency: "weekly",
  two_factor_enabled: 1,
  connected_github: "rohansharma-nie",
  connected_scholar: "0009-0004-9122-481X",
  connected_ieee: 0,
  sessions: [
    {
      id: "sess_1",
      device: "MacBook Pro 14\" • macOS Sonoma",
      browser: "Chrome 124.0.0",
      location: "NIE South Campus Wi-Fi (Academic Block C)",
      ip: "172.16.42.108",
      is_current: true,
      last_active: "Just now"
    },
    {
      id: "sess_2",
      device: "Dell OptiPlex 7090 • Ubuntu 22.04 LTS",
      browser: "Firefox 125.0",
      location: "IoT Research Cell (Room 304)",
      ip: "172.16.18.52",
      is_current: false,
      last_active: "4 hours ago"
    }
  ]
};

/**
 * Default Student Profile
 */
const DEFAULT_PROFILE = {
  name: "Rohan Sharma",
  shortName: "Rohan S.",
  usn: "4NI21CS089",
  email: "rohan.s.cse21@nie.ac.in",
  department: "Computer Science & Engineering (CSE)",
  batch: "Class of 2025 (8th Semester - Capstone Final)",
  batchShort: "CSE '25",
  campus: "NIE South Campus (Manandavadi Road)",
  cgpa: "8.92 / 10.0",
  showCgpa: true,
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR",
  github: "rohansharma-nie",
  website: "https://rohansharma.dev",
  linkedin: "rohansharma-cse",
  scholar: "scholar.google.com/citations?user=nie_cs",
  openForCollab: true,
  teamingObjective: "Actively looking for Hardware / ECE Co-Founders for Smart Grid Micro-Inverter project.",
  skills: ["React.js", "Python 3.11", "FastAPI", "PyTorch", "ESP32 Firmware", "Docker", "PostgreSQL"],
  desiredRoles: ["Backend / Cloud Architect", "ML Edge Engineer"],
  authorizedLabs: ["C-Block IoT Research Cell", "Embedded Systems Lab 3"]
};

/**
 * 6 Built-in Mock Ideas
 * Note: Ideas with ID 1 and ID 2 are near-duplicates for duplicate detection testing.
 */
const SAMPLE_IDEAS = [
  {
    id: "1",
    nieId: "NIE-25-MECH-042",
    title: "Automated Hostel Mess Food Waste Auditor with Computer Vision",
    category: "IoT",
    categoriesBadge: "IoT • AI/ML",
    department: "Mechanical Engineering",
    departmentShort: "Mech Dept",
    authorName: "Ananya Deshmukh",
    authorBatch: "Mech '25",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8BIDPilrvdunirzpmkrPuSDoGxhC1GXtrzgSHR3xV-BIKlAbJ8zDBLsUQP11ACjy51mHCnOMkUVijCFIFCpGAzVKMunJbW_WyiJKDt43R7yp2BJGhBmtcbPMJ-aaLY7gxsHEev3ODT7cpKnfkEbRsjhAIYe0prPHfp_9NoSGrIltcHsFr6A-qRD9eCUHgAPDElwu_ZfEup3tz-YXUkjR9vCyg6Wwt644NC7fMkrv_",
    authorEmail: "ananya.22me014@nie.ac.in",
    description: "Overhead camera tracking tray returns at Mysuru campus hostel mess to quantify daily wastage, categorizing food types through edge OpenCV modules and recommending dynamic mess contractor recipe scaling.",
    problemStatement: "In the NIE South Campus dining halls, an estimated 120 kg of prepared food is discarded daily. Kitchen management currently relies on static spreadsheet logs recorded at the end of each week, offering zero actionable correlation between day-to-day menu options and actual plate remnants. Without a rapid feedback loop, kitchen procurement teams repeatedly over-purchase perishable staples like sambar vegetables, rice, and fresh dairy.",
    architecture: "Dual stereoscopic RGB cameras positioned over tray conveyor belts stream 1080p frames to an edge NVIDIA Jetson / Raspberry Pi 4 compute node. Frames are processed using a fine-tuned MobileNetV3 model to segment plate remnants into 4 classes (rice, bread, curry, dry waste). Load cells beneath the tray return chute register gross weight deltas at 10Hz to correlate volumetric estimates with empirical weight.",
    hardware: "Raspberry Pi 4 (8GB), Raspberry Pi High Quality Camera Module (12.3MP), HX711 Load Cell Tare Amplifier, 50kg Strain Gauge Load Sensors, 10.1 inch Ruggedized Capacitive Touch Display.",
    tags: ["IoT", "AI/ML", "OpenCV", "RaspberryPi"],
    upvotes: 71,
    interests: 15,
    teamSlots: 4,
    stage: "Prototype",
    createdAt: "2025-02-12",
    timeAgo: "2 weeks ago",
    metrics: {
      campusWaste: "~120 kg/day",
      campusWasteSub: "Hostel Block 1 & 2",
      latency: "< 140ms",
      latencySub: "Edge device processing",
      savings: "₹ 42,000 /mo",
      savingsSub: "Procurement optimization"
    },
    roles: [
      {
        title: "Seeking 1 ECE Student",
        description: "Assist with load cell tare calibration, high-vibration damping on the mechanical collection ramp, and I2C signal shielding."
      },
      {
        title: "Seeking 1 CSE/AIML Student",
        description: "Optimize MobileNet food remnant segmentation model for low-latency edge inference on Raspberry Pi."
      }
    ],
    interestedStudents: [
      {
        name: "Soham",
        role: "Backend / Cloud",
        branch: "CSE, 3rd Year (B.Tech)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5eVXxn04nuxNzMUS5xny0NJ1rTCHHvCpWBREgSGGy1TPHUwyy8HUyNmToUkHvbRV9imb5iHrSKN3-VhqvzT-C5bUdvDtVq_--4scaCkYGKJFdRG9_rz7L6qHJ7Z9ZF-i9Z-QokEIq-zYAexynLAar_nH2X4-eLvNVsytHu26ymABB2ggX5AtjRmalNGSsVboCy5PSnO6U7BzTdykl-zSfr3wMNO1GPsi-AGzJKQFx"
      },
      {
        name: "Anusha",
        role: "Embedded / Sensors",
        branch: "ECE, 2rd Year (B.Tech)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcu7gqjJ-xSHPI5eY2O-PwJ7Aj6umw1pjTPjGTEENXxIcoggjWbssxLZF_BRS-QNJ6RH3mJyw0SKUdIXVriGH4kC-tmTErhwEX8B_0JkTEGAIOhAWrlMishNbv8gm8PC2VZP31yRWcdA-asoB-JOW_EVUDHv5wvf-pgbvJlqMEkFydPaM5xv2bh0BaFxYSQnGG3kLVdOHk8UANA8hAg8mMn0EVvb_N5obubKFOo549"
      },
      {
        name: "Ramcharan K A",
        role: "Model Opt.",
        branch: "AIML, 2nd Year (B.Tech)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7nipV0oZtPOK22a9hQBlMgZyz9LKoBhybrnRz-jWrJdMLkvMRYWDR6dnPxY4uY1x6hqnreF4YThoTaomcPrbBtCwgu7z4UMgyyqGMpvvxOXMbxdtpFReRuJ_DOuwYQUgzMI_sdsHH9v_c_0zlRGj_sQmdFQSdPVVBFdqt7oy2aFCbdAiNxLyKZEBa8xV-QuoTh3wqUWvDD9jPPb5m2Jms4LHH5-U-bH_kiD50Pvyg"
      },
      {
        name: "Darshan Gowda",
        role: "Architecture",
        branch: "ISE, 4th Year (B.Tech)",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsBMamRbCF7WsWlFw9_xOStF7vgDOCJqsfIFJnq4BhH9IiNL_qLmpnnZOtwKQ-wRq6URYAgx8o9WzhRRQ5S7kRf11JIZXpjITXXbZyyU7BYdfYPEJ1M3EaeNlq2RnohXbSNf5_MggwneQqtYs6g_yuSD456_nJbySiD9LMR497oHdYRzCLKzJfLs1eleOQepqYX_0m8wnbJnUdzexhdzsabYws14cHAOF5Fesks5ee"
      }
    ]
  },
  {
    id: "2",
    nieId: "NIE-25-CSE-018",
    title: "Smart Hostel Dining Waste Analytics & Tracking Platform",
    category: "IoT",
    categoriesBadge: "IoT • Web",
    department: "Computer Science & Engineering",
    departmentShort: "CSE Dept",
    authorName: "Vikram Shenoy",
    authorBatch: "CSE '25",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5eVXxn04nuxNzMUS5xny0NJ1rTCHHvCpWBREgSGGy1TPHUwyy8HUyNmToUkHvbRV9imb5iHrSKN3-VhqvzT-C5bUdvDtVq_--4scaCkYGKJFdRG9_rz7L6qHJ7Z9ZF-i9Z-QokEIq-zYAexynLAar_nH2X4-eLvNVsytHu26ymABB2ggX5AtjRmalNGSsVboCy5PSnO6U7BzTdykl-zSfr3wMNO1GPsi-AGzJKQFx",
    authorEmail: "vikram.22cs089@nie.ac.in",
    description: "Smart tray scale and overhead image scanner for hostel dining halls to monitor student food waste, analyze daily food waste trends, and provide analytics dashboard for canteen managers.",
    problemStatement: "Massive volume of food discarded at hostel canteens during dinner service without transparent metrics for catering staff or hostel wardens.",
    architecture: "ESP32-CAM and HX711 weight sensors connected to Node.js backend reporting daily discarded food mass to a cloud dashboard.",
    hardware: "ESP32, HX711 Module, Load Cells, ESP32-CAM.",
    tags: ["IoT", "Web", "Analytics", "ESP32"],
    upvotes: 34,
    interests: 8,
    teamSlots: 2,
    stage: "Concept",
    createdAt: "2025-02-14",
    timeAgo: "1 week ago",
    metrics: {
      campusWaste: "~100 kg/day",
      campusWasteSub: "Hostel Block 3",
      latency: "< 250ms",
      latencySub: "Wi-Fi Telemetry",
      savings: "₹ 35,000 /mo",
      savingsSub: "Estimated catering reduction"
    },
    roles: [
      {
        title: "Seeking 1 Frontend Developer",
        description: "Build clean reporting charts using Chart.js or Tailwind for canteen management."
      }
    ],
    interestedStudents: []
  },
  {
    id: "3",
    nieId: "NIE-25-ECE-105",
    title: "Smart Campus EV Shuttle Tracker with Crowding Heatmap",
    category: "IoT",
    categoriesBadge: "IoT • Web",
    department: "Electronics & Communication Engineering",
    departmentShort: "ECE Dept",
    authorName: "Arjun Gowda",
    authorBatch: "ECE '25",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7nipV0oZtPOK22a9hQBlMgZyz9LKoBhybrnRz-jWrJdMLkvMRYWDR6dnPxY4uY1x6hqnreF4YThoTaomcPrbBtCwgu7z4UMgyyqGMpvvxOXMbxdtpFReRuJ_DOuwYQUgzMI_sdsHH9v_c_0zlRGj_sQmdFQSdPVVBFdqt7oy2aFCbdAiNxLyKZEBa8xV-QuoTh3wqUWvDD9jPPb5m2Jms4LHH5-U-bH_kiD50Pvyg",
    authorEmail: "arjun.22ec012@nie.ac.in",
    description: "Real-time GPS tracking of NIE south-campus shuttles using ESP32 with predictive seat occupancy and ETA alerts for students.",
    problemStatement: "Students waste 15-20 minutes waiting for campus shuttle buses between north and south campuses with no ETA visibility or crowding indicators.",
    architecture: "GPS NEO-6M module transmitting telemetry over 4G LTE SIM7600 to a Firebase Realtime Database and React PWA with passenger break-beam counting.",
    hardware: "ESP32 WROOM, SIM7600 4G Module, NEO-6M GPS, IR Break-beam passenger counter.",
    tags: ["IoT", "Web", "ESP32", "React"],
    upvotes: 84,
    interests: 19,
    teamSlots: 3,
    stage: "Prototype",
    createdAt: "2025-02-10",
    timeAgo: "2 weeks ago",
    metrics: {
      campusWaste: "0 min",
      campusWasteSub: "Schedule Disruption",
      latency: "< 2.0s",
      latencySub: "Cellular GPS telemetry",
      savings: "15 min/trip",
      savingsSub: "Student waiting time saved"
    },
    roles: [
      {
        title: "Seeking 1 Flutter App Dev",
        description: "Develop lightweight Android student alert app for real-time bus arrivals."
      }
    ],
    interestedStudents: []
  },
  {
    id: "4",
    nieId: "NIE-24-ISE-077",
    title: "Automated VTU CGPA & Placement Eligibility Predictor",
    category: "Web",
    categoriesBadge: "Web • AI/ML",
    department: "Information Science & Engineering",
    departmentShort: "ISE Dept",
    authorName: "Priya Sharma",
    authorBatch: "ISE '24",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcu7gqjJ-xSHPI5eY2O-PwJ7Aj6umw1pjTPjGTEENXxIcoggjWbssxLZF_BRS-QNJ6RH3mJyw0SKUdIXVriGH4kC-tmTErhwEX8B_0JkTEGAIOhAWrlMishNbv8gm8PC2VZP31yRWcdA-asoB-JOW_EVUDHv5wvf-pgbvJlqMEkFydPaM5xv2bh0BaFxYSQnGG3kLVdOHk8UANA8hAg8mMn0EVvb_N5obubKFOo549",
    authorEmail: "priya.21is045@nie.ac.in",
    description: "Web portal aggregating internal marks and VTU schemas to forecast semester GPA and match eligible Tier-1 placement drives.",
    problemStatement: "Students miss Tier-1 placement eligibility criteria due to inaccurate GPA conversions and shifting VTU 2021/2022 scheme credit requirements.",
    architecture: "FastAPI REST API with credit conversion algorithms and scikit-learn models matching student CGPA to hiring drive cutoffs.",
    hardware: "Cloud Hosted (GCP Cloud Run).",
    tags: ["Web", "AI/ML", "Python", "FastAPI"],
    upvotes: 126,
    interests: 38,
    teamSlots: 2,
    stage: "Validation",
    createdAt: "2025-01-28",
    timeAgo: "3 weeks ago",
    metrics: {
      campusWaste: "98.4%",
      campusWasteSub: "Forecast Accuracy",
      latency: "< 80ms",
      latencySub: "API Response",
      savings: "500+ Students",
      savingsSub: "Benefited in 2024 Drives"
    },
    roles: [
      {
        title: "Seeking 1 Fullstack Engineer",
        description: "Integrate student portal with single sign-on (SSO) and exportable PDF report cards."
      }
    ],
    interestedStudents: []
  },
  {
    id: "5",
    nieId: "NIE-26-AIML-031",
    title: "AI-Powered Kannada to English Speech Translator for Classroom Labs",
    category: "AI/ML",
    categoriesBadge: "AI/ML • Edge AI",
    department: "Artificial Intelligence & Machine Learning",
    departmentShort: "AIML Dept",
    authorName: "Karthik Rao",
    authorBatch: "AIML '26",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsBMamRbCF7WsWlFw9_xOStF7vgDOCJqsfIFJnq4BhH9IiNL_qLmpnnZOtwKQ-wRq6URYAgx8o9WzhRRQ5S7kRf11JIZXpjITXXbZyyU7BYdfYPEJ1M3EaeNlq2RnohXbSNf5_MggwneQqtYs6g_yuSD456_nJbySiD9LMR497oHdYRzCLKzJfLs1eleOQepqYX_0m8wnbJnUdzexhdzsabYws14cHAOF5Fesks5ee",
    authorEmail: "karthik.23ai019@nie.ac.in",
    description: "Edge-based Whisper fine-tuned model running on Raspberry Pi for multilingual laboratory viva and instruction transcription.",
    problemStatement: "First-year engineering students from rural regional medium backgrounds encounter language friction during lab viva sessions and verbal grading.",
    architecture: "Quantized ONNX Whisper model streaming audio via WebRTC to local classroom workstation with customized Kannada-English technical glossaries.",
    hardware: "Raspberry Pi 5, USB Condenser Mic Array, Google Coral USB Accelerator.",
    tags: ["AI/ML", "Edge AI", "PyTorch", "Whisper"],
    upvotes: 95,
    interests: 24,
    teamSlots: 3,
    stage: "Prototype",
    createdAt: "2025-02-05",
    timeAgo: "2 weeks ago",
    metrics: {
      campusWaste: "91%",
      campusWasteSub: "Kannada BLEU Score",
      latency: "< 350ms",
      latencySub: "Real-time edge transcription",
      savings: "4 Dept Labs",
      savingsSub: "Pilot deployment ready"
    },
    roles: [
      {
        title: "Seeking 1 NLP Researcher",
        description: "Expand acoustic corpus with colloquial engineering technical terminology in Kannada."
      }
    ],
    interestedStudents: []
  },
  {
    id: "6",
    nieId: "NIE-25-CSE-094",
    title: "CampusPeer: Micro-Tutoring & Peer Notes Marketplace",
    category: "App",
    categoriesBadge: "App • EdTech",
    department: "Computer Science & Engineering",
    departmentShort: "CSE Dept",
    authorName: "Rohan Sharma",
    authorBatch: "CSE '25",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR",
    authorEmail: "rohan.s.cse21@nie.ac.in",
    description: "Decentralized study exchange app for NIE students to find verified previous semester handwritten lab records and tutor sessions.",
    problemStatement: "Students scramble across informal WhatsApp groups for reliable previous years' lab manuals, assignment solutions, and peer tutoring before exams.",
    architecture: "Flutter cross-platform app backed by Firebase Cloud Firestore, featuring cryptographic student identity verification and peer rating.",
    hardware: "Mobile (Android / iOS).",
    tags: ["App", "Flutter", "Firebase", "EdTech"],
    upvotes: 110,
    interests: 42,
    teamSlots: 3,
    stage: "Validation",
    createdAt: "2025-02-01",
    timeAgo: "3 weeks ago",
    metrics: {
      campusWaste: "4.8 / 5.0",
      campusWasteSub: "Student Tutor Rating",
      latency: "< 100ms",
      latencySub: "P2P Query Response",
      savings: "1,200+ Notes",
      savingsSub: "Archived & Verified"
    },
    roles: [
      {
        title: "Seeking 1 UI/UX Designer",
        description: "Design accessible mobile onboarding flow and interactive tutoring scheduler."
      }
    ],
    interestedStudents: []
  }
];

// Helper: Get Stored Set from LocalStorage
function getStoredSet(key) {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return new Set();
  }
}

// Helper: Save Set to LocalStorage
function saveStoredSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// Helper: Get user profile
function getUserProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading profile:", e);
    return DEFAULT_PROFILE;
  }
}

// Helper: Save user profile
function saveUserProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error("Error saving profile:", e);
  }
}

// Helper: Get locally created custom ideas
function getCustomIdeas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_IDEAS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading custom ideas:", e);
    return [];
  }
}

// Helper: Save custom idea locally in mock mode
function saveCustomIdea(idea) {
  try {
    const current = getCustomIdeas();
    current.unshift(idea);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_IDEAS, JSON.stringify(current));
  } catch (e) {
    console.error("Error saving custom idea:", e);
  }
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconName = 'info';
  if (type === 'success') iconName = 'check_circle';
  if (type === 'error') iconName = 'error';
  if (type === 'warning') iconName = 'warning';

  toast.innerHTML = `
    <span class="material-symbols-outlined text-[1.25rem]">${iconName}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * API Client Functions
 */

/**
 * Fetch all ideas (GET /ideas)
 */
async function fetchIdeas() {
  if (USE_MOCK) {
    const custom = getCustomIdeas();
    const all = [...custom, ...SAMPLE_IDEAS];

    const upvotedSet = getStoredSet(STORAGE_KEYS.UPVOTES);
    const interestedSet = getStoredSet(STORAGE_KEYS.INTERESTS);

    return all.map(idea => {
      const isUpvoted = upvotedSet.has(idea.id);
      const isInterested = interestedSet.has(idea.id);
      return {
        ...idea,
        isUpvoted,
        isInterested,
        upvotes: idea.upvotes + (isUpvoted ? 1 : 0),
        interests: idea.interests + (isInterested ? 1 : 0)
      };
    });
  }

  try {
    const response = await fetch(`${API_BASE}/ideas`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data.map(adaptBackendIdea) : [];
  } catch (err) {
    console.warn("Backend API unavailable, falling back to mock mode:", err);
    showToast("Backend unavailable. Loaded offline campus registry.", "warning");
    return SAMPLE_IDEAS.map(adaptBackendIdea);
  }
}

/**
 * Fetch a single idea by ID
 */
async function fetchIdeaById(id) {
  if (USE_MOCK) {
    const all = [...getCustomIdeas(), ...SAMPLE_IDEAS];
    const idea = all.find(item => String(item.id) === String(id));
    if (!idea) return null;

    const upvotedSet = getStoredSet(STORAGE_KEYS.UPVOTES);
    const interestedSet = getStoredSet(STORAGE_KEYS.INTERESTS);
    const isUpvoted = upvotedSet.has(idea.id);
    const isInterested = interestedSet.has(idea.id);

    return adaptBackendIdea({
      ...idea,
      isUpvoted,
      isInterested,
      upvotes: idea.upvotes + (isUpvoted ? 1 : 0),
      interests: idea.interests + (isInterested ? 1 : 0)
    });
  }

  try {
    const response = await fetch(`${API_BASE}/ideas/${id}`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const raw = await response.json();
    return adaptBackendIdea(raw);
  } catch (err) {
    console.warn("Backend API fetchIdeaById failed:", err);
    const found = SAMPLE_IDEAS.find(item => String(item.id) === String(id));
    return found ? adaptBackendIdea(found) : null;
  }
}

/**
 * Fetch Leaderboard Data (GET /leaderboard)
 */
async function getLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("getLeaderboard fallback:", err);
    return null;
  }
}

/**
 * Fetch Open Teammate Roles (GET /roles)
 */
async function getRoles(skillFilter = '') {
  try {
    const url = skillFilter ? `${API_BASE}/roles?skill=${encodeURIComponent(skillFilter)}` : `${API_BASE}/roles`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("getRoles fallback:", err);
    return [];
  }
}

/**
 * Fetch Notifications Stream (GET /notifications)
 */
async function getNotifications(userId = '4NI21CS089') {
  try {
    const res = await fetch(`${API_BASE}/notifications?user_id=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("getNotifications fallback:", err);
    return { notifications: [], unread_count: 0 };
  }
}

/**
 * Mark a single notification read
 */
async function markNotificationRead(id) {
  try {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Mark all notifications read
 */
async function markAllNotificationsRead(userId = '4NI21CS089') {
  try {
    const res = await fetch(`${API_BASE}/notifications/read-all?user_id=${encodeURIComponent(userId)}`, { method: 'POST' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * Theme & Accent Styling Manager
 */
function applyTheme(theme, accent) {
  const currentTheme = theme || localStorage.getItem('ideavault_theme') || 'light';
  const isDark = currentTheme === 'dark' || (currentTheme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('ideavault_theme', currentTheme);

  if (accent) {
    localStorage.setItem('ideavault_accent', accent);
  }
}

/**
 * Sync Header Profile Display
 */
function syncHeaderProfile(profile) {
  if (!profile) profile = getUserProfile();
  document.querySelectorAll('#headerProfileAvatar, img[alt*="Avatar"]').forEach(img => {
    if (profile.avatar) img.src = profile.avatar;
  });
  const nameEl = document.getElementById('headerProfileName');
  if (nameEl && profile.name) {
    const parts = profile.name.split(' ');
    nameEl.textContent = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
  }
  const batchEl = document.getElementById('headerProfileBatch');
  if (batchEl) {
    batchEl.textContent = profile.batchShort || "CSE '25";
  }
}

/**
 * Get Profile
 */
async function getProfile(studentId = '4NI21CS089') {
  try {
    const res = await fetch(`${API_BASE}/profile?student_id=${encodeURIComponent(studentId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.name) {
      const merged = { ...getUserProfile(), ...data, usn: data.student_id || studentId };
      saveUserProfile(merged);
      syncHeaderProfile(merged);
      return merged;
    }
    return getUserProfile();
  } catch (err) {
    console.warn("getProfile fallback:", err);
    return getUserProfile();
  }
}

/**
 * Update Profile
 */
async function updateProfile(profileData) {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();
    saveUserProfile(profileData);
    syncHeaderProfile(profileData);
    return updated;
  } catch (err) {
    console.warn("updateProfile fallback:", err);
    saveUserProfile(profileData);
    syncHeaderProfile(profileData);
    return { message: "Saved locally" };
  }
}

/**
 * Get Student Settings
 */
async function getSettings(studentId = '4NI21CS089') {
  try {
    const res = await fetch(`${API_BASE}/settings?student_id=${encodeURIComponent(studentId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data));
    if (data.theme) applyTheme(data.theme, data.accent);
    return data;
  } catch (err) {
    const cached = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const data = cached ? JSON.parse(cached) : DEFAULT_SETTINGS;
    if (data.theme) applyTheme(data.theme, data.accent);
    return data;
  }
}

/**
 * Update Student Settings
 */
async function updateSettings(settingsData) {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settingsData));
    if (settingsData.theme) applyTheme(settingsData.theme, settingsData.accent);
    return updated;
  } catch (err) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settingsData));
    if (settingsData.theme) applyTheme(settingsData.theme, settingsData.accent);
    return { message: "Saved locally" };
  }
}

/**
 * Change Student Password
 */
async function changePassword(currentPassword, newPassword, studentId = '4NI21CS089') {
  const res = await fetch(`${API_BASE}/settings/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, current_password: currentPassword, new_password: newPassword })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update password");
  return data;
}

/**
 * Revoke Active Campus Sessions
 */
async function revokeSession(sessionId, allOthers = false, studentId = '4NI21CS089') {
  const res = await fetch(`${API_BASE}/settings/sessions/revoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, session_id: sessionId, all_others: allOthers })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to revoke session");
  return data;
}

/**
 * Duplicate Checker (POST /check-duplicate)
 */
async function checkDuplicate(title, description, category) {
  if (USE_MOCK) {
    await simulateNetworkDelay(400);
    const all = [...getCustomIdeas(), ...SAMPLE_IDEAS];
    const incomingText = `${title} ${description}`.toLowerCase();
    const incomingTokens = new Set(incomingText.split(/\W+/).filter(w => w.length > 2));
    let bestMatch = null;
    let highestScore = 0;
    for (const existing of all) {
      const existingText = `${existing.title} ${existing.description}`.toLowerCase();
      const existingTokens = new Set(existingText.split(/\W+/).filter(w => w.length > 2));
      let common = 0;
      incomingTokens.forEach(t => { if (existingTokens.has(t)) common++; });
      const union = new Set([...incomingTokens, ...existingTokens]).size;
      const score = union > 0 ? Math.round((common / union) * 100) : 0;
      if (score > highestScore) { highestScore = score; bestMatch = existing; }
    }
    if (highestScore >= 40 && bestMatch) {
      return { isDuplicate: true, similarity: highestScore, similarity_score: highestScore, matchedIdea: bestMatch };
    }
    return { isDuplicate: false, similarity: highestScore, matchedIdea: null };
  }

  try {
    const response = await fetch(`${API_BASE}/check-duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category })
    });
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
    const data = await response.json();
    return {
      isDuplicate: data.is_duplicate || data.duplicate || false,
      similarity: data.similarity_score || 0,
      similarity_score: data.similarity_score || 0,
      matchedIdea: data.similar_idea || data.matchedIdea || null
    };
  } catch (err) {
    console.warn("Backend check-duplicate failed:", err);
    return { isDuplicate: false, similarity: 0, matchedIdea: null };
  }
}

/**
 * Publish New Idea (POST /ideas)
 */
async function createIdea(ideaPayload) {
  const profile = getUserProfile();

  if (USE_MOCK) {
    const newId = `nie-${Date.now().toString().slice(-5)}`;
    const newIdea = {
      id: newId,
      nieId: `NIE-25-${ideaPayload.departmentShort?.replace(/\s+/g, '').toUpperCase() || 'ENG'}-${Math.floor(100 + Math.random() * 900)}`,
      title: ideaPayload.title,
      category: ideaPayload.category || 'Other',
      categoriesBadge: `${ideaPayload.category} • Capstone`,
      department: ideaPayload.department || 'Computer Science & Engineering',
      departmentShort: ideaPayload.departmentShort || 'CSE Dept',
      authorName: profile.name,
      authorBatch: profile.batchShort,
      authorAvatar: profile.avatar,
      authorEmail: profile.email,
      description: ideaPayload.description,
      problemStatement: ideaPayload.problemStatement || ideaPayload.description,
      architecture: ideaPayload.architecture || "Modular microservices architecture with edge telemetry.",
      hardware: ideaPayload.hardware || "Standard laboratory development boards.",
      tags: ideaPayload.tags && ideaPayload.tags.length ? ideaPayload.tags : [ideaPayload.category, "NIE"],
      upvotes: 1,
      interests: 0,
      teamSlots: 3,
      stage: ideaPayload.stage || "Concept",
      createdAt: new Date().toISOString().split('T')[0],
      timeAgo: "Just now",
      metrics: {
        campusWaste: "Pending",
        campusWasteSub: "Baseline evaluation",
        latency: "< 200ms",
        latencySub: "Target runtime",
        savings: "Active",
        savingsSub: "Research underway"
      },
      roles: [
        {
          title: "Seeking 1 Technical Collaborator",
          description: "Assist with implementation, testing, and hardware interfacing."
        }
      ],
      interestedStudents: []
    };

    saveCustomIdea(newIdea);
    const upvotes = getStoredSet(STORAGE_KEYS.UPVOTES);
    upvotes.add(newId);
    saveStoredSet(STORAGE_KEYS.UPVOTES, upvotes);

    return { success: true, idea: newIdea };
  }

  try {
    const response = await fetch(`${API_BASE}/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...ideaPayload,
        author_name: profile.name,
        author_usn: profile.usn,
        author_batch: profile.batchShort,
        author_avatar: profile.avatar
      })
    });
    
    if (!response.ok) {
      if (response.status === 409) {
        const errData = await response.json();
        const err = new Error(errData.message || "Duplicate detected");
        err.isDuplicate = true;
        err.duplicate = true;
        err.similarity = errData.similarity_score;
        err.similarity_score = errData.similarity_score;
        err.matchedIdea = errData.similar_idea;
        err.similar_idea = errData.similar_idea;
        throw err;
      }
      throw new Error(`HTTP Error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Failed to post idea to backend:", err);
    throw err;
  }
}

/**
 * Upvote Idea (POST /ideas/:id/upvote)
 */
async function upvoteIdea(ideaId, buttonElement) {
  const upvotedSet = getStoredSet(STORAGE_KEYS.UPVOTES);
  const alreadyUpvoted = upvotedSet.has(ideaId);

  const countSpan = buttonElement ? buttonElement.querySelector('.vote-count') : null;
  let currentCount = countSpan ? parseInt(countSpan.textContent, 10) : 0;

  if (alreadyUpvoted) {
    upvotedSet.delete(ideaId);
    saveStoredSet(STORAGE_KEYS.UPVOTES, upvotedSet);
    if (countSpan) countSpan.textContent = Math.max(0, currentCount - 1);
    if (buttonElement) {
      buttonElement.classList.remove('btn-upvoted', 'bg-primary', 'text-on-primary');
      buttonElement.classList.add('bg-surface-container', 'text-on-surface');
      const icon = buttonElement.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.classList.remove('text-on-primary');
        icon.classList.add('text-primary');
      }
    }
    showToast("Vote removed", "info");
  } else {
    upvotedSet.add(ideaId);
    saveStoredSet(STORAGE_KEYS.UPVOTES, upvotedSet);
    if (countSpan) countSpan.textContent = currentCount + 1;
    if (buttonElement) {
      buttonElement.classList.add('btn-upvoted', 'bg-primary', 'text-on-primary');
      buttonElement.classList.remove('bg-surface-container', 'text-on-surface');
      const icon = buttonElement.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.classList.remove('text-primary');
        icon.classList.add('text-on-primary');
      }
    }
    showToast("Upvoted idea! Stored in your profile.", "success");
  }

  if (!USE_MOCK) {
    try {
      await fetch(`${API_BASE}/ideas/${ideaId}/upvote`, { method: 'POST' });
    } catch (e) {
      console.warn("Backend upvote failed:", e);
    }
  }
}

/**
 * Express Collaboration Interest (POST /ideas/:id/interest)
 */
async function interestIdea(ideaId, buttonElement) {
  const interestSet = getStoredSet(STORAGE_KEYS.INTERESTS);
  const alreadyInterested = interestSet.has(ideaId);

  const countSpan = buttonElement ? buttonElement.querySelector('.interest-count') : null;
  let currentCount = countSpan ? parseInt(countSpan.textContent, 10) : 0;

  if (alreadyInterested) {
    interestSet.delete(ideaId);
    saveStoredSet(STORAGE_KEYS.INTERESTS, interestSet);
    if (countSpan) countSpan.textContent = Math.max(0, currentCount - 1);
    if (buttonElement) {
      buttonElement.classList.remove('btn-interested', 'bg-secondary', 'text-on-secondary');
      buttonElement.classList.add('bg-secondary-container/30', 'text-on-secondary-container');
    }
    showToast("Collaboration interest withdrawn", "info");
  } else {
    interestSet.add(ideaId);
    saveStoredSet(STORAGE_KEYS.INTERESTS, interestSet);
    if (countSpan) countSpan.textContent = currentCount + 1;
    if (buttonElement) {
      buttonElement.classList.add('btn-interested', 'bg-secondary', 'text-on-secondary');
      buttonElement.classList.remove('bg-secondary-container/30', 'text-on-secondary-container');
    }
    showToast("Lead notified of your collaboration interest!", "success");
  }

  if (!USE_MOCK) {
    try {
      await fetch(`${API_BASE}/ideas/${ideaId}/interest`, { method: 'POST' });
    } catch (e) {
      console.warn("Backend interest request failed:", e);
    }
  }
}

/**
 * Bookmark Idea Toggle
 */
function toggleBookmark(ideaId, buttonElement) {
  const bookmarkSet = getStoredSet(STORAGE_KEYS.BOOKMARKS);
  const isBookmarked = bookmarkSet.has(ideaId);

  if (isBookmarked) {
    bookmarkSet.delete(ideaId);
    saveStoredSet(STORAGE_KEYS.BOOKMARKS, bookmarkSet);
    if (buttonElement) buttonElement.classList.remove('text-primary');
    showToast("Bookmark removed", "info");
  } else {
    bookmarkSet.add(ideaId);
    saveStoredSet(STORAGE_KEYS.BOOKMARKS, bookmarkSet);
    if (buttonElement) buttonElement.classList.add('text-primary');
    showToast("Idea bookmarked to your vault!", "success");
  }
}

/**
 * Global Profile Drawer / Popover Management
 * Replicates Stitch Screen: Account Menu & Profile Drawer
 */
function injectProfileDrawer() {
  if (document.getElementById('profile-drawer')) return;

  const profile = getUserProfile();

  const drawerContainer = document.createElement('div');
  drawerContainer.id = 'global-profile-drawer-root';
  drawerContainer.innerHTML = `
    <!-- Ambient Backdrop Scrim with Glass Blur -->
    <div class="fixed inset-0 top-16 z-40 bg-on-background/30 backdrop-blur-[3px] transition-opacity duration-300 hidden" id="profile-backdrop" onclick="IdeaVault.closeProfileDrawer()"></div>
    
    <!-- Anchored Profile Popover / Slide-Over Card Container -->
    <div class="fixed top-[4.25rem] right-4 md:right-8 lg:right-[max(2rem,calc((100vw-80rem)/2+2rem))] z-50 w-[calc(100vw-2rem)] sm:w-[410px] max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain bg-surface-container-lowest rounded-2xl shadow-2xl transition-all transform duration-300 origin-top-right flex flex-col hidden" id="profile-drawer">
      <!-- Top Accent Brand Bar -->
      <div class="h-1.5 w-full bg-gradient-to-r from-primary-container via-surface-tint to-secondary-container"></div>
      
      <div class="p-space-lg flex flex-col gap-space-md">
        <!-- 1. Header & Identity Section -->
        <div class="flex flex-col gap-space-sm">
          <div class="flex items-start justify-between gap-space-sm">
            <div class="flex items-center gap-space-md">
              <div class="relative shrink-0">
                <img alt="${profile.name} Avatar" class="w-14 h-14 rounded-full object-cover shadow-sm bg-surface-container" src="${profile.avatar}"/>
                <span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest" title="Active on Campus Network"></span>
              </div>
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-space-xs">
                  <h3 class="font-title-md text-title-md text-on-surface font-bold truncate">${profile.name}</h3>
                  <span class="material-symbols-outlined text-[1.125rem] text-primary" title="NIE Identity Verified">verified</span>
                </div>
                <p class="font-label-sm text-label-sm text-on-surface-variant font-medium mt-0.5 truncate">USN: ${profile.usn}</p>
                <p class="font-label-sm text-label-sm text-on-surface-variant truncate">B.E. Computer Science &amp; Engg.</p>
              </div>
            </div>
            <button aria-label="Close user menu" class="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors" onclick="IdeaVault.closeProfileDrawer()" type="button">
              <span class="material-symbols-outlined text-[1.25rem]">close</span>
            </button>
          </div>

          <!-- Badges & Campus Anchor -->
          <div class="flex flex-wrap items-center gap-space-xs mt-space-xs">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
              <span class="material-symbols-outlined text-[0.875rem]">school</span>
              ${profile.batchShort}
            </span>
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Verified NIE Undergrad
            </span>
          </div>

          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-1 text-on-surface-variant">
              <span class="material-symbols-outlined text-[1rem]">location_on</span>
              <span class="font-label-sm text-label-sm">NIE South Campus (Manandavadi Rd)</span>
            </div>
            <a class="inline-flex items-center gap-0.5 font-label-sm text-label-sm text-primary-container font-semibold hover:text-primary transition-colors" href="profile.html">
              Profile <span class="material-symbols-outlined text-[0.875rem]">chevron_right</span>
            </a>
          </div>
        </div>

        <!-- 2. Quick Innovation Stats Bar -->
        <div class="bg-surface-container-low rounded-xl p-space-sm grid grid-cols-3 gap-space-xs text-center">
          <div class="flex flex-col items-center justify-center py-space-xs px-1 cursor-pointer hover:bg-surface-container rounded-lg transition-colors" onclick="window.location.href='submissions.html'">
            <div class="flex items-baseline gap-1">
              <span class="font-headline-sm text-headline-sm text-on-surface font-bold">4</span>
              <span class="font-label-sm text-label-sm text-tertiary font-medium">(1 Rev)</span>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant text-[0.7rem] uppercase tracking-wider mt-0.5">Submissions</span>
          </div>
          <div class="flex flex-col items-center justify-center py-space-xs px-1 bg-surface-container-lowest/80 rounded-lg shadow-sm">
            <span class="font-headline-sm text-headline-sm text-primary-container font-bold">248</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant text-[0.7rem] uppercase tracking-wider mt-0.5">Endorsements</span>
          </div>
          <div class="flex flex-col items-center justify-center py-space-xs px-1 relative">
            <div class="flex items-center gap-1">
              <span class="font-headline-sm text-headline-sm text-on-surface font-bold">3</span>
              <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" title="Active Teammate Requests"></span>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant text-[0.7rem] uppercase tracking-wider mt-0.5">Inquiries</span>
          </div>
        </div>

        <!-- 3. Quick Navigation & Saved Items List -->
        <div class="flex flex-col gap-1">
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold px-2 mb-1">Workspace &amp; Portfolios</span>
          
          <a class="flex items-center justify-between px-space-sm py-2 rounded-xl hover:bg-surface-container-low transition-colors group" href="profile.html">
            <div class="flex items-center gap-space-sm">
              <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-[1.125rem]">manage_accounts</span>
              </div>
              <span class="font-title-sm text-title-sm text-on-surface font-medium">Profile &amp; Academic Settings</span>
            </div>
            <span class="material-symbols-outlined text-[1rem] text-outline">chevron_right</span>
          </a>

          <a class="flex items-center justify-between px-space-sm py-2 rounded-xl hover:bg-surface-container-low transition-colors group" href="settings.html">
            <div class="flex items-center gap-space-sm">
              <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-[1.125rem]">shield</span>
              </div>
              <span class="font-title-sm text-title-sm text-on-surface font-medium">Settings &amp; Security</span>
            </div>
            <span class="material-symbols-outlined text-[1rem] text-outline">chevron_right</span>
          </a>

          <a class="flex items-center justify-between px-space-sm py-2 rounded-xl hover:bg-surface-container-low transition-colors group" href="submissions.html">
            <div class="flex items-center gap-space-sm">
              <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-[1.125rem]">folder_open</span>
              </div>
              <span class="font-title-sm text-title-sm text-on-surface font-medium">My Submissions Dashboard</span>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">4 Projects</span>
          </a>

          <a class="flex items-center justify-between px-space-sm py-2 rounded-xl hover:bg-surface-container-low transition-colors group" href="leaderboard.html">
            <div class="flex items-center gap-space-sm">
              <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-[1.125rem]">leaderboard</span>
              </div>
              <span class="font-title-sm text-title-sm text-on-surface font-medium">Campus Leaderboard</span>
            </div>
            <span class="material-symbols-outlined text-[1rem] text-outline">chevron_right</span>
          </a>

          <a class="flex items-center justify-between px-space-sm py-2 rounded-xl hover:bg-surface-container-low transition-colors group" href="teammates.html">
            <div class="flex items-center gap-space-sm">
              <div class="w-8 h-8 rounded-lg bg-secondary-container/40 flex items-center justify-center text-on-secondary-container">
                <span class="material-symbols-outlined text-[1.125rem]">group_add</span>
              </div>
              <div class="flex flex-col text-left">
                <span class="font-title-sm text-title-sm text-on-surface font-medium leading-tight">Find Teammates</span>
                <span class="font-label-sm text-label-sm text-secondary font-semibold">Open Project Vacancies</span>
              </div>
            </div>
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
          </a>

          <a class="flex items-center justify-between px-space-sm py-2 rounded-xl hover:bg-surface-container-low transition-colors group" href="notifications.html">
            <div class="flex items-center gap-space-sm">
              <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                <span class="material-symbols-outlined text-[1.125rem]">notifications</span>
              </div>
              <span class="font-title-sm text-title-sm text-on-surface font-medium">Notification Center</span>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-error text-white font-label-sm text-label-sm">New</span>
          </a>
        </div>

        <!-- 4. Footer Actions -->
        <div class="pt-space-sm border-t border-surface-container flex items-center justify-between">
          <button class="font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors flex items-center gap-1" onclick="IdeaVault.showToast('Demo account session active', 'info')">
            <span class="material-symbols-outlined text-[1rem]">logout</span>
            <span>Sign Out</span>
          </button>
          <span class="font-label-sm text-label-sm text-outline">NIE Vault v2.4</span>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(drawerContainer);
}

function toggleProfileDrawer() {
  const drawer = document.getElementById('profile-drawer');
  const backdrop = document.getElementById('profile-backdrop');
  if (!drawer || !backdrop) {
    injectProfileDrawer();
    return toggleProfileDrawer();
  }

  const isHidden = drawer.classList.contains('hidden');
  if (isHidden) {
    drawer.classList.remove('hidden');
    backdrop.classList.remove('hidden');
  } else {
    drawer.classList.add('hidden');
    backdrop.classList.add('hidden');
  }
}

function closeProfileDrawer() {
  const drawer = document.getElementById('profile-drawer');
  const backdrop = document.getElementById('profile-backdrop');
  if (drawer) drawer.classList.add('hidden');
  if (backdrop) backdrop.classList.add('hidden');
}

/**
 * Initialize Header Profile Trigger On Load
 */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  syncHeaderProfile();
  injectProfileDrawer();

  // Attach click listener to profile buttons in header
  const profileLinks = document.querySelectorAll('[data-path="profile-settings"], [data-path="profile-trigger"], .profile-avatar-btn');
  profileLinks.forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      toggleProfileDrawer();
    });
  });
});

// Global Export
window.IdeaVault = {
  API_BASE,
  USE_MOCK,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  DEFAULT_PROFILE,
  fetchIdeas,
  fetchIdeaById,
  checkDuplicate,
  createIdea,
  upvoteIdea,
  interestIdea,
  toggleBookmark,
  showToast,
  getStoredSet,
  getUserProfile,
  saveUserProfile,
  toggleProfileDrawer,
  closeProfileDrawer,
  getLeaderboard,
  getRoles,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  changePassword,
  revokeSession,
  applyTheme,
  syncHeaderProfile
};
