# 🎥 YouTube AI Assistant  
A full-stack AI-powered application that summarizes and answers questions from YouTube videos using Azure OpenAI, Whisper, and LangChain.

---

## 🚀 Getting Started

### 🔧 Backend Setup

1. **Set environment variables**  
   Create a `.env` file or export manually with the following keys  and get the Api keys from azure Openai:

   ```env
   AZURE_OPENAI_API_KEY=
   AZURE_OPENAI_ENDPOINT=
   AZURE_DEPLOYMENT_NAME=
   AZURE_WHISPER_API_KEY=
   AZURE_WHISPER_ENDPOINT=
   AZURE_EMBEDDING_DEPLOYMENT_NAME=
   AZURE_EMBEDDING_DEPLOYMENT_VERSION=
   AZURE_INFERENCE_ENDPOINT=
   AZURE_EMBEDDING_API_KEY=
   AZURE_WHISPER_VERSION=
   AZURE_TTS_API_KEY=
   AZURE_TTS_ENDPOINT=
   ```

2. **Run the backend locally**

   ```bash
   python -m venv venv
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted  # (PowerShell only)
   .\venv\Scripts\Activate.ps1                                           # (PowerShell)
   pip install -r requirements.txt
   python main.py
   ```

---

### 🌐 Frontend Setup

```bash
npm install
npm run dev
```

---

## 🛠️ Tech Stack

### ✅ Backend
- **Flask + LangChain + Azure OpenAI + Whisper**
  - Accepts YouTube links and user queries
  - Retrieves transcripts via YouTube Transcript API or Whisper
  - Uses GPT-4o-mini for summarization and question answering

### ✅ Vector Store
- **FAISS + LangChain**
  - Splits transcripts into chunks and embeds them
  - Stores embeddings for semantic search
  - Retrieves relevant chunks for QA

### ✅ Chat Memory
- **LangChain Memory Modules**
  - Maintains dialogue history
  - Supports contextual follow-up questions and coreference resolution

### ✅ Frontend
- **React**
  - UI for submitting YouTube links
  - Choose between Summary or QnA modes
  - Select language for response
  - Optionally listen to responses via Azure TTS

---

## 📦 Features
- Summarize or query any YouTube video  
- Auto transcript via Whisper fallback  
- Semantic retrieval with FAISS  
- Memory-enabled multi-turn conversations  
- Audio output with Azure TTS  

---

## 📄 License
MIT License – use freely, credit appreciated.
