from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import json
import base64
import requests
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
UPLOAD_FOLDER = "uploads"
FRAMES_DIR = "frames"
FRAME_INTERVAL = 30  # Extract every 30th frame (~1 per second at 30fps)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FRAMES_DIR, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max

@app.route("/upload", methods=["POST"])
def upload_video():
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        # Save uploaded video
        filename = secure_filename(video_file.filename)
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video_file.save(video_path)
        
        print(f"Video saved: {video_path}")
        
        # Step 1: Extract frames
        saved_frames = extract_frames(video_path)
        print(f"Extracted {len(saved_frames)} frames")
        
        # Step 2: Analyze each frame
        frame_reports = analyze_frames(saved_frames)
        print("Frame analysis complete")
        
        # Step 3: Generate holistic analysis
        holistic_summary = generate_holistic_analysis(saved_frames)
        print("Holistic analysis complete")
        
        # Clean up uploaded video (optional)
        # os.remove(video_path)
        
        return jsonify({
            "frames": frame_reports,
            "summary": holistic_summary
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500


def extract_frames(video_path):
    """Extract frames from video at specified interval"""
    cap = cv2.VideoCapture(video_path)
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
    return saved_frames


def analyze_frames(saved_frames):
    """Analyze each frame using LLaVA via Ollama"""
    frame_reports = []
    
    for filename in saved_frames:
        path = os.path.join(FRAMES_DIR, filename)
        with open(path, "rb") as f:
            image_b64 = base64.b64encode(f.read()).decode("utf-8")
        
        prompt = """You are a hockey coach analyzing a single frame from a game clip.
Describe what you see in terms of player positioning, puck location, and tactical setup.
Use clear, coaching-style language."""
        
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llava",
                    "prompt": prompt,
                    "images": [image_b64],
                    "stream": True
                },
                stream=True,
                timeout=120
            )
            
            report = ""
            for line in response.iter_lines():
                if line:
                    try:
                        chunk = json.loads(line.decode("utf-8"))
                        report += chunk.get("response", "")
                    except json.JSONDecodeError:
                        continue
            
            # Extract frame number from filename (e.g., "frame_30.jpg" -> 30)
            frame_num = int(filename.split("_")[1].split(".")[0])
            
            frame_reports.append({
                "frame": filename,
                "frame_number": frame_num,
                "analysis": report.strip()
            })
            
            print(f"Analyzed {filename}")
        
        except Exception as e:
            print(f"Error analyzing {filename}: {e}")
            frame_reports.append({
                "frame": filename,
                "frame_number": 0,
                "analysis": f"Error: {str(e)}"
            })
    
    return frame_reports


def generate_holistic_analysis(saved_frames):
    """Generate holistic analysis using all frames"""
    image_b64_list = []
    
    for filename in saved_frames:
        path = os.path.join(FRAMES_DIR, filename)
        with open(path, "rb") as f:
            image_b64_list.append(base64.b64encode(f.read()).decode("utf-8"))
    
    holistic_prompt = """You are an expert hockey coach analyzing this entire sequence of key frames from a game clip.
Identify the overall offensive and defensive patterns, player positioning, transition play, and decision-making for both teams.
Then deliver:
1) A concise 'Game Flow Summary' (3-4 sentences) that captures the clip's main tactical themes.
2) 'Actionable Coaching Points' as bullet points, divided by team, with clear, specific suggestions."""
    
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llava",
                "prompt": holistic_prompt,
                "images": image_b64_list,
                "stream": True
            },
            stream=True,
            timeout=180
        )
        
        report = ""
        for line in response.iter_lines():
            if line:
                try:
                    chunk = json.loads(line.decode("utf-8"))
                    report += chunk.get("response", "")
                except json.JSONDecodeError:
                    continue
        
        return report.strip()
    
    except Exception as e:
        return f"Error generating holistic analysis: {str(e)}"


if __name__ == '__main__':
    print("=" * 50)
    print("Hockey Video Analyzer Backend")
    print("=" * 50)
    print("Server running on: http://localhost:5000")
    print("Make sure Ollama is running on port 11434")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)