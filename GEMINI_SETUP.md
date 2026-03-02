# 🔑 Gemini API Setup Guide

## How to Add Your Gemini API Key

### Step 1: Get Your API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key

### Step 2: Configure the Application
1. Open the `.env` file in the project root directory
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
3. Save the file

### Step 3: Restart the Development Server
If the server is already running, restart it:
```bash
# Press Ctrl+C to stop the server
npm run dev
```

## ✨ Features

### Video Feed Analysis
The Intelligence page now includes:
- **Video Selection Dropdown**: Choose from 7 surveillance camera feeds
- **AI-Powered Analysis**: Ask questions about:
  - ✅ PPE Compliance (hard hats, vests, gloves, glasses)
  - ⚠️ Safety Violations
  - 🔧 Equipment Operation
  - 📊 Workflow Efficiency
  - 🚨 Hazard Detection

### Example Questions to Ask:
- "Analyze PPE compliance in the CNC Vertical Turning Lathe video"
- "Are there any safety violations in the Machine Operation feed?"
- "What is the workflow efficiency in the Parts Assembling Camera?"
- "Check for unauthorized access in the Store Room Camera"
- "Evaluate equipment operation in the Top View Camera"

## 🔒 Security Note
- Never commit the `.env` file to version control
- The `.env` file is already listed in `.gitignore`
- Only share API keys through secure channels

## 📁 File Locations
- API Key Configuration: `.env` (root directory)
- Example Configuration: `.env.example`
- Chat Component: `components/AnalyticsInsights.tsx`

## 🆘 Troubleshooting

### "API key not configured" error?
✅ Make sure your `.env` file contains a valid API key
✅ Restart the development server after adding the key
✅ Ensure the key starts with `VITE_` prefix

### API not responding?
✅ Check your internet connection
✅ Verify the API key is valid at [AI Studio](https://aistudio.google.com/app/apikey)
✅ Check browser console for detailed error messages

## 🎯 Video Options Available
1. CNC Vertical Turning Lathe
2. Long View Camera 4
3. Machine Operation
4. Parts Assembling Camera
5. Sheet Arranging
6. Store Room Camera
7. Top View Camera

---
**Powered by Google Gemini 1.5 Flash**
