import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const dialogueFlow = [
  {
    aiMessage: "我今天好像有点什么……你来告诉我发生了什么？",
    options: ["说不清楚，就是有点难受", "发生了一件事情", "只是有点空空的"],
  },
  {
    aiMessage: "嗯，我感受到了。那个难受是哪种难受？",
    options: ["像什么东西压着", "想哭但哭不出来", "只是很累，说不上来"],
  },
  {
    aiMessage: "谢谢你告诉我。那个感觉现在还在吗？",
    options: ["还在，但淡了一点", "现在好一些了", "说完之后更重了"],
  },
];

const galleryBg = "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&h=1200&fit=crop&auto=format";

const glassCard: React.CSSProperties = {
  background: "rgba(255,252,245,0.58)",
  backdropFilter: "blur(28px) saturate(1.25)",
  WebkitBackdropFilter: "blur(28px) saturate(1.25)",
  border: "1.5px solid rgba(255,255,255,0.82)",
  boxShadow: "0 6px 24px rgba(120,90,60,0.07), 0 2px 8px rgba(120,90,60,0.04), inset 0 1.5px 0 rgba(255,255,255,0.92)",
};

export function EmotionalDialogue({ onNext, onBack }: Props) {
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<{ ai: string; user: string }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const current = dialogueFlow[step];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, step]);

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => {
      setHistory((h) => [...h, { ai: current.aiMessage, user: opt }]);
      if (step < dialogueFlow.length - 1) {
        setStep((s) => s + 1);
        setSelected(null);
      } else {
        onNext();
      }
    }, 520);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col">
      {/* Background — same as ProfilePage */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url(${galleryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(10px) brightness(1.06) saturate(0.85)",
        transform: "scale(1.06)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(252,249,243,0.64) 0%, rgba(248,244,236,0.72) 55%, rgba(244,239,228,0.76) 100%)",
      }} />
      {/* Ceiling light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: "260px", height: "180px",
        background: "radial-gradient(ellipse 130px 90px at 50% 0%, rgba(255,252,244,0.3) 0%, transparent 70%)",
        filter: "blur(20px)",
      }} />

      <div className="relative z-10 flex flex-col h-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
          className="flex items-center justify-between px-5 pt-14 pb-3 flex-shrink-0"
        >
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{
              background: "rgba(255,252,245,0.58)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1.5px solid rgba(255,255,255,0.82)",
              boxShadow: "0 3px 12px rgba(100,80,52,0.08), inset 0 1px 0 rgba(255,255,255,0.88)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="rgba(100,78,52,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Step pills */}
          <div className="flex items-center gap-1.5">
            {dialogueFlow.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i < step
                    ? "rgba(140,108,62,0.55)"
                    : i === step
                    ? "rgba(140,108,62,0.75)"
                    : "rgba(190,165,130,0.28)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <div style={{ width: "32px" }} />
        </motion.div>

        {/* Chat area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 pb-3 flex flex-col gap-4"
          style={{ scrollbarWidth: "none" }}
        >
          {/* History bubbles */}
          {history.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32 }}
              className="flex flex-col gap-2.5"
            >
              {/* AI bubble */}
              <div className="flex items-start gap-2.5">
                <AiAvatar />
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-md max-w-[78%] relative overflow-hidden"
                  style={{
                    background: "rgba(255,252,245,0.62)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    border: "1.5px solid rgba(255,255,255,0.8)",
                    boxShadow: "0 3px 14px rgba(100,78,52,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)" }} />
                  <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", lineHeight: 1.7, color: "rgba(60,44,24,0.62)", position: "relative" }}>{h.ai}</p>
                </div>
              </div>
              {/* User bubble */}
              <div className="flex justify-end">
                <div
                  className="px-4 py-3 rounded-2xl rounded-tr-md max-w-[72%] relative overflow-hidden"
                  style={{
                    background: "rgba(140,108,62,0.14)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    border: "1.5px solid rgba(180,148,100,0.3)",
                    boxShadow: "0 3px 12px rgba(100,78,52,0.06), inset 0 1px 0 rgba(255,255,255,0.55)",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)" }} />
                  <p style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", lineHeight: 1.7, color: "rgba(75,52,22,0.82)", position: "relative" }}>{h.user}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Current AI bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: history.length > 0 ? 0.18 : 0 }}
              className="flex items-start gap-2.5"
            >
              <AiAvatar />
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-md max-w-[80%] relative overflow-hidden"
                style={{
                  background: "rgba(255,252,245,0.68)",
                  backdropFilter: "blur(24px) saturate(1.25)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.25)",
                  border: "1.5px solid rgba(255,255,255,0.85)",
                  boxShadow: "0 4px 18px rgba(100,78,52,0.08), inset 0 1.5px 0 rgba(255,255,255,0.92)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.26) 0%, transparent 100%)" }} />
                <p style={{ fontFamily: "'Noto Serif SC', serif", fontSize: "14px", lineHeight: 1.75, color: "rgba(55,40,18,0.85)", fontWeight: 400, position: "relative" }}>
                  {current.aiMessage}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Option buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="px-5 pb-28 flex flex-col gap-2.5 flex-shrink-0"
        >
          {/* Thin divider */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(180,148,100,0.2) 30%, rgba(180,148,100,0.2) 70%, transparent)", marginBottom: "2px" }} />

          <AnimatePresence mode="popLayout">
            {current.options.map((opt, i) => {
              const isSelected = selected === opt;
              return (
                <motion.button
                  key={`${step}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: i * 0.07 }}
                  onClick={() => handleSelect(opt)}
                  className="text-left px-4 py-3.5 rounded-2xl transition-all duration-250 active:scale-[0.983] relative overflow-hidden"
                  style={{
                    background: isSelected
                      ? "rgba(140,108,62,0.14)"
                      : "rgba(255,252,245,0.55)",
                    backdropFilter: "blur(20px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                    border: isSelected
                      ? "1.5px solid rgba(160,122,72,0.45)"
                      : "1.5px solid rgba(255,255,255,0.8)",
                    boxShadow: isSelected
                      ? "0 4px 16px rgba(140,100,50,0.1), inset 0 1px 0 rgba(255,255,255,0.55)"
                      : "0 2px 10px rgba(100,78,52,0.05), inset 0 1.5px 0 rgba(255,255,255,0.88)",
                  }}
                >
                  {/* Sheen */}
                  <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
                  <div className="flex items-center gap-3 relative">
                    {/* Left accent dot */}
                    <div style={{
                      width: "5px", height: "5px", borderRadius: "50%", flexShrink: 0,
                      background: isSelected ? "rgba(140,108,62,0.75)" : "rgba(190,162,118,0.35)",
                      transition: "background 0.22s ease",
                    }} />
                    <p style={{
                      fontFamily: "'Noto Sans SC', sans-serif",
                      fontSize: "13px",
                      lineHeight: 1.55,
                      color: isSelected ? "rgba(75,52,22,0.9)" : "rgba(85,65,38,0.65)",
                      fontWeight: isSelected ? 500 : 400,
                      transition: "color 0.22s ease",
                    }}>
                      {opt}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}

function AiAvatar() {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 relative overflow-hidden"
      style={{
        background: "rgba(255,252,245,0.65)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1.5px solid rgba(255,255,255,0.85)",
        boxShadow: "0 3px 10px rgba(100,78,52,0.09), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "55%", background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)", borderRadius: "50%" }} />
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(140,108,62,0.75)" strokeWidth="1.6" strokeLinecap="round" style={{ position: "relative" }}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" fill="rgba(140,108,62,0.18)" stroke="rgba(140,108,62,0.65)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
