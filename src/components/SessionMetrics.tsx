"use client";

import { useVoice } from "@humeai/voice-react";
import { useEffect, useState } from "react";

export default function SessionMetrics() {
    const { status, messages } = useVoice();
    const [duration, setDuration] = useState(0);

    // Track duration when connected
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (status.value === "connected") {
            interval = setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [status.value]);

    // Reset duration on new session
    useEffect(() => {
        if (status.value === "connecting") {
            setDuration(0);
        }
    }, [status.value]);



    // Format duration as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="glass-card rounded-2xl p-6">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                Session Metrics
            </h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/30 border border-slate-800/50">
                    <span className="text-slate-500 text-sm">Duration</span>
                    <span className="text-emerald-400 font-mono font-bold">{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
}
