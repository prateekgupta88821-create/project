# SafeAid AI 🛡️
> **Your campus health & safety companion**
> An accessible multimodal assistant for minor campus medical emergencies and physical safety hazards powered by the Google Gemini API (`@google/genai`).

---

## 🌟 Features

- **Text Incident Input**: Describe campus emergencies, symptoms, or physical hazards (burns, cuts, fainting, bleeding, choking, chemical spills, electrical issues, fire).
- **Multimodal Image Input**: Upload photos, drag-and-drop, or use camera capture. Gemini combines visual observations with incident descriptions without diagnosing.
- **Strict Clinical & Safety Guardrails**:
  - Educational first-aid and hazard triage—NOT a medical diagnosis system.
  - Clear distinction between visual observation and clinical diagnosis.
  - Numbered, easy-to-follow emergency action steps designed for high-stress situations.
  - Critical "What to Avoid" precautions (no dangerous home remedies).
- **Visual Severity Hierarchy**:
  - **LOW RISK** (Green)
  - **MEDIUM RISK** (Amber)
  - **HIGH PRIORITY** (Rose/Red)
  - **CRITICAL** (Dark Red with pulsing emergency alert)
- **Emergency Action Panel (112)**:
  - Immediate `tel:` links to call national emergency services (112), Campus Security, and Campus Medical Center.
  - One-click `sms:` pre-composed emergency alert to designated personal emergency contact.
- **Multilingual Translation**:
  - Live translation to **Hindi (हिन्दी)**, **Tamil (தமிழ்)**, **Telugu (తెలుగు)**, **Bengali (বাংলা)**, and **Marathi (मराठी)** while preserving medical meaning and numbered action steps.
- **Campus Contacts & Settings**:
  - Configurable in a local Settings modal and saved in browser `localStorage`.
- **Demo Mode**:
  - Built-in simulation scenarios for judges and evaluators (Minor Burn, Small Cut, Person Feeling Faint, Electrical Hazard, Smoke/Fire) that work without requiring an API key.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons
- **Backend**: Node.js, Express, `@google/genai` (v2.20.0 official SDK)
- **Model**: `gemini-2.5-flash` (fast, balanced, multimodal)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 2. Clone & Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install --legacy-peer-deps
cd ..
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and add your Google Gemini API key:
```env
GEMINI_API_KEY=AIzaSyYourActualKeyHere
PORT=5000
GEMINI_MODEL=gemini-2.5-flash
```

#### How to Obtain a Google Gemini API Key:
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** -> **Create API key**.
4. Paste the key into your `.env` file.

> **Security Guarantee**: The `GEMINI_API_KEY` is exclusively read and utilized by the backend server (`server/gemini.js`). It is **never** exposed, sent, or bundled into the React client code.

---

## 💻 Running the Application

### Option A: Unified Development Server (Frontend + Backend)
Runs both the Express API server (port `5000`) and the Vite development server (port `5173`) with live reload:
```bash
npm run dev
```
Open your browser at:
```
http://localhost:5173
```

### Option B: Production Mode
Build the client and start the production Express server on port `5000`:
```bash
npm run build
npm start
```
Open your browser at:
```
http://localhost:5000
```

---

## 🧪 Demo Mode for Hackathon Judges

SafeAid AI includes an instant **Demo Mode** for judges:
1. Click the **"Try Demo Scenarios"** button in the hero or input card.
2. Select any pre-configured scenario:
   - 🩹 **Minor Thermal Burn** (Low Risk)
   - 🩸 **Small Kitchen Cut** (Low Risk)
   - 🫁 **Person Feeling Faint** (Medium Risk)
   - ⚡ **Electrical Hazard** (High Priority)
   - 🔥 **Smoke / Chemistry Lab Fire** (Critical Emergency)
3. The guidance instantly loads, displaying color-coded severity badges, structured actions, precautions, emergency triggers, and language translation.

---

## 📞 Default Campus Emergency Numbers

| Service | Default Number | Description |
|---------|----------------|-------------|
| Emergency Services | `112` | Configurable national emergency number |
| Campus Security | `+91 99887 76655` | 24/7 security dispatch |
| Campus Medical Center | `+91 91234 56789` | Health center & nurse station |

All numbers can be customized per user/institution in the **Settings** modal and are persisted across sessions in `localStorage`.

---

## ⚖️ Legal & Medical Disclaimer

SafeAid AI is an informational and educational campus safety companion. It does **not** provide clinical diagnosis, medical treatment, or prescription advice. In life-threatening emergencies, always dial 112 (or your local emergency number) immediately.
