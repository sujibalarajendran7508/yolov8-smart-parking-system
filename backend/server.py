"""
AI-Based Smart Parking Detection System Using YOLOv8
Backend Server & Inference Pipeline
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import json

try:
    from ultralytics import YOLO
    MODEL_AVAILABLE = True
    model = YOLO("yolov8n.pt")
except Exception as e:
    MODEL_AVAILABLE = False
    print("Warning: Ultralytics not installed or yolov8n.pt not found. Running in simulation mode.")

app = FastAPI(title="YOLOv8 Smart Parking Detection API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vehicle class IDs in COCO dataset
VEHICLE_CLASSES = [2, 3, 5, 7] # 2: car, 3: motorcycle, 5: bus, 7: truck

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "YOLOv8 Smart Parking Detection System",
        "model_loaded": MODEL_AVAILABLE,
        "engine": "YOLOv8 Nano (Ultralytics)"
    }

@app.post("/api/detect-frame")
async def detect_frame(file: UploadFile = File(...)):
    """
    Receives an image frame from camera or webcam and executes YOLOv8 object detection.
    """
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image file format")

    h, w, _ = frame.shape
    detections = []

    if MODEL_AVAILABLE:
        results = model.predict(source=frame, conf=0.4, verbose=False)
        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0].item())
                if cls_id in VEHICLE_CLASSES:
                    xyxy = box.xyxy[0].tolist()
                    conf = float(box.conf[0].item())
                    label = model.names[cls_id]
                    detections.append({
                        "label": f"{label.capitalize()} {int(conf * 100)}%",
                        "class": label,
                        "confidence": round(conf * 100, 1),
                        "bbox": {
                            "x1": round(xyxy[0] / w * 100, 1),
                            "y1": round(xyxy[1] / h * 100, 1),
                            "x2": round(xyxy[2] / w * 100, 1),
                            "y2": round(xyxy[3] / h * 100, 1)
                        }
                    })
    else:
        # Fallback simulation detection response
        detections = [
            {"label": "Car 96%", "class": "car", "confidence": 96.0, "bbox": {"x1": 15, "y1": 25, "x2": 35, "y2": 55}},
            {"label": "SUV 92%", "class": "suv", "confidence": 92.0, "bbox": {"x1": 40, "y1": 22, "x2": 62, "y2": 52}}
        ]

    return {
        "success": True,
        "vehicles_detected": len(detections),
        "frame_dimensions": {"width": w, "height": h},
        "detections": detections
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
