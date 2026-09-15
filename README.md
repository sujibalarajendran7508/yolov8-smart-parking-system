# AI-Based Smart Parking Detection System Using YOLOv8 🅿️🤖

![System Status](https://img.shields.io/badge/System-Operational-10b981?style=for-the-badge)
![Model](https://img.shields.io/badge/Model-YOLOv8--nano-38bdf8?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-6366f1?style=for-the-badge)

A modern, professional, responsive web application and interactive product prototype for **AI-Based Smart Parking Detection** using **YOLOv8 computer vision**.

---

## 📸 Key Features & Capabilities

- 📊 **Real-Time AI Dashboard**: Live occupancy statistics (50 slots, 32 occupied, 18 available, 64% occupancy gauge), system health metrics (12.4ms/frame latency, 96.4% benchmark accuracy), and live activity stream.
- 🅿️ **Interactive 50-Slot Parking Grid**: Slots `P01` to `P50` color-coded (**Green = Available**, **Red = Occupied**, **Amber = Recommended Slot P18**). Includes search, zone filtering, and an interactive **State Toggle Simulator**.
- 🤖 **YOLOv8 Vision Feed Simulator**: Simulated CCTV camera feed with vehicle bounding box overlays (`Car — 96%`, `SUV — 92%`), multi-camera feed switcher, and laser scan animation.
- 🗺️ **Smart Navigation & Recommender**: Intelligent allocation recommending **Slot P18** (120m from entrance) with an interactive SVG route map and turn-by-turn guidance simulation.
- 📈 **Administrator Analytics**: 24-hour occupancy timeline line chart, hourly entry/exit trend bar chart, and project impact metrics (>60% search time reduction goal).
- 🧠 **Academic Architecture & Presentation**:
  - **Problem Statement**: 5–10 min average parking search time & pain points.
  - **Five-Why Root Cause Analysis**: Step-by-step timeline tracing down to the root cause.
  - **Proposed YOLOv8 Pipeline**: Flowchart mapping bounding boxes to slot ROI coordinates.
  - **Existing Solution Comparison**: Manual vs RFID vs Smart Sensors vs YOLOv8 Vision.
  - **9-Step System Flow**: End-to-end operational diagram.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Modern Vanilla CSS (Dark Navy Tech Theme, Glassmorphism, CSS Variables, Animations), ES6 JS Modules
- **UI Components**: Modular component architecture (Navbar, Dashboard, LiveParking, AIDetection, Navigation, Analytics, Architecture, SlotModal, Toast)
- **Computer Vision Model**: YOLOv8 (nano v8.1) ROI coordinate intersection logic
- **Visualization**: SVG-based responsive line, bar, area charts & canvas map graphics

---

## 🚀 Quick Start

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/vaitheeshwaransuji-2008/yolov8-smart-parking-system.git
   cd yolov8-smart-parking-system
   ```

2. **Run Locally**:
   You can serve the project using any standard static file HTTP server:
   ```bash
   # Using Python 3
   python -m http.server 8080
   ```

3. **Access in Browser**:
   Open [http://localhost:8080/](http://localhost:8080/) in your web browser.

---

## 📌 Disclaimer
This web application is built as an interactive product prototype for academic project evaluation and demonstration. All camera feeds, bounding box locations, and slot counts operate as high-fidelity simulations.

---

## 📜 License
[MIT License](LICENSE)
