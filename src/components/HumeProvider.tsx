"use client";

import { VoiceProvider } from "@humeai/voice-react";
import { ReactNode, useEffect, useState } from "react";
import AccessTokenContext from "./AccessTokenContext";

export default function HumeProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch("/api/auth");
                const data = await response.json();
                if (data.accessToken) {
                    setAccessToken(data.accessToken);
                }
            } catch (error) {
                console.error("Failed to fetch access token:", error);
            }
        };

        fetchToken();
    }, []);

    if (!accessToken) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Connecting to Socratic Mirror...</h2>
                    <p className="text-slate-400">Please ensure HUME_API_KEY and HUME_SECRET_KEY are set.</p>
                </div>
            </div>
        );
    }

    return (
        <AccessTokenContext.Provider value={accessToken}>
            <VoiceProvider>
                {children}
            </VoiceProvider>
        </AccessTokenContext.Provider>
    );
}
