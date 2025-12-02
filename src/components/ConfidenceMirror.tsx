"use client";

import { useVoice } from "@humeai/voice-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

// Dynamically import GaugeComponent to avoid SSR issues with canvas/window
const GaugeComponent = dynamic(() => import("react-gauge-component"), { ssr: false });

export default function ConfidenceMirror() {
    const { messages } = useVoice();
    const [gaugeValue, setGaugeValue] = useState(50); // Start at neutral

    // Formula Weights
    const W_DET = 0.5;
    const W_CALM = 0.2;
    const W_CONF = 0.4;
    const W_ANX = 0.3;

    useEffect(() => {
        // Get the last message from the USER (not the AI)
        const lastUserMessage = messages.findLast((m) => m.type === "user_message") as any;

        if (lastUserMessage?.models?.prosody?.scores) {
            const s = lastUserMessage.models.prosody.scores;
            console.log("Received Prosody Scores:", s); // Debug Log

            // Calculate Composite Score
            const positiveSignal = (s.Determination || 0) * W_DET + (s.Calmness || 0) * W_CALM;
            const negativeSignal = (s.Confusion || 0) * W_CONF + (s.Anxiety || 0) * W_ANX;

            const netScore = positiveSignal - negativeSignal;

            // Normalize to 0-100 range for the Gauge
            // Increased sensitivity: Range is approx -0.5 to +0.5. 
            // Map -0.1 to +0.1 to 0-100 to make it VERY sensitive.
            // Raw scores are often very small (e.g. 0.05).
            const normalized = Math.min(Math.max(((netScore + 0.1) / 0.2) * 100, 0), 100);

            console.log("Confidence Calc:", {
                positiveSignal,
                negativeSignal,
                netScore,
                normalized,
                raw: { det: s.Determination, calm: s.Calmness, conf: s.Confusion, anx: s.Anxiety }
            });

            setGaugeValue(normalized);
        }
    }, [messages]);

    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-2 mb-6 z-10 w-full">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Confidence Monitor
                </h2>
            </div>

            <div className="w-full max-w-[240px] aspect-square relative z-10">
                <GaugeComponent
                    value={gaugeValue}
                    type="radial"
                    labels={{
                        tickLabels: {
                            type: "inner",
                            ticks: [
                                { value: 20, valueConfig: { style: { fill: "#475569", fontSize: 10 } } },
                                { value: 50, valueConfig: { style: { fill: "#475569", fontSize: 10 } } },
                                { value: 80, valueConfig: { style: { fill: "#475569", fontSize: 10 } } },
                            ],
                        },
                        valueLabel: {
                            formatTextValue: (value) => `${Math.round(value)}%`,
                            style: { fill: "#f8fafc", fontSize: 35, fontWeight: "bold", textShadow: "0 4px 8px rgba(0,0,0,0.5)" },
                        }
                    }}
                    arc={{
                        colorArray: ["#ef4444", "#f59e0b", "#10b981"],
                        subArcs: [{ limit: 33 }, { limit: 66 }, { limit: 100 }],
                        padding: 0.05,
                        width: 0.2,
                        cornerRadius: 4
                    }}
                    pointer={{
                        type: "blob",
                        animationDelay: 0,
                        color: "#f8fafc",
                        length: 0.8,
                        width: 15,
                    }}
                />
            </div>
        </div>
    );
}
