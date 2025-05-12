import { useState, useRef } from "react";
import { AiOutlineRobot, AiOutlineUser } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { PiCopyBold, PiCheckBold } from "react-icons/pi";
import { HiMicrophone } from "react-icons/hi";
import axios from "axios";

const Chat = () => {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! How can I assist you today?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const sendText = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/v1/query", {
                messages: newMessages,
            });
            setMessages([
                ...newMessages,
                { role: "assistant", content: response.data.reply },
            ]);
        } catch (error) {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: "⚠️ Error: Could not reach server.",
                },
            ]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendText();
        }
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const sendVoice = async () => {
        if (loading) return;

        try {
            setLoading(true);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

                // Prepare form data
                const formData = new FormData();
                formData.append("audio", audioBlob, "voice.webm");

                try {
                    const response = await axios.post("http://localhost:5000/api/v1/voice", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    // For now, simulate dummy response
                    // const { text } = response.data;
                    const text = "This is a dummy transcribed message from voice.";
                    setInput(text);
                } catch (err) {
                    console.error(err);
                    setInput("⚠️ Error: Voice processing failed.");
                }

                setLoading(false);
            };

            // Start recording
            mediaRecorderRef.current.start();

            // Stop after 5 seconds
            setTimeout(() => {
                mediaRecorderRef.current.stop();
            }, 5000);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            {/* Header */}
            <header className="p-4 shadow-md bg-slate-950/70 backdrop-blur-sm text-center text-2xl font-bold tracking-wide border-b border-slate-700">
                Cortex
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto px-4 py-6 w-full flex justify-center
                scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent scrollbar-thumb-rounded-lg
                scrollbar-hover:scrollbar-thumb-indigo-500 scrollbar-active:scrollbar-thumb-indigo-500">
                <div className="w-full max-w-[700px] space-y-6">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "assistant" && (
                                <div className="bg-slate-700 p-2 rounded-full shrink-0">
                                    <AiOutlineRobot size={20} />
                                </div>
                            )}
                            <div className="relative max-w-[80%]">
                                <div
                                    className={`px-4 py-3 rounded-2xl shadow-lg break-words overflow-x-hidden
                                        ${msg.role === "user"
                                            ? "bg-indigo-600 text-white rounded-br-sm"
                                            : "bg-slate-700 text-white border border-slate-600 rounded-bl-sm"
                                        }`}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="flex justify-end text-xs text-slate-300 hover:text-white transition cursor-pointer mb-2"
                                             onClick={() => handleCopy(msg.content, idx)}
                                        >
                                            <div className="flex items-center gap-1">
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
                                            </div>
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

            {/* Input Box */}
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
                    {/* Microphone Button */}
                    <button
                        onClick={sendVoice}
                        disabled={loading}
                        className={`p-3 rounded-full transition 
                            ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700"}`}
                        title="Record Voice"
                    >
                        <HiMicrophone size={20} className="text-white" />
                    </button>

                    {/* Send Button */}
                    <button
                        onClick={sendText}
                        disabled={loading}
                        className={`p-3 rounded-full transition 
                            ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700"}`}
                        title="Send Text"
                    >
                        <FiSend size={20} className="text-white" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Chat;