import { useState, useRef, useEffect } from "react";
import {
  AiOutlineRobot,
  AiOutlineUser,
  AiOutlineAudio,
  AiOutlineSound,
} from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { PiCopyBold, PiCheckBold } from "react-icons/pi";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! I am Pragya. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          "/api/v1/text-to-speech",
          { text: "Namaste! I am Pragya. How can I assist you today?" },
          { responseType: "blob" }
        );

        const audioBlob = new Blob([response.data], { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (error) {
        alert("\u26a0\ufe0f Failed to play audio.");
      }
    })();
  }, []);

  const sendQuery = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    console.log(userMessage);
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/v1/query", {
        question: userMessage.content,
      });
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.data.answer },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "\u26a0\ufe0f Error: Could not reach server.",
        },
      ]);
    }

    setLoading(false);
  };

  const speechToText = async () => {
    if (recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          const formData = new FormData();
          formData.append("audio_file", audioBlob);

          try {
            const response = await axios.post(
              "/api/v1/speech-to-text",
              formData
            );
            const { text } = response.data;
            setInput(text);
          } catch (error) {
            alert("\u26a0\ufe0f Failed to process voice input.");
          }
        };

        mediaRecorder.start();
        setRecording(true);
      } catch (err) {
        alert("\u26a0\ufe0f Microphone access denied or unavailable.");
      }
    }
  };

  const textToSpeech = async (text) => {
    try {
      const response = await axios.post(
        "/api/v1/text-to-speech",
        { text },
        { responseType: "blob" }
      );

      const audioBlob = new Blob([response.data], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      alert("\u26a0\ufe0f Failed to play audio.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery();
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <header className="p-4 shadow-md bg-slate-950/70 backdrop-blur-sm text-center border-b border-slate-700">
        <h1
          className="text-5xl font-normal text-white tracking-wider drop-shadow-md"
          style={{
            fontFamily: "'Great Vibes', cursive",
            textShadow: "0 0 6px rgba(99, 102, 241, 0.6)", // soft indigo glow
          }}
        >
          Pragya
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 w-full flex justify-center scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent scrollbar-thumb-rounded-lg scrollbar-hover:scrollbar-thumb-indigo-500 scrollbar-active:scrollbar-thumb-indigo-500">
        <div className="w-full max-w-[700px] space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="bg-slate-700 p-2 rounded-full shrink-0">
                  <AiOutlineRobot size={20} />
                </div>
              )}
              <div className="relative max-w-[80%]">
                <div
                  className={`px-4 py-3 rounded-2xl shadow-lg break-words overflow-x-hidden
                                        ${
                                          msg.role === "user"
                                            ? "bg-indigo-600 text-white rounded-br-sm"
                                            : "bg-slate-700 text-white border border-slate-600 rounded-bl-sm"
                                        }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
                      <button
                        onClick={() => textToSpeech(msg.content)}
                        className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        <AiOutlineSound size={14} />
                        <span>Listen</span>
                      </button>
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <PiCheckBold size={14} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <PiCopyBold size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  <div>{msg.content}</div>
                </div>
              </div>
              {msg.role === "user" && (
                <div className="bg-indigo-500 p-2 rounded-full shrink-0">
                  <AiOutlineUser size={20} className="text-white" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3 justify-start animate-pulse">
              <div className="bg-slate-700 p-2 rounded-full">
                <AiOutlineRobot size={20} />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-700 text-white border border-slate-600">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-950/70 backdrop-blur-sm p-5 border-t border-slate-700">
        <div className="flex items-center w-full max-w-[700px] mx-auto gap-2">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a query..."
            disabled={loading}
            className="flex-1 min-h-[60px] max-h-[200px] resize-none px-4 py-3 rounded-xl bg-slate-800 text-white
                            border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400
                            cursor-default scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent scrollbar-thumb-rounded-lg
                            scrollbar-hover:scrollbar-thumb-indigo-500 scrollbar-active:scrollbar-thumb-indigo-500"
          />

          <button
            onClick={speechToText}
            disabled={loading}
            className={`p-3 rounded-full transition ${
              recording
                ? "bg-red-600 animate-pulse"
                : "bg-slate-700 hover:bg-slate-600"
            } cursor-pointer`}
          >
            <AiOutlineAudio size={20} className="text-white" />
          </button>

          <button
            onClick={sendQuery}
            disabled={loading}
            className={`p-3 rounded-full transition 
                            ${
                              loading
                                ? "bg-indigo-300 cursor-not-allowed"
                                : "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 cursor-pointer"
                            }`}
          >
            <FiSend size={20} className="text-white" />
          </button>
        </div>

        {recording && (
          <div className="flex justify-center mt-2">
            <div className="flex gap-1 items-end h-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-400 animate-pulse"
                  style={{
                    height: `${Math.random() * 24 + 8}px`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default Chat;
