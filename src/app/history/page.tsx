"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, MessageSquare, Activity } from "lucide-react";
import ChatTranscript from "@/components/ChatTranscript";

interface SessionRecord {
    id: string;
    timestamp: string;
    duration: string;
    topEmotion: string;
    transcript: any[];
}

export default function HistoryPage() {
    const [history, setHistory] = useState<SessionRecord[]>([]);
    const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("socratic_session_history");
        if (saved) {
            const parsed = JSON.parse(saved);
            setHistory(parsed);
            if (parsed.length > 0) {
                setSelectedSession(parsed[0]);
            }
        }
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("socratic_session_history");
        setHistory([]);
        setSelectedSession(null);
    };

    if (history.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-slate-900 rounded-full">
                    <Clock className="w-8 h-8 text-slate-600" />
                </div>
                <h1 className="text-2xl font-bold">No Session History</h1>
                <p className="text-slate-400">Complete a session to see your analysis here.</p>
                <Link href="/" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full font-medium transition-colors">
                    Start a Session
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
            {/* Sidebar List */}
            <aside className="w-full md:w-80 border-r border-slate-800/50 bg-slate-900/20 flex flex-col h-screen">
                <div className="p-6 border-b border-slate-800/50">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">Back to Mirror</span>
                    </Link>
                    <div className="flex justify-between items-end">
                        <h1 className="text-xl font-black tracking-tight text-white">History</h1>
                        <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300">
                            Clear All
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {history.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => setSelectedSession(session)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selectedSession?.id === session.id
                                ? "bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                                : "bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/50"
                                }`}
                        >
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                {session.timestamp}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-300">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 text-emerald-400" />
                                    <span className="font-mono">{session.duration}</span>
                                </div>
                                {session.topEmotion !== "N/A" && (
                                    <div className="flex items-center gap-1.5">
                                        <Activity className="w-3 h-3 text-indigo-400" />
                                        <span className="capitalize">{session.topEmotion}</span>
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content: Transcript */}
            <section className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950/50">
                {selectedSession ? (
                    <>
                        <header className="p-6 border-b border-slate-800/50 bg-slate-900/10 backdrop-blur-md flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-1">Session Transcript</h2>
                                {selectedSession.topEmotion !== "N/A" && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="uppercase tracking-wider">Dominant Emotion:</span>
                                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold capitalize">
                                            {selectedSession.topEmotion}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-mono text-slate-300">
                                    {selectedSession.id}
                                </span>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                            <div className="max-w-3xl mx-auto">
                                {selectedSession.transcript && selectedSession.transcript.length > 0 ? (
                                    <ChatTranscript messages={selectedSession.transcript} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                        <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                        <p>No transcript available for this session.</p>
                                        <p className="text-xs mt-2 opacity-50">Audio may not have been recorded or session was empty.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        Select a session to view details
                    </div>
                )}
            </section>
        </main>
    );
}
