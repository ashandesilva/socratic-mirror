"use client";

import { useVoice } from "@humeai/voice-react";
import { Mic, PhoneOff, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessToken } from "./AccessTokenContext";
import { useEffect, useRef } from "react";

export default function VoiceInterface() {
    const { connect, disconnect, status, messages } = useVoice();
    const accessToken = useAccessToken();
    const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isConnected = status.value === "connected";
    const isConnecting = status.value === "connecting";

    const handleConnect = () => {
        if (accessToken) {
            connect({
                auth: { type: "accessToken", value: accessToken },
                ...(configId ? { configId } : {}),
            }).catch(console.error);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="glass-card rounded-2xl p-1 flex flex-col h-full relative overflow-hidden">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4 rotate-3">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Ready to Begin</h3>
                        <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
                            Start the session to begin your Socratic assessment. I'm listening.
                        </p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => {
                        if (msg.type !== "user_message" && msg.type !== "assistant_message") return null;
                        const isUser = msg.message.role === "user";

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-500/20 text-emerald-400"
                                    }`}>
                                    {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                </div>

                                {/* Bubble */}
                                <div
                                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${isUser
                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                        : "bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50"
                                        }`}
                                >
                                    <p>{msg.message.content}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Controls Area */}
            <div className="p-4 bg-slate-900/40 backdrop-blur-md border-t border-slate-800/50 flex items-center justify-between rounded-b-xl">
                <div className="flex items-center gap-3">
                    {isConnected && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-medium text-emerald-400">Live</span>
                        </div>
                    )}
                </div>

                {!isConnected ? (
                    <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all overflow-hidden ${isConnecting
                            ? "bg-slate-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 shadow-lg shadow-indigo-500/25"
                            }`}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        {isConnecting ? (
                            <span className="relative z-10">Connecting...</span>
                        ) : (
                            <>
                                <Mic className="w-4 h-4 relative z-10" />
                                <span className="relative z-10">Start Assessment</span>
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => disconnect()}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white hover:scale-105 transition-all"
                    >
                        <PhoneOff className="w-4 h-4" />
                        <span>End Session</span>
                    </button>
                )}
            </div>
        </div>
    );
}
