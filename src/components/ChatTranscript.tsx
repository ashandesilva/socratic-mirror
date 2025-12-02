"use client";

import { motion } from "framer-motion";

interface ChatTranscriptProps {
    messages: any[];
}

export default function ChatTranscript({ messages }: ChatTranscriptProps) {
    return (
        <div className="space-y-8">
            {messages.map((msg, index) => {
                const isUser = msg.type === "user_message";
                const scores = isUser && msg.models?.prosody?.scores;

                // Get top 3 emotions if user message
                const topEmotions = scores
                    ? Object.entries(scores)
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .slice(0, 3)
                    : [];

                return (
                    <div key={index} className="flex flex-col gap-2">
                        {/* Header */}
                        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                            <span className="font-bold uppercase tracking-wider">
                                {isUser ? "User" : "Assistant"}
                            </span>
                            <span className="font-mono opacity-50">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>

                        {/* Message Bubble */}
                        <div
                            className={`p-4 rounded-xl text-sm leading-relaxed border ${isUser
                                ? "bg-slate-900/50 border-slate-800 text-slate-200"
                                : "bg-indigo-500/5 border-indigo-500/10 text-indigo-100"
                                }`}
                        >
                            {msg.message?.content || msg.text || "..."}
                        </div>

                        {/* Emotion Bars (Hume Style) */}
                        {isUser && topEmotions.length > 0 && (
                            <div className="flex gap-4 mt-1 px-1">
                                {topEmotions.map(([emotion, score]) => (
                                    <div key={emotion} className="flex-1 max-w-[200px]">
                                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                                            <span>{emotion}</span>
                                            <span className="text-slate-500">{(score as number).toFixed(2)}</span>
                                        </div>
                                        <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(score as number) * 100}%` }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                className={`h-full rounded-full ${(score as number) > 0.5 ? "bg-white" : "bg-slate-400"
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
