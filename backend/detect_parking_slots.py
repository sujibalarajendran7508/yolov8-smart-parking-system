"""
AI-Based Smart Parking Detection System Using YOLOv8
Standalone Computer Vision Inference & Slot Occupancy Engine
Author: Suji B (sujibalarajendran7508)
Final Review 3 Release - 100% Completion
"""

import cv2
import numpy as np
import argparse
import json
import time

try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except ImportError:
    ULTRALYTICS_AVAILABLE = False
    print("[WARNING] ultralytics package not detected. Please install with: pip install ultralytics")

# Vehicle class indices in standard COCO dataset:
# 2: car, 3: motorcycle, 5: bus, 7: truck
COCO_VEHICLE_CLASSES = [2, 3, 5, 7]

def calculate_iou(boxA, boxB):
    """
    Calculate the Intersection over Union (IoU) of two bounding boxes.
    Format: [x1, y1, x2, y2]
    """
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0, xB - xA) * max(0, yB - yA)
    boxAArea = max(1, (boxA[2] - boxA[0]) * (boxA[3] - boxA[1]))
    boxBArea = max(1, (boxB[2] - boxB[0]) * (boxB[3] - boxB[1]))

    iou = interArea / float(boxAArea + boxBArea - interArea)
    return iou

def load_default_parking_slots(frame_width, frame_height):
    """
    Generates a standard grid of parking slot ROIs scaled to frame dimensions.
    Returns a list of dicts: [{'id': 'P01', 'bbox': [x1, y1, x2, y2], 'status': 'AVAILABLE'}]
    """
    slots = []
    rows = 2
    cols = 6
    start_x = int(frame_width * 0.08)
    start_y = int(frame_height * 0.20)
    slot_w = int(frame_width * 0.12)
    slot_h = int(frame_height * 0.30)
    gap_x = int(frame_width * 0.03)
    gap_y = int(frame_height * 0.15)

    slot_counter = 1
    for r in range(rows):
        for c in range(cols):
            x1 = start_x + c * (slot_w + gap_x)
            y1 = start_y + r * (slot_h + gap_y)
            x2 = x1 + slot_w
            y2 = y1 + slot_h
            slots.append({
                "id": f"P{slot_counter:02d}",
                "bbox": [x1, y1, x2, y2],
                "status": "AVAILABLE",
                "iou": 0.0
            })
            slot_counter += 1
    return slots

def run_parking_detector(source=0, weights="yolov8n.pt", iou_threshold=0.30, conf_threshold=0.40):
    """
    Main real-time detection loop processing video or camera feed.
    """
    print(f"[*] Initializing YOLOv8 model from {weights}...")
    if ULTRALYTICS_AVAILABLE:
        model = YOLO(weights)
    else:
        print("[!] Running in simulated detection fallback mode.")
        model = None

    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        print(f"[ERROR] Could not open video source: {source}")
        return

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 1280
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 720

    parking_slots = load_default_parking_slots(frame_width, frame_height)
    fps_start_time = time.time()
    frame_count = 0
    fps = 0

    print("[*] Starting real-time detection stream. Press 'q' to exit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            # If video ends, loop playback
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
            if not ret:
                break

        frame_count += 1
        current_time = time.time()
        if current_time - fps_start_time >= 1.0:
            fps = frame_count / (current_time - fps_start_time)
            frame_count = 0
            fps_start_time = current_time

        detected_vehicles = []

        if model is not None:
            results = model.predict(source=frame, conf=conf_threshold, verbose=False)
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0].item())
                    if cls_id in COCO_VEHICLE_CLASSES:
                        xyxy = [int(v) for v in box.xyxy[0].tolist()]
                        conf = float(box.conf[0].item())
                        detected_vehicles.append({
                            "bbox": xyxy,
                            "conf": conf,
                            "label": model.names[cls_id]
                        })
        else:
            # Simulation fallback: create simulated vehicle bounding boxes
            sim_x = int(frame_width * 0.10 + (time.time() % 10) * 20)
            detected_vehicles = [
                {"bbox": [sim_x, int(frame_height * 0.22), sim_x + int(frame_width * 0.10), int(frame_height * 0.48)], "conf": 0.95, "label": "car"}
            ]

        # Reset slot statuses
        for slot in parking_slots:
            slot["status"] = "AVAILABLE"
            slot["iou"] = 0.0

        # Calculate IoU between each slot and each detected vehicle
        for vehicle in detected_vehicles:
            v_box = vehicle["bbox"]
            for slot in parking_slots:
                iou = calculate_iou(slot["bbox"], v_box)
                if iou > slot["iou"]:
                    slot["iou"] = iou
                if slot["iou"] >= iou_threshold:
                    slot["status"] = "OCCUPIED"

        # Count availability
        total_slots = len(parking_slots)
        occupied_count = sum(1 for s in parking_slots if s["status"] == "OCCUPIED")
        available_count = total_slots - occupied_count
        occupancy_rate = (occupied_count / total_slots) * 100

        # Draw Slot ROIs
        for slot in parking_slots:
            x1, y1, x2, y2 = slot["bbox"]
            is_occ = slot["status"] == "OCCUPIED"
            color = (50, 50, 220) if is_occ else (50, 220, 50) # BGR (Red / Green)
            
            # Semi-transparent overlay for slots
            overlay = frame.copy()
            cv2.rectangle(overlay, (x1, y1), (x2, y2), color, -1)
            cv2.addWeighted(overlay, 0.25, frame, 0.75, 0, frame)
            
            # Slot border & text
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"{slot['id']} [{slot['status'][:3]}] IoU:{slot['iou']:.2f}"
            cv2.putText(frame, label, (x1 + 4, y1 + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)

        # Draw Detected Vehicle Bounding Boxes
        for vehicle in detected_vehicles:
            vx1, vy1, vx2, vy2 = vehicle["bbox"]
            cv2.rectangle(frame, (vx1, vy1), (vx2, vy2), (255, 200, 0), 2)
            v_text = f"{vehicle['label'].capitalize()} {int(vehicle['conf']*100)}%"
            cv2.putText(frame, v_text, (vx1, vy1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 200, 0), 2, cv2.LINE_AA)

        # Draw HUD Statistics Bar
        cv2.rectangle(frame, (0, 0), (frame_width, 60), (15, 23, 42), -1)
        hud_text = f"YOLOv8 SMART PARKING | Total: {total_slots} | Free: {available_count} | Occ: {occupied_count} ({occupancy_rate:.1f}%) | FPS: {fps:.1f}"
        cv2.putText(frame, hud_text, (20, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (56, 189, 248), 2, cv2.LINE_AA)

        cv2.imshow("YOLOv8 AI Smart Parking Detection - Review 3", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("[*] Inference terminated cleanly.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="YOLOv8 Smart Parking Detection Standalone Engine")
    parser.add_argument("--source", default=0, help="Video file path or camera index (default: 0 for webcam)")
    parser.add_argument("--weights", default="yolov8n.pt", help="YOLOv8 model weights path")
    parser.add_argument("--iou", type=float, default=0.30, help="IoU overlap threshold (default: 0.30)")
    parser.add_argument("--conf", type=float, default=0.40, help="Confidence threshold (default: 0.40)")
    args = parser.parse_args()

    # If source is numeric string, cast to int for OpenCV camera index
    source_val = int(args.source) if str(args.source).isdigit() else args.source
    run_parking_detector(source=source_val, weights=args.weights, iou_threshold=args.iou, conf_threshold=args.conf)
