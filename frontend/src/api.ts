import {
  DuplicateCheckResult,
  IdeaItem,
  LeaderboardData,
  NotificationItem,
  OpenRole,
  UserProfile,
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Seeded local fallback data for robust Vercel static deployment or offline preview
const LOCAL_USER: UserProfile = {
  id: 'usr-rohan-cse',
  usn: '4NI21CS142',
  name: 'Rohan S.',
  email: 'rohan.cs21@nie.ac.in',
  department: 'Computer Science & Engineering',
  batch: "CSE '25",
  cgpa: 9.32,
  role: 'Student Innovator',
  avatar_url:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR',
  github_url: 'https://github.com/rohan-nie',
  linkedin_url: 'https://linkedin.com/in/rohan-s-nie',
  points: 485,
  available_for_collab: true,
  lab_clearances: 'IoT Lab (Block C), High Performance Computing Hub',
};

const LOCAL_IDEAS: IdeaItem[] = [
  {
    id: 'idea-mess-waste-auditor',
    title: 'Automated Hostel Mess Food Waste Auditor with Computer Vision',
    category: 'IoT',
    department: 'ECE',
    maturity: 'Prototype',
    summary:
      'Overhead camera tracking tray returns at Mysuru campus hostel mess to quantify daily wastage, categorizing food types through edge OpenCV modules and recommending dynamic mess contractor recipe scaling.',
    problem_statement:
      'Over 65 kg of edible food is discarded daily across hostel dining halls at NIE Mysuru without objective per-meal quantification. Traditional manual audits are inaccurate, unhygienic, and unable to attribute wastage to specific menu preparations or predict optimal procurement quantities.',
    architecture_description:
      'Raspberry Pi 4 running lightweight MobileNet-V2 food classification model synchronized with load cell strain gauge matrix underneath return conveyors. InfluxDB records per-tray discarded weight, feeding a FastAPI analytics server that generates predictive replenishment schedules.',
    tech_tags: 'IoT, Computer Vision, Raspberry Pi, Python, OpenCV, MQTT, InfluxDB',
    bill_of_materials:
      'Raspberry Pi 4 4GB Model B, 4x 10kg Load Cells with HX711 ADCs, Sony IMX219 8MP Camera, Custom 3D Printed IP54 Enclosure',
    metrics_json:
      '{"daily_waste_reduction": "45 kg", "sensor_latency": "120ms", "annual_cost_savings": "₹3.8L"}',
    status: 'Approved & Open',
    faculty_mentor: 'Dr. Rohini S. (Assoc. Prof., ECE Department)',
    lab_status: 'Active Testing at Diamond Jubilee Hostel Mess',
    author_id: 'usr-ananya-mech',
    author_name: 'Ananya Deshmukh',
    author_dept: 'Mechanical Engineering',
    author_batch: "Mech '25",
    author_avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC9gz_UabGXkeRvqL1i7nOT6UyLfuL_SH8eZPE_wZ4SgHS-svxW-c4cSsVfrXOmsv_UMwL89LyvhQd6RjN3T6dqNbTH2QXIIVf8Ofk04WXCA6MJs41b5MoXPXXfnT9IEkZOltCI_mzcnyI0XQi_swthskYsj8QM4NhffhNiMrqWV-cGk_E4d2wpNHtX9RbdTbvbwMBTLUVHIYENln8Va3v7Ld2xjUy_Zn-aS27szyiF',
    upvotes_count: 84,
    interested_count: 19,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    open_roles: [
      {
        id: 'role-1',
        idea_id: 'idea-mess-waste-auditor',
        role_title: 'Computer Vision & Edge ML Engineer',
        department_required: 'CSE / AIML',
        skills_required: 'OpenCV, TensorFlow Lite, Python, Edge TPU',
        total_slots: 2,
        filled_slots: 0,
        kickoff_date: 'Immediate Sprint',
      },
      {
        id: 'role-2',
        idea_id: 'idea-mess-waste-auditor',
        role_title: 'Embedded Firmware & Sensor Developer',
        department_required: 'ECE',
        skills_required: 'C++, ESP32, Load Cells, SPI/I2C, FreeRTOS',
        total_slots: 1,
        filled_slots: 0,
        kickoff_date: 'Next Week',
      },
    ],
  },
  {
    id: 'idea-smart-energy-grid',
    title: 'Smart Campus Microgrid & Solar PV Battery Optimizer',
    category: 'IoT',
    department: 'CSE',
    maturity: 'Validation',
    summary:
      'Distributed IoT sensor network and real-time power routing across NIE North and South campus buildings, forecasting solar yields and shaving peak grid demand with lithium-ferro-phosphate storage.',
    problem_statement:
      'Unbalanced three-phase loads and non-coincident peak demands across South Campus academic blocks lead to high demand tariff penalties and suboptimal self-consumption of rooftop 250 kWp solar PV installations.',
    architecture_description:
      'ESP32 telemetry microcontrollers measuring real-time voltage, current, and THD via Modbus RS485. Data streams over campus LoRaWAN to a local server running an adaptive Model Predictive Control (MPC) dispatch algorithm managing grid peak shaving.',
    tech_tags: 'IoT, Embedded Systems, Solar PV, LoRaWAN, Python, TimeSeries, FastAPI',
    bill_of_materials:
      'Custom ESP32 Modbus Gateway, 12x Schneider Electric IEM3155 Energy Meters, HopeRF RFM95W LoRa Modules, 48V 100Ah LiFePO4 Battery Bench',
    metrics_json:
      '{"peak_demand_reduction": "28 kW", "solar_self_consumption": "94.2%", "monthly_bill_reduction": "₹42,000"}',
    status: 'Approved & Open',
    faculty_mentor: 'Dr. B. K. Sridhara (Prof. & Head, Electrical Engg.)',
    lab_status: 'Cleared for Bench 4, Renewable Energy Lab (Block D)',
    author_id: 'usr-rohan-cse',
    author_name: 'Rohan S.',
    author_dept: 'Computer Science & Engineering',
    author_batch: "CSE '25",
    author_avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1M-x0Xbs19Dcwefnan3kFqXSnnF1h8ygV2_P4aXmYRz69ZBfbXMQEENG6bc4NEZp54shirMuNwQKqy2CzGKhk0qUcpefW9Qu0tEufSVzgVefd4YmIAO6vpxHx0h-3k0GlUC2gmL0KnwOG0TWrCZXu3cgK54yRdDJGQ0VehCZy7ojDIde8Ekm90e839lFK6kjacOiOJCFMSPRCf1eu4B0rOnSjDyIfhlN0XqPTQ9FR',
    upvotes_count: 128,
    interested_count: 34,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    open_roles: [
      {
        id: 'role-3',
        idea_id: 'idea-smart-energy-grid',
        role_title: 'Frontend & Data Visualization Lead',
        department_required: 'CSE / ISE',
        skills_required: 'React, TypeScript, Tailwind, Chart.js',
        total_slots: 2,
        filled_slots: 1,
        kickoff_date: 'March 1st',
      },
      {
        id: 'role-4',
        idea_id: 'idea-smart-energy-grid',
        role_title: 'Power Electronics Hardware Specialist',
        department_required: 'ECE / EEE',
        skills_required: 'Modbus RS485, PCB Design, Inverters, Battery BMS',
        total_slots: 1,
        filled_slots: 0,
        kickoff_date: 'Immediate Sprint',
      },
    ],
  },
  {
    id: 'idea-campus-mail-rover',
    title: 'Autonomous Inter-Department Document & Mail Delivery Rover',
    category: 'AI/ML',
    department: 'Mech',
    maturity: 'Prototype',
    summary:
      'Four-wheel differential drive robotic rover equipped with 2D LiDAR SLAM and camera vision for autonomous inter-departmental memo and examination dossier transit between Administrative Block and GJ Block.',
    problem_statement:
      'Staff spend considerable manual hours daily physically carrying sealed exam papers and inter-departmental files across campus pathways, frequently hampered by campus traffic and inclement weather.',
    architecture_description:
      'ROS 2 navigation stack running on Jetson Orin Nano, fusing RPLiDAR A1 mapping with RealSense depth perception and GPS waypoint routing.',
    tech_tags: 'Robotics, ROS 2, Jetson Nano, LiDAR, SLAM, Python, C++',
    bill_of_materials:
      'NVIDIA Jetson Orin Nano, Slamtec RPLiDAR A1, 4x Planetary Gear DC Motors, Aluminum Extrusion Chassis',
    metrics_json:
      '{"transit_speed": "1.2 m/s", "payload_capacity": "15 kg", "obstacle_clearance_time": "350ms"}',
    status: 'Approved & Open',
    faculty_mentor: 'Dr. Ramesh M. (Prof., Mechanical Engg.)',
    lab_status: 'Prototyping Bench 2, Mechatronics Cell',
    author_id: 'usr-karthik-ece',
    author_name: 'Karthik R.',
    author_dept: 'Electronics & Communication',
    author_batch: "ECE '25",
    author_avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    upvotes_count: 92,
    interested_count: 22,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    open_roles: [
      {
        id: 'role-5',
        idea_id: 'idea-campus-mail-rover',
        role_title: 'SLAM & ROS 2 Navigation Specialist',
        department_required: 'ECE / CSE',
        skills_required: 'ROS 2 Humble, C++, 2D LiDAR SLAM, Navigation 2',
        total_slots: 2,
        filled_slots: 1,
        kickoff_date: 'Sprint 2',
      },
    ],
  },
  {
    id: 'idea-mysore-bus-tracker',
    title: 'Real-Time Mysore City Bus Transit Tracker & Crowding Prediction',
    category: 'App',
    department: 'AIML',
    maturity: 'Concept',
    summary:
      'Crowdsourced and GPS-driven transit mobile app predicting route arrival times and commuter congestion across KSRTC suburban lines servicing NIE South and North campuses.',
    problem_statement:
      'Over 1,200 commuting students face severe uncertainty on suburban bus frequency between Mysuru Suburban Bus Stand, Kuvempunagar, and NIE North Campus, causing frequent tardiness for morning lecture sessions.',
    architecture_description:
      'Flutter cross-platform mobile application communicating with a high-throughput WebSocket gateway streaming GTFS real-time transit telemetry and XGBoost passenger load predictions.',
    tech_tags: 'Mobile App, Flutter, FastAPI, XGBoost, Redis, Docker, Maps API',
    bill_of_materials: 'Cloud Compute VM, OpenStreetMap Tiles Server, Twilio SMS Dispatch Gateway',
    metrics_json:
      '{"eta_accuracy": "91%", "user_base": "850+ Students", "prediction_window": "30 mins"}',
    status: 'Under Faculty Review',
    faculty_mentor: 'Dr. P. Devaki (Prof., AIML Dept)',
    lab_status: 'Software Dev Lab 2',
    author_id: 'usr-priya-aiml',
    author_name: 'Priya N.',
    author_dept: 'AI & Machine Learning',
    author_batch: "AIML '26",
    author_avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    upvotes_count: 67,
    interested_count: 14,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    open_roles: [
      {
        id: 'role-6',
        idea_id: 'idea-mysore-bus-tracker',
        role_title: 'Flutter Mobile UI/UX Engineer',
        department_required: 'Any',
        skills_required: 'Flutter, Dart, Provider / Riverpod, Google Maps API',
        total_slots: 2,
        filled_slots: 0,
        kickoff_date: 'April 2026',
      },
    ],
  },
  {
    id: 'idea-water-quality-iot',
    title: 'Campus Water Harvesting & Potability Real-Time Sensor Grid',
    category: 'IoT',
    department: 'Civil',
    maturity: 'Prototype',
    summary:
      'Multiparameter optical and electrochemical probe stations monitoring TDS, pH, turbidity, and tank levels across all campus overhead cisterns with automated bleach dosing relays.',
    problem_statement:
      'Seasonal monsoon silt ingress into campus overhead tanks can cause unmonitored microbial contamination before periodic manual quarterly chemical lab tests detect water degradation.',
    architecture_description:
      'Solar-powered ESP32 telemetry nodes equipped with RS485 digital optical turbidity and industrial glass pH probes broadcasting telemetry every 15 minutes to campus facilities dashboard.',
    tech_tags: 'IoT, Civil Sensors, Water Quality, LoRa, ESP32, Grafana',
    bill_of_materials:
      'DFRobot Industrial pH Sensor, Gravity Turbidity Sensor, 10W Monocrystalline Solar Panel, IP68 Enclosures',
    metrics_json:
      '{"monitoring_points": "14 Cisterns", "testing_frequency": "Continuous", "contamination_alert_sla": "< 5 min"}',
    status: 'Team Formed',
    faculty_mentor: 'Dr. N. Suresh (Prof., Civil Engineering)',
    lab_status: 'Environmental Engg Testing Ground',
    author_id: 'usr-sahana-civil',
    author_name: 'Sahana K.',
    author_dept: 'Civil Engineering',
    author_batch: "Civil '25",
    author_avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    upvotes_count: 48,
    interested_count: 8,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
    open_roles: [],
  },
];

const LOCAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'teammates',
    title: 'New Teammate Application',
    message:
      "Karthik R. (ECE '25) applied for the Power Electronics Hardware Specialist role on your Smart Campus Energy Grid project.",
    action_link: '/idea/idea-smart-energy-grid',
    applicant_id: 'usr-karthik-ece',
    applicant_name: 'Karthik R.',
    applicant_dept: "ECE '25",
    role_id: 'role-4',
    role_title: 'Power Electronics Hardware Specialist',
    is_actionable: true,
    action_status: 'pending',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    type: 'upvotes',
    title: 'Project Milestone Reached',
    message:
      "Your project 'Smart Campus Microgrid & Solar PV Battery Optimizer' crossed 125 community upvotes!",
    action_link: '/idea/idea-smart-energy-grid',
    is_actionable: false,
    action_status: '',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'grants',
    title: 'Faculty Seed Grant Approved',
    message:
      'Dr. B. K. Sridhara approved your Lab Bench 4 testing clearance and sanctioned ₹25,000 component prototype grant.',
    action_link: '/submissions',
    is_actionable: false,
    action_status: '',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

let ideasState = [...LOCAL_IDEAS];
let notificationsState = [...LOCAL_NOTIFICATIONS];

export const api = {
  // Ideas
  async getIdeas(params?: { q?: string; category?: string; sort?: string; dept?: string }): Promise<IdeaItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.q) query.append('q', params.q);
      if (params?.category) query.append('category', params.category);
      if (params?.sort) query.append('sort', params.sort);
      if (params?.dept) query.append('department', params.dept);

      const res = await fetch(`${API_BASE}/ideas?${query.toString()}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback to local state
    }

    let result = [...ideasState];
    if (params?.category && params.category.toLowerCase() !== 'all') {
      result = result.filter((i) => i.category.toLowerCase().includes(params.category!.toLowerCase()));
    }
    if (params?.q && params.q.trim()) {
      const term = params.q.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(term) ||
          i.summary.toLowerCase().includes(term) ||
          i.tech_tags.toLowerCase().includes(term) ||
          i.author_name.toLowerCase().includes(term)
      );
    }
    if (params?.sort === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      result.sort((a, b) => b.upvotes_count - a.upvotes_count);
    }
    return result;
  },

  async getIdea(id: string): Promise<IdeaItem> {
    try {
      const res = await fetch(`${API_BASE}/ideas/${id}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const found = ideasState.find((i) => i.id === id);
    if (!found) throw new Error('Idea not found');
    return found;
  },

  async checkDuplicate(payload: {
    title: string;
    category: string;
    department: string;
    problem_statement: string;
    tech_tags: string;
    summary?: string;
  }): Promise<DuplicateCheckResult> {
    try {
      const res = await fetch(`${API_BASE}/ideas/check-duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback client-side similarity analysis
    }

    const text = `${payload.title} ${payload.problem_statement} ${payload.tech_tags}`.toLowerCase();
    const isFoodWasteMatch =
      text.includes('waste') || text.includes('mess') || text.includes('food') || text.includes('tray');

    if (isFoodWasteMatch) {
      const conflicting = ideasState.find((i) => i.id === 'idea-mess-waste-auditor') || ideasState[0];
      return {
        is_duplicate: true,
        similarity_score: 0.88,
        percentage_match: 88,
        level: 'amber',
        message:
          'Similar idea already exists in Idea Vault (88% match detected). Under NIE IP & Project Guidelines, collaborating on an existing initiative is preferred over repeating research effort!',
        breakdown: {
          overall_match: 88,
          problem_context_match: 94,
          hardware_tech_match: 85,
          target_demographic_match: 92,
        },
        conflicting_project: {
          id: conflicting.id,
          title: conflicting.title,
          category: conflicting.category,
          department: conflicting.department,
          summary: conflicting.summary,
          author_name: conflicting.author_name,
          author_dept: conflicting.author_dept,
          author_avatar: conflicting.author_avatar,
          tech_tags: conflicting.tech_tags,
          open_roles_count: conflicting.open_roles?.length || 2,
        },
        suggested_actions: [
          'Upvote / Join Team Instead',
          'Proceed with Separate Submission',
          'Request Mentor Mediation',
        ],
      };
    }

    return {
      is_duplicate: false,
      similarity_score: 0.12,
      percentage_match: 12,
      level: 'green',
      message: 'No significant duplication detected. Your capstone concept appears novel and ready to register!',
      breakdown: {
        overall_match: 12,
        problem_context_match: 15,
        hardware_tech_match: 10,
        target_demographic_match: 25,
      },
      suggested_actions: ['Proceed with submission'],
    };
  },

  async createIdea(payload: Partial<IdeaItem>): Promise<IdeaItem> {
    try {
      const res = await fetch(`${API_BASE}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const newIdea: IdeaItem = {
      id: `idea-${Date.now()}`,
      title: payload.title || 'Untitled Proposal',
      category: payload.category || 'Other',
      department: payload.department || 'CSE',
      maturity: payload.maturity || 'Concept',
      summary: payload.summary || payload.problem_statement?.slice(0, 180) || '',
      problem_statement: payload.problem_statement || '',
      architecture_description: payload.architecture_description || '',
      tech_tags: payload.tech_tags || '',
      bill_of_materials: payload.bill_of_materials || '',
      metrics_json: payload.metrics_json || '{}',
      status: 'Approved & Open',
      author_id: LOCAL_USER.id,
      author_name: LOCAL_USER.name,
      author_dept: LOCAL_USER.department,
      author_batch: LOCAL_USER.batch,
      author_avatar: LOCAL_USER.avatar_url,
      upvotes_count: 1,
      interested_count: 0,
      faculty_mentor: 'Dr. B. K. Sridhara (Prof. & Head)',
      lab_status: 'Cleared for Bench 4, ECE Embedded Lab',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      open_roles: payload.open_roles || [],
    };

    ideasState.unshift(newIdea);
    return newIdea;
  },

  async toggleUpvote(id: string, userId: string = 'usr-rohan-cse'): Promise<{ success: boolean; count: number; state: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/ideas/${id}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const idea = ideasState.find((i) => i.id === id);
    if (idea) {
      idea.upvotes_count += 1;
      return { success: true, count: idea.upvotes_count, state: true };
    }
    return { success: true, count: 1, state: true };
  },

  async toggleInterest(id: string, userId: string = 'usr-rohan-cse'): Promise<{ success: boolean; count: number; state: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/ideas/${id}/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const idea = ideasState.find((i) => i.id === id);
    if (idea) {
      idea.interested_count += 1;
      return { success: true, count: idea.interested_count, state: true };
    }
    return { success: true, count: 1, state: true };
  },

  // Teammates
  async getOpenRoles(params?: { domain?: string; department?: string }): Promise<OpenRole[]> {
    try {
      const query = new URLSearchParams();
      if (params?.domain) query.append('domain', params.domain);
      if (params?.department) query.append('department', params.department);

      const res = await fetch(`${API_BASE}/teammates/roles?${query.toString()}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const results: OpenRole[] = [];
    ideasState.forEach((idea) => {
      idea.open_roles?.forEach((role) => {
        if (params?.domain && params.domain.toLowerCase() !== 'all') {
          const dom = params.domain.toLowerCase();
          if (!role.role_title.toLowerCase().includes(dom) && !role.skills_required.toLowerCase().includes(dom)) {
            return;
          }
        }
        if (params?.department && params.department.toLowerCase() !== 'all') {
          const dep = params.department.toLowerCase();
          if (!role.department_required.toLowerCase().includes(dep) && !idea.department.toLowerCase().includes(dep)) {
            return;
          }
        }
        results.push({
          ...role,
          idea_id: idea.id,
          idea_title: idea.title,
          idea_category: idea.category,
          idea_department: idea.department,
          author_name: idea.author_name,
          author_dept: idea.author_dept,
          author_avatar: idea.author_avatar,
        });
      });
    });
    return results;
  },

  async applyForRole(payload: { role_id: string; applicant_id: string; note?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/teammates/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    return {
      success: true,
      message: 'Application submitted to project lead successfully!',
    };
  },

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardData> {
    try {
      const res = await fetch(`${API_BASE}/leaderboard`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const topPodium = [
      {
        rank: 1,
        name: 'Ananya Deshmukh',
        usn: '4NI21ME035',
        department: 'Mechanical Engineering',
        batch: "Mech '25",
        points: 540,
        avatar_url:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC9gz_UabGXkeRvqL1i7nOT6UyLfuL_SH8eZPE_wZ4SgHS-svxW-c4cSsVfrXOmsv_UMwL89LyvhQd6RjN3T6dqNbTH2QXIIVf8Ofk04WXCA6MJs41b5MoXPXXfnT9IEkZOltCI_mzcnyI0XQi_swthskYsj8QM4NhffhNiMrqWV-cGk_E4d2wpNHtX9RbdTbvbwMBTLUVHIYENln8Va3v7Ld2xjUy_Zn-aS27szyiF',
        badge_title: 'Chief Innovator • Gold Medal',
        active_leads: 1,
        cross_dept_teams: 2,
      },
      {
        rank: 2,
        name: 'Rohan S.',
        usn: '4NI21CS142',
        department: 'Computer Science & Engineering',
        batch: "CSE '25",
        points: 485,
        avatar_url: LOCAL_USER.avatar_url,
        badge_title: 'Mechatronics Pioneer • Silver Medal',
        active_leads: 1,
        cross_dept_teams: 2,
      },
      {
        rank: 3,
        name: 'Karthik R.',
        usn: '4NI21EC088',
        department: 'Electronics & Communication',
        batch: "ECE '25",
        points: 420,
        avatar_url:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        badge_title: 'Hardware Architect • Bronze Medal',
        active_leads: 1,
        cross_dept_teams: 1,
      },
    ];

    const departmentRankings = [
      { department: 'Computer Science & Engineering', total_points: 1420, active_projects: 42, students_count: 180, color_accent: '#4F46E5' },
      { department: 'Mechanical Engineering', total_points: 1180, active_projects: 31, students_count: 145, color_accent: '#885500' },
      { department: 'Electronics & Communication', total_points: 1090, active_projects: 28, students_count: 130, color_accent: '#006C49' },
      { department: 'AI & Machine Learning', total_points: 950, active_projects: 24, students_count: 95, color_accent: '#9333EA' },
      { department: 'Information Science & Engineering', total_points: 840, active_projects: 19, students_count: 110, color_accent: '#6366F1' },
      { department: 'Civil Engineering', total_points: 670, active_projects: 14, students_count: 85, color_accent: '#0284C7' },
    ];

    return {
      top_podium: topPodium,
      department_rankings: departmentRankings,
      student_table: topPodium,
    };
  },

  // Notifications
  async getNotifications(category: string = 'all', userId: string = 'usr-rohan-cse'): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications?category=${category}&user_id=${userId}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    if (category && category.toLowerCase() !== 'all') {
      return notificationsState.filter((n) => n.type.toLowerCase().includes(category.toLowerCase()));
    }
    return notificationsState;
  },

  async handleNotificationAction(id: string, action: 'accept' | 'decline'): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    notificationsState = notificationsState.map((n) =>
      n.id === id ? { ...n, action_status: action, is_read: true } : n
    );
    return {
      success: true,
      message: `Applicant ${action}ed successfully`,
    };
  },

  async markAllRead(userId: string = 'usr-rohan-cse'): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/notifications/mark-all-read?user_id=${userId}`, {
        method: 'POST',
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    notificationsState = notificationsState.map((n) => ({ ...n, is_read: true }));
    return { success: true };
  },

  // Profile
  async getUserProfile(userId: string = 'usr-rohan-cse'): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/profile`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return LOCAL_USER;
  },

  async getUserSubmissions(userId: string = 'usr-rohan-cse'): Promise<{
    user: any;
    metrics: { active_capstones: number; total_endorsements: number; collaborator_inquiries: number; lab_status: string };
    ideas: any[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/submissions`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const userIdeas = ideasState.filter((i) => i.author_id === userId);
    return {
      user: {
        name: LOCAL_USER.name,
        usn: LOCAL_USER.usn,
        department: LOCAL_USER.department,
        batch: LOCAL_USER.batch,
        avatar_url: LOCAL_USER.avatar_url,
      },
      metrics: {
        active_capstones: userIdeas.length,
        total_endorsements: userIdeas.reduce((sum, i) => sum + i.upvotes_count, 0),
        collaborator_inquiries: userIdeas.reduce((sum, i) => sum + i.interested_count, 0),
        lab_status: LOCAL_USER.lab_clearances,
      },
      ideas: userIdeas,
    };
  },
};
