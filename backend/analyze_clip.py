import os
import json
import base64
import requests

frames_dir = "frames"
output_file = "holistic_report.txt"

# 1. Encode all frames
image_b64_list = []
for filename in sorted(os.listdir(frames_dir)):
    if filename.endswith(".jpg"):
        path = os.path.join(frames_dir, filename)
        with open(path, "rb") as f:
            image_b64_list.append(base64.b64encode(f.read()).decode("utf-8"))

# 2. Build coaching prompt
holistic_prompt = """
You are an expert hockey coach analyzing this entire sequence of key frames from a game clip.
Identify the overall offensive and defensive patterns, player positioning, transition play, and decision-making for both teams.
Then deliver:
1) A concise ‘Game Flow Summary’ (3–4 sentences) that captures the clip’s main tactical themes.
2) ‘Actionable Coaching Points’ as bullet points, divided by team, with clear, specific suggestions (e.g., improving spacing, support angles, breakouts).
""".strip()

# 3. Send request to Ollama API
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

# 4. Assemble streamed chunks
report = ""
for line in response.iter_lines():
    if not line:
        continue
    try:
        chunk = json.loads(line.decode("utf-8"))
        report += chunk.get("response", "")
    except json.JSONDecodeError:
        continue
report = report.strip()

# 5. Save and print the report
print("\n=== Holistic Game Analysis ===\n")
print(report)
with open(output_file, "w", encoding="utf-8") as out:
    out.write(report)

print(f"\n✅ Full coaching analysis saved to {output_file}")