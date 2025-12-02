import ConfidenceMirror from "@/components/ConfidenceMirror";
import HumeProvider from "@/components/HumeProvider";
import LearningContext from "@/components/LearningContext";
import VoiceInterface from "@/components/VoiceInterface";
import SessionMetrics from "@/components/SessionMetrics";
import SessionHistory from "@/components/SessionHistory";

export default function Home() {
  return (
    <HumeProvider>
      <main className="min-h-screen p-4 md:p-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-slate-800/50 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              The Socratic Mirror
            </h1>
            <p className="text-slate-400 mt-2 text-lg font-light tracking-wide">
              Affective Computing in Automated Pedagogical Assessment
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-mono text-indigo-300 tracking-widest uppercase">
              System Online
            </span>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

          {/* Left Column: Context (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <LearningContext />
          </div>

          {/* Center Column: Voice Interface (6 cols) */}
          <div className="lg:col-span-6 flex flex-col h-[600px] lg:h-auto">
            <VoiceInterface />
          </div>

          {/* Right Column: Mirror/Metrics (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <ConfidenceMirror />

            {/* Session Stats */}
            <SessionMetrics />

            {/* History */}
            <SessionHistory />
          </div>

        </div>
      </main>
    </HumeProvider>
  );
}
