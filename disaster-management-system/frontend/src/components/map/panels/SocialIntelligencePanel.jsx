import { useState } from "react";
import { 
  Radio, 
  Send, 
  Loader2, 
  AlertCircle, 
  MapPin, 
  Activity, 
  Flame, 
  LifeBuoy, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { socialApi } from "../../../lib/api";

const SAMPLE_POSTS = [
  {
    label: "Rajendra Nagar Flood",
    text: "HELP! Water has entered our house near Rajendra Nagar. We are trapped and need rescue."
  },
  {
    label: "Kankarbagh Trap",
    text: "HELP! People are trapped near Kankarbagh."
  }
];

export default function SocialIntelligencePanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [text, setText] = useState("HELP! Water has entered our house near Rajendra Nagar. We are trapped and need rescue.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!text || !text.trim()) {
      setError("Please enter a disaster report or post to analyze.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await socialApi.analyze(text.trim());
      setResult(response.data);
    } catch (err) {
      console.error("Social NLP analysis failed:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to analyze social post";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (sev) => {
    switch (sev?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.4)]";
      case "HIGH":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.4)]";
      case "MODERATE":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40 shadow-[0_0_12px_rgba(234,179,8,0.4)]";
      case "LOW":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.4)]";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-24 right-80 z-[1000] w-84 glow-panel rounded-2xl p-4 flex flex-col gap-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar shadow-2xl border border-white/10"
      style={{ width: "340px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30">
            <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold tracking-wider text-xs uppercase text-white/95">
              Social Media Intel
            </h3>
            <p className="text-[9px] text-white/40 tracking-wider">NLP Real-time Classifier</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title={isOpen ? "Collapse panel" : "Expand panel"}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 overflow-hidden"
          >
            {/* Sample Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Samples:</span>
              {SAMPLE_POSTS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setText(sample.text)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-sky-300/80 hover:text-sky-200 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Input Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center justify-between">
                <span>Disaster Report / Tweet</span>
                <span className="text-white/40 font-normal">{text.length} chars</span>
              </label>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter social media post, SOS text, or field report..."
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-white/30 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400/40 transition-all resize-none font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={loading || !text.trim()}
                onClick={handleAnalyze}
                className="flex-1 cyber-button py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-500/20 transition-all border border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing with NLP...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Analyze Report</span>
                  </>
                )}
              </button>

              {result && (
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
                  title="Clear result"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-red-300 text-[11px]"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Analysis Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col gap-2.5 mt-1"
              >
                {/* Severity & Disaster Type Badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 uppercase font-semibold">Severity:</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${getSeverityStyle(result.severity)}`}>
                      {result.severity || "UNKNOWN"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 uppercase font-semibold">Type:</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {result.disaster_type || "UNKNOWN"}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/5">
                  <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>Location:</span>
                  </div>
                  <span className="text-white font-bold text-xs">{result.location || "Undetected"}</span>
                </div>

                {/* Emergency Score */}
                <div className="flex flex-col gap-1 px-2.5 py-2 rounded-lg bg-black/30 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      <span>Emergency Score:</span>
                    </div>
                    <span className="font-mono font-bold text-amber-400 text-xs">
                      {result.emergency_score ?? 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-red-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, result.emergency_score || 0))}%` }}
                    />
                  </div>
                </div>

                {/* Emergency Signals */}
                {result.emergency_signals && result.emergency_signals.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-red-400" /> Emergency Signals:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {result.emergency_signals.map((sig, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-300"
                        >
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Needs */}
                {result.needs && result.needs.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold flex items-center gap-1">
                      <LifeBuoy className="w-3 h-3 text-emerald-400" /> Required Needs:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {result.needs.map((need, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}