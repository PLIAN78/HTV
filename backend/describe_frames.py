import os
import json
import base64
import requests

frames_dir = "frames"
output_file = "backend/summaries.json"
prompt = "Describe what's happening in this hockey frame. Focus on puck movement, player actions, and game events."

summaries = []

for filename in sorted(os.listdir(frames_dir)):
    if filename.endswith(".jpg"):
        timestamp = int(filename.split("_")[1].split(".")[0])
        image_path = os.path.join(frames_dir, filename)

        # Encode image to base64
        with open(image_path, "rb") as img_file:
            image_bytes = img_file.read()
            image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        # Send to Ollama API
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llava",
                "prompt": prompt,
                "images": [image_b64]
            }
        )

        summary_text = ""
        for line in response.iter_lines():
                if line:
                    try:
                        chunk = json.loads(line.decode("utf-8"))
                        summary_text += chunk.get("response", "")
                    except json.JSONDecodeError:
                        continue
        summary_text = summary_text.strip()

        if not summary_text:
            summary_text = "No description available."

        summaries.append({
            "timestamp": timestamp,
            "summary": summary_text
        })
        print(f"✅ Frame {timestamp}s described.")

# Save to JSON
with open(output_file, "w") as f:
    json.dump(summaries, f, indent=2)

print("🎉 All frame summaries saved to summaries.json")