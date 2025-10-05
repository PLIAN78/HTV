
# 🏒 Hockey Tactical Video Analyzer

### Built at **Hack the Valley 2025** by a team of three passionate sports minds:

* 🤺 A fencing official focused on athlete development — [Peter Lian](https://peterlian.com/)  
* 🏑 A competitive hockey athlete  — Alex Yuan
* 🧊 A lifelong hockey fan  — [Andy Yu](https://www.linkedin.com/in/andy-yu-8083a8339/)  


---

## Our Goal

Tactical understanding in sports often lags behind physical training — especially for athletes outside of professional systems.
We built **Hockey Tactical Video Analyzer** to make tactical education more **accessible, visual, and actionable** using AI.

This tool empowers players and coaches to upload real game footage, receive **frame-by-frame insights**, and generate **AI-powered coaching feedback** — all in seconds.

---

## What It Does

**Hockey Tactical Video Analyzer** is a full-stack AI system that helps players and coaches:

* Upload any hockey video
* Automatically extract key frames
* Analyze player positioning, puck movement, and tactical setups with AI
* Generate both per-frame feedback and holistic coaching summaries
* Visualize results through a simple browser interface

---

## Tech Stack

| Layer                | Tools & Frameworks                       |
| -------------------- | ---------------------------------------- |
| **Frontend**         | HTML, CSS, (JavaScript for upload logic) |
| **Backend**          | Python (Flask, Flask-CORS)               |
| **AI Engine**        | Ollama + LLaVA (Vision-Language Model)   |
| **Video Processing** | OpenCV                                   |
| **Data Output**      | JSON (per-frame) & TXT (summary)         |

---

## Getting Started

### Requirements

Make sure you have Python 3.9+ installed, then run:

```bash
pip install opencv-python flask flask-cors
```

Install and start **Ollama** locally with the **LLaVA** model:

```bash
ollama run llava
```

---

### Backend Setup

Run the Flask server:

```bash
python backend/server.py
```

This will expose an `/upload` endpoint for video analysis.

---

### Frontend Setup

Simply open `index.html` in your browser.

1. Upload a hockey video
2. Confirm and process
3. Watch analysis logs in your console or alert box
4. Review coaching insights per frame and overall game summary

---

## Project Structure

```
hockey-analyzer/
├── backend/
│   ├── full_pipeline.py         # Frame extraction + AI analysis
│   ├── server.py                # Flask backend API
│   ├── frame_reports.json       # Per-frame tactical analysis
│   ├── holistic_report.txt      # Overall game summary
├── frames/                      # Extracted video frames
├── index.html                   # Frontend interface
├── style.css                    # Frontend styling
```

---

## How It Works

1. The user uploads a hockey video from the frontend
2. Flask backend saves it and runs `full_pipeline.py`
3. Frames are extracted every second using OpenCV
4. Each frame is analyzed via **LLaVA** to detect tactical elements
5. The system generates both **per-frame** and **holistic** reports
6. Results are sent back to the frontend for display

---

## Next Steps

* Add section tagging (Breakout, Zone Entry, Scoring Chance)
* Build an interactive feedback viewer UI
* Deploy as a full web app for coaches and teams
* Expand to multi-sport tactical models

---

## License

MIT License — free to use, modify, and share.

---

## Acknowledgments

Special thanks to **Hack the Valley 2025** for hosting an inspiring event, and to the open-source community behind **Flask**, **OpenCV**, and **Ollama** for making rapid AI prototyping possible.

---
