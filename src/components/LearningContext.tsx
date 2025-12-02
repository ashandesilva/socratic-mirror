import { BookOpen, Mic, Activity, Sparkles } from "lucide-react";

export default function LearningContext() {
    return (
        <div className="glass-card rounded-2xl p-6 h-full flex flex-col gap-6">
            <div>
                <div className="flex items-center gap-2 mb-3 text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                    <h2 className="text-xs font-bold uppercase tracking-wider">
                        Welcome
                    </h2>
                </div>
                <p className="text-slate-100 text-lg font-medium leading-relaxed">
                    The Socratic Mirror is an AI tutor that listens to <em>how</em> you speak to understand <em>what</em> you know.
                </p>
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 text-purple-400">
                    <Activity className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                        How It Works
                    </h3>
                </div>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-slate-300 text-sm group">
                        <div className="mt-1 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                            <Mic className="w-3 h-3" />
                        </div>
                        <div>
                            <strong className="block text-slate-200">Speak Naturally</strong>
                            <span className="text-slate-400 text-xs">Explain a concept as if teaching it.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300 text-sm group">
                        <div className="mt-1 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                            <Activity className="w-3 h-3" />
                        </div>
                        <div>
                            <strong className="block text-slate-200">Real-time Analysis</strong>
                            <span className="text-slate-400 text-xs">We analyze confidence, confusion, and hesitation.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300 text-sm group">
                        <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <BookOpen className="w-3 h-3" />
                        </div>
                        <div>
                            <strong className="block text-slate-200">Socratic Feedback</strong>
                            <span className="text-slate-400 text-xs">The AI asks guiding questions instead of giving answers.</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="pt-6 border-t border-slate-800/50">
                <p className="text-slate-500 text-xs leading-relaxed italic">
                    "Education is the kindling of a flame, not the filling of a vessel."
                </p>
            </div>
        </div>
    );
}
