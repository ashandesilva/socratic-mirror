"use client";

import { useVoice } from "@humeai/voice-react";
import { useEffect, useState, useRef } from "react";

interface SessionRecord {
    id: string;
    timestamp: string;
    duration: string;
    topEmotion: string;
    transcript: any[]; // Save full message history
}

export default function SessionHistory() {
    const { status, messages } = useVoice();
    const [history, setHistory] = useState<SessionRecord[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const messagesRef = useRef<any[]>([]);

    // Keep ref synced with messages, but ONLY if not empty (to survive disconnect clear)
    useEffect(() => {
        if (messages.length > 0) {
            messagesRef.current = messages;
        }
    }, [messages]);

    // Load history on mount
    useEffect(() => {
        const saved = localStorage.getItem("socratic_session_history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    // Track start time and reset refs
    useEffect(() => {
        if (status.value === "connected" && !startTime) {
            setStartTime(Date.now());
            messagesRef.current = []; // Reset for new session
        }
    }, [status.value, startTime]);

    // Save session on disconnect
    useEffect(() => {
        if (status.value === "disconnected" && status.reason !== "error" && startTime) {
            const endTime = Date.now();
            const durationSec = Math.floor((endTime - startTime) / 1000);
            const finalMessages = messagesRef.current;

            console.log("Session ended. Saving...", { durationSec, msgCount: finalMessages.length });

            // Don't save very short empty sessions (prevents accidental clicks)
            if (finalMessages.length === 0 && durationSec < 2) {
                console.log("Session too short/empty, skipping save.");
                setStartTime(null);
                return;
            }

            // Find dominant emotion from the last user message
            const lastMsg = finalMessages.findLast((m) => m.type === "user_message") as any;
            let topEmotion = "N/A";
            if (lastMsg?.models?.prosody?.scores) {
                const scores = lastMsg.models.prosody.scores;
                topEmotion = Object.entries(scores).reduce((a, b) =>
                    (a[1] as number) > (b[1] as number) ? a : b
                )[0];
            }

            const newRecord: SessionRecord = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleString(),
                duration: `${Math.floor(durationSec / 60)}:${(durationSec % 60).toString().padStart(2, "0")}`,
                topEmotion: topEmotion,
                transcript: finalMessages, // Save full transcript
            };

            const newHistory = [newRecord, ...history].slice(0, 20); // Keep last 20
            setHistory(newHistory);
            localStorage.setItem("socratic_session_history", JSON.stringify(newHistory));
            setStartTime(null);
        }
    }, [status.value, startTime, history]);

    if (history.length === 0) {
        return (
            <div className="glass-card rounded-2xl p-6 mt-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                    <span className="text-xl">📜</span>
                </div>
                <h3 className="text-slate-300 font-bold text-sm">No History Yet</h3>
                <p className="text-slate-500 text-xs">Complete a session to see your analysis here.</p>
            </div>
        );
    }

    const lastSession = history[0];

    return (
        <div className="glass-card rounded-2xl p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-4 bg-indigo-500 rounded-full" />
                    Last Session
                </h3>
                <a href="/history" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    View Full History →
                </a>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-800/50 text-sm">
                <div className="flex justify-between text-slate-400 text-xs mb-1">
                    <span>{lastSession.timestamp}</span>
                    <span className="font-mono">{lastSession.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-300">Emotion</span>
                    <span className="text-indigo-400 font-medium capitalize">{lastSession.topEmotion}</span>
                </div>
            </div>
        </div>
    );
}
