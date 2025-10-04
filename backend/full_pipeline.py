import os
import cv2
import json
import base64
import requests

# === CONFIG ===
VIDEO_PATH = "input_clip.mp4"  # Replace with your video filename
FRAMES_DIR = "frames"
FRAME_INTERVAL = 30  # Extract every 30th frame (~1 per second at 30fps)
HOLISTIC_REPORT = "holistic_report.txt"
FRAME_REPORTS = "frame_reports.json"

# === STEP 1: Extract Frames ===
os.makedirs(FRAMES_DIR, exist_ok=True)
cap = cv2.VideoCapture(VIDEO_PATH)
frame_count = 0
saved_frames = []

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    if frame_count % FRAME_INTERVAL == 0:
        filename = f"frame_{frame_count}.jpg"
        path = os.path.join(FRAMES_DIR, filename)
        cv2.imwrite(path, frame)
        saved_frames.append(filename)
    frame_count += 1
cap.release()
print(f"✅ Extracted {len(saved_frames)} frames to {FRAMES_DIR}")

# === STEP 2: Analyze Each Frame ===
frame_reports = []
for filename in saved_frames:
    path = os.path.join(FRAMES_DIR, filename)
    with open(path, "rb") as f:
        image_b64 = base64.b64encode(f.read()).decode("utf-8")

    prompt = f"""
You are a hockey coach analyzing a single frame from a game clip.
Describe what you see in terms of player positioning, puck location, and tactical setup.
Use clear, coaching-style language.
""".strip()

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llava",
            "prompt": prompt,
            "images": [image_b64],
            "stream": True
        },
        stream=True
    )

    report = ""
    for line in response.iter_lines():
        if not line:
            continue
        try:
            chunk = json.loads(line.decode("utf-8"))
            report += chunk.get("response", "")
        except json.JSONDecodeError:
            continue

    frame_reports.append({
        "frame": filename,
        "analysis": report.strip()
    })

with open(FRAME_REPORTS, "w", encoding="utf-8") as out:
    json.dump(frame_reports, out, indent=2)
print(f"✅ Saved per-frame analysis to {FRAME_REPORTS}")

# === STEP 3: Holistic Analysis ===
image_b64_list = []
for filename in saved_frames:
    path = os.path.join(FRAMES_DIR, filename)
    with open(path, "rb") as f:
        image_b64_list.append(base64.b64encode(f.read()).decode("utf-8"))

holistic_prompt = """
You are an expert hockey coach analyzing this entire sequence of key frames from a game clip.
Identify the overall offensive and defensive patterns, player positioning, transition play, and decision-making for both teams.
Then deliver:
1) A concise ‘Game Flow Summary’ (3–4 sentences) that captures the clip’s main tactical themes.
2) ‘Actionable Coaching Points’ as bullet points, divided by team, with clear, specific suggestions.
""".strip()

response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "llava",
        "prompt": holistic_prompt,
        "images": image_b64_list,
        "stream": True
    },
    stream=True
)

report = ""
for line in response.iter_lines():
    if not line:
        continue
    try:
        chunk = json.loads(line.decode("utf-8"))
        report += chunk.get("response", "")
    except json.JSONDecodeError:
        continue

with open(HOLISTIC_REPORT, "w", encoding="utf-8") as out:
    out.write(report.strip())
print(f"✅ Saved holistic analysis to {HOLISTIC_REPORT}")