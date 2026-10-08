/* ==========================================================================
   AI Smart Parking System - State & Demo Dataset (Phase 2 Upgrade)
   ========================================================================== */

function createInitialSlotsForFacility(facilityId = 'ground') {
  const slots = [];
  let totalCount = 50;
  let zones = ['Zone A (East Deck)', 'Zone B (Central)', 'Zone C (West Plaza)', 'Zone D (Executive)'];

  if (facilityId === 'tower') {
    totalCount = 80;
    zones = ['Floor 1 (Deck A)', 'Floor 2 (Deck B)', 'Floor 3 (Deck C)', 'VIP Roof Level'];
  } else if (facilityId === 'plaza') {
    totalCount = 30;
    zones = ['Plaza North', 'Plaza South', 'EV Charging Hub'];
  }

  // Generate deterministic occupied ratio (~60%)
  for (let i = 1; i <= totalCount; i++) {
    const isOccupied = (i % 3 !== 0) && (i % 5 !== 0 || i % 2 === 0);
    const slotId = `P${i < 10 ? '0' + i : i}`;
    const zoneIndex = Math.floor((i - 1) / (totalCount / zones.length)) % zones.length;

    let vehicleInfo = null;
    if (isOccupied) {
      const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'EV Compact', 'Truck'];
      const plates = ['KA-05-MD-4812', 'MH-12-RT-9920', 'DL-01-AB-1102', 'WB-02-XY-7734', 'TN-09-ZZ-3301'];
      vehicleInfo = {
        type: vehicleTypes[i % vehicleTypes.length],
        plate: plates[i % plates.length],
        confidence: (89 + (i % 9)).toFixed(1),
        parkedTime: `${(i * 7) % 180 + 12} mins ago`
      };
    }

    slots.push({
      id: slotId,
      number: i,
      status: isOccupied ? 'OCCUPIED' : 'AVAILABLE',
      zone: zones[zoneIndex],
      distance: 60 + (i * 4),
      isRecommended: slotId === 'P18',
      vehicle: vehicleInfo,
      reservation: null
    });
  }
  return slots;
}

// Global Application State Store
window.SmartParkingStore = {
  activeFacility: 'ground',
  facilities: {
    ground: { name: 'Main Campus Deck', total: 50, slots: createInitialSlotsForFacility('ground') },
    tower: { name: 'East Multi-Level Tower', total: 80, slots: createInitialSlotsForFacility('tower') },
    plaza: { name: 'West Open Plaza & EV Hub', total: 30, slots: createInitialSlotsForFacility('plaza') }
  },
  
  get slots() {
    return this.facilities[this.activeFacility].slots;
  },

  activeTab: 'dashboard',
  selectedSlot: null,
  isScanning: false,
  isAutoTrafficActive: false,
  autoTrafficTimer: null,
  selectedCamera: 'cam1',
  visionFilterMode: 'normal', // 'normal', 'heatmap', 'night'
  customROIs: [],
  lastUpdated: new Date().toLocaleTimeString(),

  // CCTV Camera presets for AI Detection Demo
  cameras: {
    cam1: {
      id: 'cam1',
      name: 'Cam 01 - Main Lot (North Entrance)',
      totalSlots: 20,
      occupied: 13,
      detectedVehicles: 13,
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      boxes: [
        { label: 'Car 96%', x: 12, y: 25, w: 22, h: 28, status: 'OCCUPIED' },
        { label: 'SUV 92%', x: 38, y: 22, w: 24, h: 30, status: 'OCCUPIED' },
        { label: 'Slot P18 - FREE', x: 67, y: 20, w: 22, h: 28, status: 'AVAILABLE' },
        { label: 'Car 89%', x: 14, y: 60, w: 23, h: 32, status: 'OCCUPIED' },
        { label: 'Car 94%', x: 42, y: 58, w: 24, h: 33, status: 'OCCUPIED' }
      ]
    },
    cam2: {
      id: 'cam2',
      name: 'Cam 02 - Zone B Central Deck',
      totalSlots: 15,
      occupied: 10,
      detectedVehicles: 10,
      bgGradient: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)',
      boxes: [
        { label: 'Truck 91%', x: 18, y: 30, w: 28, h: 36, status: 'OCCUPIED' },
        { label: 'Slot P03 - FREE', x: 52, y: 28, w: 22, h: 32, status: 'AVAILABLE' },
        { label: 'Car 95%', x: 78, y: 32, w: 18, h: 28, status: 'OCCUPIED' }
      ]
    },
    cam3: {
      id: 'cam3',
      name: 'Cam 03 - West Plaza & EV Hub',
      totalSlots: 15,
      occupied: 9,
      detectedVehicles: 9,
      bgGradient: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      boxes: [
        { label: 'EV Compact 98%', x: 25, y: 35, w: 20, h: 26, status: 'OCCUPIED' },
        { label: 'Slot P24 - FREE', x: 50, y: 35, w: 20, h: 26, status: 'AVAILABLE' }
      ]
    }
  },

  // Recent activity stream
  activityLog: [
    { id: 1, time: '2 mins ago', type: 'EXIT', slot: 'P18', text: 'Vehicle exited slot P18 (Zone B). Status changed to AVAILABLE.', badge: 'available' },
    { id: 2, time: '5 mins ago', type: 'ENTRY', slot: 'P09', text: 'YOLOv8 detected Sedan KA-05-MD-4812 in slot P09 (Conf: 94.2%).', badge: 'occupied' },
    { id: 3, time: '8 mins ago', type: 'NAV', slot: 'P18', text: 'Driver assigned recommendation for Slot P18 (120m away).', badge: 'ai' },
    { id: 4, time: '14 mins ago', type: 'SCAN', slot: 'ALL', text: 'YOLOv8 full visual detection scan executed across 3 cameras.', badge: 'demo' },
    { id: 5, time: '22 mins ago', type: 'ENTRY', slot: 'P42', text: 'YOLOv8 detected SUV MH-12-RT-9920 in slot P42.', badge: 'occupied' }
  ],

  // Compute live statistics helper
  getStats() {
    const total = this.slots.length;
    const occupied = this.slots.filter(s => s.status === 'OCCUPIED').length;
    const reserved = this.slots.filter(s => s.status === 'RESERVED').length;
    const available = total - occupied - reserved;
    const percentage = Math.round(((occupied + reserved) / total) * 100);
    return { total, occupied, reserved, available, percentage };
  },

  // Switch facility
  switchFacility(facilityId) {
    if (this.facilities[facilityId]) {
      this.activeFacility = facilityId;
      this.lastUpdated = new Date().toLocaleTimeString();
    }
  },

  // Reserve slot
  reserveSlot(slotId, driverName, plateNumber, durationHours) {
    const slot = this.slots.find(s => s.id === slotId);
    if (!slot) return null;

    const ticketId = 'PK-' + Math.floor(100000 + Math.random() * 900000);
    slot.status = 'RESERVED';
    slot.reservation = {
      ticketId,
      driverName,
      plateNumber,
      duration: `${durationHours} Hour(s)`,
      reservedAt: new Date().toLocaleTimeString(),
      validUntil: new Date(Date.now() + durationHours * 3600000).toLocaleTimeString()
    };

    this.activityLog.unshift({
      id: Date.now(),
      time: 'Just now',
      type: 'RESERVE',
      slot: slot.id,
      text: `Slot ${slot.id} reserved by ${driverName} (${plateNumber}). Pass ID: ${ticketId}.`,
      badge: 'warning'
    });

    this.lastUpdated = new Date().toLocaleTimeString();
    return slot.reservation;
  },

  // Random Traffic Ticker Event Generator
  triggerRandomTrafficEvent() {
    const randomSlot = this.slots[Math.floor(Math.random() * this.slots.length)];
    if (!randomSlot) return;

    if (randomSlot.status === 'OCCUPIED') {
      randomSlot.status = 'AVAILABLE';
      randomSlot.vehicle = null;
      this.activityLog.unshift({
        id: Date.now(),
        time: 'Just now',
        type: 'EXIT',
        slot: randomSlot.id,
        text: `Auto Traffic Ticker: Vehicle departed from Slot ${randomSlot.id}. Slot is now AVAILABLE.`,
        badge: 'available'
      });
    } else if (randomSlot.status === 'AVAILABLE') {
      randomSlot.status = 'OCCUPIED';
      const plates = ['KA-01-EQ-9920', 'MH-04-AB-1234', 'DL-09-CC-5544', 'TN-07-ZZ-7788'];
      randomSlot.vehicle = {
        type: 'Auto Sedan',
        plate: plates[Math.floor(Math.random() * plates.length)],
        confidence: (92 + Math.random() * 6).toFixed(1),
        parkedTime: 'Just now'
      };
      this.activityLog.unshift({
        id: Date.now(),
        time: 'Just now',
        type: 'ENTRY',
        slot: randomSlot.id,
        text: `Auto Traffic Ticker: YOLOv8 detected vehicle entry in Slot ${randomSlot.id}. Slot is now OCCUPIED.`,
        badge: 'occupied'
      });
    }

    if (this.activityLog.length > 12) this.activityLog.pop();
    this.lastUpdated = new Date().toLocaleTimeString();
  },

  // Toggle slot state simulation
  toggleSlotStatus(slotId) {
    const slot = this.slots.find(s => s.id === slotId);
    if (!slot) return;
    
    if (slot.status === 'OCCUPIED' || slot.status === 'RESERVED') {
      slot.status = 'AVAILABLE';
      slot.vehicle = null;
      slot.reservation = null;
      this.activityLog.unshift({
        id: Date.now(),
        time: 'Just now',
        type: 'EXIT',
        slot: slot.id,
        text: `Manual Override: Vehicle departed from ${slot.id} (${slot.zone}). Slot is now AVAILABLE.`,
        badge: 'available'
      });
    } else {
      slot.status = 'OCCUPIED';
      slot.vehicle = {
        type: 'Sedan',
        plate: 'SIM-' + Math.floor(1000 + Math.random() * 9000),
        confidence: '95.8',
        parkedTime: 'Just now'
      };
      this.activityLog.unshift({
        id: Date.now(),
        time: 'Just now',
        type: 'ENTRY',
        slot: slot.id,
        text: `Manual Override: Vehicle parked in ${slot.id} (${slot.zone}). Slot is now OCCUPIED.`,
        badge: 'occupied'
      });
    }
    this.lastUpdated = new Date().toLocaleTimeString();
    if (this.activityLog.length > 10) this.activityLog.pop();
  },

  // PPT Presentation Content - Problem, 5 Whys, Solution, Comparison, Workflow
  pptContent: {
    problemStatement: {
      main: "Drivers spend around 5–10 minutes searching for a parking slot in crowded urban areas and campus lots.",
      issues: [
        { title: 'Traffic Congestion', desc: 'Cars circling continuously create bottle-necks and internal parking lot bottlenecks.', icon: '🚘' },
        { title: 'Fuel Wastage', desc: 'Unnecessary idling and circling leads to wasted fuel and higher carbon emissions.', icon: '⛽' },
        { title: 'Driver Frustration', desc: 'Uncertainty of finding parking creates stress, delay, and loss of productivity.', icon: '⏱️' },
        { title: 'Inefficient Manual Monitoring', desc: 'Security personnel cannot track open slots accurately across large facilities.', icon: '👮' }
      ]
    },
    fiveWhys: [
      { step: 1, title: 'WHY 1', q: 'Why are drivers circling around?', a: 'Because they cannot find empty parking slots easily.' },
      { step: 2, title: 'WHY 2', q: 'Why can they not find empty slots?', a: 'They do not know which specific slots are currently free.' },
      { step: 3, title: 'WHY 3', q: 'Why don\'t they know free slots?', a: 'There is no real-time availability display or guidance system.' },
      { step: 4, title: 'WHY 4', q: 'Why is there no real-time display?', a: 'Manual security monitoring is slow, labor-intensive, and error-prone.' },
      { step: 5, title: 'WHY 5 (Root Cause)', q: 'What is the underlying root cause?', a: 'Absence of an automated AI-based detection system using existing CCTV camera infrastructure.' }
    ],
    proposedSolution: {
      title: 'Proposed AI Solution (YOLOv8 Computer Vision)',
      pipeline: [
        'YOLOv8 Object Detection',
        'CCTV / Parking Images',
        'Vehicle Detection',
        'Parking Slot Coordinates',
        'Occupancy Inference',
        'Real-Time Parking Availability'
      ],
      description: 'YOLOv8 detects vehicles in video frames. The system compares detected vehicle bounding boxes with predefined parking-slot coordinates (ROIs). Based on bounding box overlap (IoU), the system instantly identifies occupied vs empty parking spaces in real time.'
    },
    existingComparison: [
      { feature: 'Method', manual: 'Security Guards', rfid: 'RFID Gate Barriers', sensors: 'Ultrasonic Sensors', yolov8: 'YOLOv8 Vision (Selected)' },
      { feature: 'Slot-Level Visibility', manual: 'Poor', rfid: 'None (Only total entry/exit)', sensors: 'High', yolov8: 'High (Real-time grid)' },
      { feature: 'Installation Cost', manual: 'Low', rfid: 'Medium', sensors: 'High ($50-$150/slot)', yolov8: 'Low (Uses existing CCTV)' },
      { feature: 'Maintenance Need', manual: 'High (Labor cost)', rfid: 'Low', sensors: 'High (Per-sensor battery/faults)', yolov8: 'Low (Centralized AI software)' },
      { feature: 'Accuracy & Speed', manual: 'Slow & Human error', rfid: 'Fast at gate only', sensors: 'High', yolov8: '>95% Accuracy, Real-time' }
    ],
    systemFlow: [
      { step: '01', title: 'Vehicle Enters', desc: 'Vehicle enters the parking area facility.' },
      { step: '02', title: 'CCTV Captures Video', desc: 'Overhead camera stream captures parking lot video feed.' },
      { step: '03', title: 'YOLOv8 Detects', desc: 'YOLOv8 model processes frames & bounding boxes vehicles.' },
      { step: '04', title: 'Slot Status Updated', desc: 'System checks overlap of bounding boxes with slot ROI coordinates.' },
      { step: '05', title: 'Available Slot Identified', desc: 'Free parking spaces are flagged (Green = Available).' },
      { step: '06', title: 'User Recommendation', desc: 'Navigation module recommends optimal slot (e.g., P18).' },
      { step: '07', title: 'Driver Parks', desc: 'Driver navigates directly to designated slot without circling.' },
      { step: '08', title: 'Database Updates', desc: 'Slot state transitions to OCCUPIED automatically.' },
      { step: '09', title: 'Continuous Monitoring', desc: 'Real-time feedback loop runs continuously at 30 FPS.' }
    ],
    expectedOutcomes: [
      { title: 'Reduced Search Time', val: 'Over 60%', desc: 'Expected reduction in average parking search time (from 8.5 min to <3 min).' },
      { title: 'Environmental Impact', val: 'Eco-Friendly', desc: 'Lower fuel consumption & reduced internal parking congestion emissions.' },
      { title: 'Detection Accuracy Goal', val: '>95%', desc: 'Target computer vision accuracy benchmark on parking dataset.' },
      { title: 'Infrastructure Cost', val: 'Low Cost', desc: 'Leverages existing CCTV cameras without buying individual slot hardware.' },
      { title: 'Deployment Scale', val: 'Scalable', desc: 'Easily scalable across multi-floor decks, open lots, and campus grounds.' }
    ]
  }
};
