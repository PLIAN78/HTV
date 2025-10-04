import cv2
import os

# Create frames folder if it doesn't exist
os.makedirs("frames", exist_ok=True)

# Load the video
cap = cv2.VideoCapture("hockey_clip.mp4")
fps = cap.get(cv2.CAP_PROP_FPS)  # Frames per second
interval = int(fps * 5)          # Every 5 seconds

frame_id = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    if frame_id % interval == 0:
        timestamp = int(frame_id / fps)
        filename = f"frames/frame_{timestamp}.jpg"
        cv2.imwrite(filename, frame)
        print(f"Saved {filename}")
    frame_id += 1

cap.release()
print("✅ Frame extraction complete.")