import os
import json
import base64
import requests

# Load section definitions
with open("backend/sections.json", "r") as f:
    sections = json.load(f)

frames_dir = "frames"
results = []

for section in sections:
    section_name = section["section"]
    frame_files = section["frames"]

    # Encode frames
    image_b64_list = []
    for filename in frame_files:
        path = os.path.join(frames_dir, filename)
        with open(path, "rb") as f:
            image_b64_list.append(base64.b64encode(f.read()).decode("utf-8"))

    # Build prompt
    prompt = f"""
You are a professional hockey coach analyzing a clip from a game featuring amateur or professional players.
This section represents a '{section_name}' phase of play.

Please provide:
1. A brief summary of what happens in this section.
2. Tactical feedback for each team (Team A and Team B), including positioning, decision-making, and execution.
3. Point-form coaching advice for improvement, tailored to amateur-level players.

Use clear, direct language. Focus on teaching and correcting.
""".strip()

    # Send to Ollama
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llava",
            "prompt": prompt,
            "images": image_b64_list,
            "stream": True
        },
        stream=True
    )

    # Collect streamed response
    report = ""
    for line in response.iter_lines():
        if not line:
            continue
        try:
            chunk = json.loads(line.decode("utf-8"))
            report += chunk.get("response", "")
        except json.JSONDecodeError:
            continue

    results.append({
        "section": section_name,
        "frames": frame_files,
        "analysis": report.strip()
    })

# Save all section reports
with open("section_reports.json", "w", encoding="utf-8") as out:
    json.dump(results, out, indent=2)

print("\n✅ Section-by-section coaching analysis saved to section_reports.json")