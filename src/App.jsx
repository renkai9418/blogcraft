import { useState, useEffect, useRef } from "react";

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

// Inject fonts
const linkEl = document.createElement("link");
linkEl.rel = "stylesheet";
linkEl.href = FONTS_LINK;
document.head.appendChild(linkEl);

// ─── Theme ───
const T = {
  bg: "#0B0F1A",
  surface: "#131825",
  surfaceHover: "#1A2035",
  card: "#161C2E",
  border: "#1E2740",
  borderLight: "#2A3555",
  accent: "#6C5CE7",
  accentLight: "#A29BFE",
  accentGlow: "rgba(108,92,231,0.25)",
  green: "#00D2B4",
  greenGlow: "rgba(0,210,180,0.2)",
  orange: "#FF9F43",
  pink: "#FF6B9D",
  text: "#E8ECF4",
  textMuted: "#7B8AB8",
  textDim: "#4A5578",
  font: "'DM Sans', sans-serif",
  fontDisplay: "'Playfair Display', serif",
  fontMono: "'JetBrains Mono', monospace",
};

// ─── Icons (inline SVG) ───
const Icons = {
  Wand: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 4V2m0 2v2m0-2h2m-2 0h-2m-4.586 4.586L3 18l3 3 9.414-9.414" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.414 8.586l6 6" strokeLinecap="round"/>
    </svg>
  ),
  Globe: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/>
    </svg>
  ),
  Image: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
    </svg>
  ),
  Share: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
    </svg>
  ),
  Sparkles: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" strokeLinejoin="round"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Link: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round"/>
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
    </svg>
  ),
};

// ─── Loading Dots ───
const LoadingDots = () => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    return () => clearInterval(iv);
  }, []);
  return <span style={{ fontFamily: T.fontMono, color: T.accentLight }}>{dots || "."}</span>;
};

// ─── Typing Effect ───
const useTypewriter = (text, speed = 12, enabled = true) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled || !text) { setDisplayed(text || ""); setDone(true); return; }
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, enabled]);
  return { displayed, done };
};

// ─── Simulated blog content ───
const DEMO_BLOG = {
  title: "2025年AI Agent的崛起：从工具到协作伙伴的进化之路",
  meta: "深度解析AI Agent技术演进、落地场景与未来趋势，探讨智能体如何重塑人机协作范式。",
  outline: [
    { h: "引言：从ChatBot到Agent的范式跃迁", p: "2024年被称为「大模型应用元年」，而2025年正在成为「AI Agent爆发年」。当LLM从单纯的对话工具进化为具备自主规划、工具调用和持续学习能力的智能体，人机协作的边界正在被重新定义。" },
    { h: "什么是AI Agent？重新理解智能体", p: "AI Agent不仅仅是一个能聊天的模型，而是具备感知环境、自主决策、执行行动和反馈迭代四大核心能力的系统。它能够分解复杂任务、动态调用外部工具、在多步推理中保持上下文一致性，并根据执行结果自我修正。从ReAct框架到Plan-and-Execute范式，Agent架构正在快速演进。" },
    { h: "落地场景：Agent已经在哪些领域创造价值", p: "在软件开发领域，Cursor、Claude Code等编程Agent已经能完成从需求分析到代码部署的全流程；在企业办公中，智能助手Agent可以自动处理邮件、安排日程、生成报告；在客户服务场景，Agent能根据用户历史行为提供个性化解决方案，将平均处理时间缩短60%以上。" },
    { h: "技术挑战与解决路径", p: "当前Agent面临的核心挑战包括：长程推理中的「幻觉累积」问题、多Agent协作时的通信效率、以及安全边界的精确控制。业界正在通过强化学习微调、结构化记忆系统、以及分层权限管控等方法逐步突破这些瓶颈。" },
    { h: "展望：Agent Native的未来", p: "正如Mobile Native重塑了App生态，Agent Native将重新定义软件交互范式。未来的操作系统可能以Agent为核心，用户不再需要手动操作每个应用，而是通过自然语言描述目标，由Agent自主编排和执行。这不是取代人类，而是让人类专注于更高价值的创造性工作。" },
  ],
  seoScore: 92,
  keywords: ["AI Agent", "智能体", "大模型应用", "LLM", "人机协作", "自主决策"],
  readTime: "8 min",
  wordCount: 3200,
};

// ─── Image style options ───
const IMAGE_STYLES = [
  { id: "tech-minimal", name: "科技极简", desc: "清晰线条，几何构图，深色背景", color: "#6C5CE7", trend: true, preview: "linear-gradient(135deg, #0B0F1A 0%, #1A1040 50%, #6C5CE7 100%)" },
  { id: "gradient-glass", name: "毛玻璃渐变", desc: "柔和渐变，磨砂质感，现代感", color: "#00D2B4", trend: true, preview: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #00D2B4 100%)" },
  { id: "flat-illust", name: "扁平插画", desc: "矢量风格，色彩鲜明，易于传播", color: "#FF9F43", trend: true, preview: "linear-gradient(135deg, #FF9F43 0%, #FF6B6B 50%, #ee5a24 100%)" },
  { id: "photo-real", name: "真实摄影", desc: "AI生成写实图片，高级商务感", color: "#3498db", trend: false, preview: "linear-gradient(135deg, #2c3e50 0%, #3498db 60%, #2980b9 100%)" },
  { id: "3d-render", name: "3D 渲染", desc: "C4D风格，立体质感，吸睛效果", color: "#FF6B9D", trend: true, preview: "linear-gradient(135deg, #FF6B9D 0%, #c44569 50%, #6C5CE7 100%)" },
  { id: "watercolor", name: "水彩手绘", desc: "艺术感强，温暖亲切，适合故事型", color: "#1abc9c", trend: false, preview: "linear-gradient(135deg, #1abc9c 0%, #3498db 50%, #9b59b6 100%)" },
];

// ─── Main App ───
export default function BlogGenerator() {
  const [step, setStep] = useState(0);
  const [inputMode, setInputMode] = useState("topic");
  const [topic, setTopic] = useState("");
  const [blog, setBlog] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [socialCard, setSocialCard] = useState(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setStep(1);
    setTimeout(() => { setBlog(DEMO_BLOG); setStep(2); }, 3000);
  };

  const handleGenerateImages = (styleId) => {
    setSelectedStyle(styleId);
    setStep(4);
    setTimeout(() => {
      setGeneratedImages([1, 2, 3, 4]);
      setStep(3);
    }, 2500);
  };

  const handleGenerateSocial = () => {
    setStep(5);
    setSocialCard(true);
  };

  const reset = () => {
    setStep(0); setBlog(null); setSelectedStyle(null);
    setGeneratedImages([]); setSocialCard(null); setTopic("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: T.font,
      color: T.text,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "-30%", right: "-10%", width: 600, height: 600,
        borderRadius: "50%", background: `radial-gradient(circle, ${T.accentGlow} 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-20%", left: "-5%", width: 500, height: 500,
        borderRadius: "50%", background: `radial-gradient(circle, ${T.greenGlow} 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        padding: "16px 32px",
        borderBottom: `1px solid ${T.border}`,
        background: "rgba(11,15,26,0.85)",
        backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${T.accent}, ${T.green})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>✦</div>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
            BlogCraft
          </span>
          <span style={{
            fontSize: 10, fontFamily: T.fontMono, padding: "2px 8px",
            borderRadius: 20, background: T.accentGlow, color: T.accentLight,
            fontWeight: 500, marginLeft: 4,
          }}>AI-POWERED</span>
        </div>
        {step >= 2 && (
          <button onClick={reset} style={{
            background: "transparent", border: `1px solid ${T.border}`, color: T.textMuted,
            padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontFamily: T.font,
            fontSize: 13, display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
          >
            <Icons.Refresh /> 新建博文
          </button>
        )}
      </header>

      {/* Progress Steps */}
      {step >= 1 && (
        <div style={{
          display: "flex", justifyContent: "center", gap: 0, padding: "20px 32px 0",
          position: "relative", zIndex: 1,
        }}>
          {["内容生成", "配图生成", "社媒优化"].map((label, i) => {
            const stepMap = [1, 3, 5];
            const active = step >= stepMap[i];
            const current = (i === 0 && step <= 2) || (i === 1 && (step === 3 || step === 4)) || (i === 2 && step === 5);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: active ? T.accent : "transparent",
                    border: `2px solid ${active ? T.accent : T.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 600, color: active ? "#fff" : T.textDim,
                    transition: "all 0.4s",
                    boxShadow: current ? `0 0 20px ${T.accentGlow}` : "none",
                  }}>
                    {active && step > stepMap[i] ? <Icons.Check /> : i + 1}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: current ? T.accentLight : active ? T.text : T.textDim,
                    fontFamily: T.font,
                  }}>{label}</span>
                </div>
                {i < 2 && (
                  <div style={{
                    width: 80, height: 2, margin: "0 12px",
                    marginBottom: 20,
                    background: step > stepMap[i] ? T.accent : T.border,
                    borderRadius: 1, transition: "all 0.4s",
                  }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 80px", position: "relative", zIndex: 1 }}>

        {/* STEP 0: INPUT */}
        {step === 0 && (
          <div style={{ maxWidth: 720, margin: "60px auto 0", animation: "fadeUp 0.6s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h1 style={{
                fontFamily: T.fontDisplay, fontSize: 44, fontWeight: 700,
                lineHeight: 1.2, marginBottom: 16,
                background: `linear-gradient(135deg, ${T.text} 0%, ${T.accentLight} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                AI 驱动的博文创作
              </h1>
              <p style={{ color: T.textMuted, fontSize: 17, lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
                输入主题或URL，自动生成 SEO 友好的博客文章、精美配图和社交媒体分享卡片
              </p>
            </div>

            {/* Input Mode Tabs */}
            <div style={{
              display: "flex", gap: 4, marginBottom: 20, padding: 4,
              background: T.surface, borderRadius: 12, border: `1px solid ${T.border}`,
            }}>
              {[
                { id: "topic", label: "一句话主题", icon: <Icons.Sparkles /> },
                { id: "detail", label: "详细大意", icon: <Icons.FileText /> },
                { id: "url", label: "输入 URL", icon: <Icons.Link /> },
              ].map(m => (
                <button key={m.id} onClick={() => setInputMode(m.id)} style={{
                  flex: 1, padding: "10px 16px", borderRadius: 9,
                  border: "none", cursor: "pointer", fontFamily: T.font,
                  fontSize: 13.5, fontWeight: 500,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  background: inputMode === m.id ? T.accent : "transparent",
                  color: inputMode === m.id ? "#fff" : T.textMuted,
                  transition: "all 0.25s",
                }}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div style={{
              background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`,
              padding: 24, marginBottom: 16,
            }}>
              {inputMode === "url" ? (
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="https://example.com/your-blog-post"
                  style={{
                    width: "100%", background: T.card, border: `1px solid ${T.border}`,
                    borderRadius: 10, padding: "14px 16px", color: T.text,
                    fontFamily: T.fontMono, fontSize: 14, outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              ) : (
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder={inputMode === "topic"
                    ? "例如：2025年AI Agent的发展趋势与落地场景分析"
                    : "请描述你想要的博文大意，包括核心观点、目标读者、文章风格等..."
                  }
                  rows={inputMode === "topic" ? 2 : 6}
                  style={{
                    width: "100%", background: T.card, border: `1px solid ${T.border}`,
                    borderRadius: 10, padding: "14px 16px", color: T.text,
                    fontFamily: T.font, fontSize: 15, outline: "none",
                    resize: "vertical", lineHeight: 1.7, boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
              )}
              {inputMode === "url" && (
                <p style={{ fontSize: 12, color: T.textDim, marginTop: 10, marginBottom: 0 }}>
                  系统将自动读取 URL 内容，分析结构后执行博文优化或配图生成
                </p>
              )}
            </div>

            {/* Options Row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              {["中文", "English", "日本語"].map((lang, i) => (
                <label key={lang} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                  background: i === 0 ? T.accentGlow : T.surface, borderRadius: 8,
                  border: `1px solid ${i === 0 ? T.accent : T.border}`,
                  color: i === 0 ? T.accentLight : T.textMuted, fontSize: 13,
                  cursor: "pointer", fontWeight: 500,
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    border: `2px solid ${i === 0 ? T.accent : T.textDim}`,
                    background: i === 0 ? T.accent : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {i === 0 && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {lang}
                </label>
              ))}
              <div style={{ flex: 1 }} />
              <label style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`,
                color: T.textMuted, fontSize: 13, cursor: "pointer",
              }}>
                <Icons.Globe /> SEO优化
                <div style={{
                  width: 36, height: 20, borderRadius: 10, background: T.accent,
                  position: "relative", marginLeft: 4,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 2, right: 2,
                  }} />
                </div>
              </label>
            </div>

            {/* Generate Button */}
            <button onClick={handleGenerate} style={{
              width: "100%", padding: "16px 24px", borderRadius: 14,
              border: "none", cursor: topic.trim() ? "pointer" : "not-allowed",
              fontFamily: T.font, fontSize: 16, fontWeight: 600,
              background: topic.trim()
                ? `linear-gradient(135deg, ${T.accent}, #8B5CF6)`
                : T.surface,
              color: topic.trim() ? "#fff" : T.textDim,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.3s",
              boxShadow: topic.trim() ? `0 8px 32px ${T.accentGlow}` : "none",
              opacity: topic.trim() ? 1 : 0.6,
            }}>
              <Icons.Wand /> 生成博文
            </button>

            {/* Quick Examples */}
            <div style={{ marginTop: 32 }}>
              <p style={{ fontSize: 12, color: T.textDim, marginBottom: 12, fontWeight: 500, letterSpacing: "0.05em" }}>
                快速体验
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "2025年AI Agent的发展趋势与落地场景分析",
                  "远程办公三年后：我们学到了什么",
                  "为什么Rust正在成为系统编程的未来",
                ].map((ex, i) => (
                  <button key={i} onClick={() => setTopic(ex)} style={{
                    textAlign: "left", padding: "12px 16px", borderRadius: 10,
                    background: T.surface, border: `1px solid ${T.border}`,
                    color: T.textMuted, fontFamily: T.font, fontSize: 13.5,
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderLight; e.currentTarget.style.color = T.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
                  >
                    <Icons.ArrowRight /> {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: GENERATING */}
        {step === 1 && (
          <div style={{ maxWidth: 600, margin: "100px auto", textAlign: "center", animation: "fadeUp 0.5s ease" }}>
            <div style={{
              width: 64, height: 64, margin: "0 auto 32px",
              borderRadius: "50%",
              border: `3px solid ${T.border}`,
              borderTopColor: T.accent,
              animation: "spin 1s linear infinite",
            }} />
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
              正在生成博文<LoadingDots />
            </h2>
            <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.7 }}>
              AI 正在分析主题、构建大纲、优化 SEO 关键词
            </p>
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "32px auto 0" }}>
              {["分析主题与关键词", "构建文章大纲", "生成正文内容", "SEO 优化检查"].map((s, i) => (
                <GeneratingStep key={i} label={s} delay={i * 700} />
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: BLOG RESULT */}
        {step === 2 && blog && (
          <div style={{ display: "flex", gap: 24, marginTop: 24, animation: "fadeUp 0.5s ease" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`,
                padding: 32, marginBottom: 20,
              }}>
                <BlogTitle text={blog.title} />
                <p style={{
                  color: T.textMuted, fontSize: 14, lineHeight: 1.8, marginBottom: 28,
                  fontStyle: "italic", borderLeft: `3px solid ${T.accent}`, paddingLeft: 16,
                }}>
                  {blog.meta}
                </p>
                {blog.outline.map((sec, i) => (
                  <div key={i} style={{ marginBottom: 28 }}>
                    <h3 style={{
                      fontFamily: T.fontDisplay, fontSize: 19, fontWeight: 600,
                      color: T.text, marginBottom: 10,
                      display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{
                        fontSize: 11, fontFamily: T.fontMono, color: T.accent,
                        background: T.accentGlow, padding: "2px 8px", borderRadius: 4,
                      }}>H2</span>
                      {sec.h}
                    </h3>
                    <p style={{ color: T.textMuted, fontSize: 14.5, lineHeight: 1.9 }}>{sec.p}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <ActionBtn icon={<Icons.Copy />} label="复制全文" />
                <ActionBtn icon={<Icons.Download />} label="导出 Markdown" />
                <ActionBtn icon={<Icons.Refresh />} label="重新生成" />
                <div style={{ flex: 1 }} />
                <button onClick={() => { setStep(3); setGeneratedImages([]); setSelectedStyle(null); }} style={{
                  padding: "10px 20px", borderRadius: 10,
                  border: "none", cursor: "pointer", fontFamily: T.font,
                  fontSize: 14, fontWeight: 600,
                  background: `linear-gradient(135deg, ${T.accent}, #8B5CF6)`,
                  color: "#fff", display: "flex", alignItems: "center", gap: 8,
                  boxShadow: `0 4px 20px ${T.accentGlow}`,
                }}>
                  下一步：生成配图 <Icons.ArrowRight />
                </button>
              </div>
            </div>

            {/* SEO Panel */}
            <div style={{ width: 300, flexShrink: 0 }}>
              <div style={{
                background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`,
                padding: 24, position: "sticky", top: 100,
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icons.Globe /> SEO 分析
                </h3>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{
                    width: 96, height: 96, borderRadius: "50%", margin: "0 auto",
                    background: `conic-gradient(${T.green} ${blog.seoScore * 3.6}deg, ${T.border} 0deg)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                  }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: "50%", background: T.surface,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexDirection: "column",
                    }}>
                      <span style={{ fontSize: 28, fontWeight: 700, color: T.green, fontFamily: T.fontMono }}>{blog.seoScore}</span>
                      <span style={{ fontSize: 10, color: T.textDim }}>/ 100</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 24, padding: "16px 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
                  {[{ label: "字数", value: blog.wordCount.toLocaleString() }, { label: "阅读", value: blog.readTime }].map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: T.text, fontFamily: T.fontMono }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: 12, color: T.textDim, marginBottom: 10, fontWeight: 500 }}>目标关键词</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {blog.keywords.map((kw, i) => (
                      <span key={i} style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 12,
                        background: T.accentGlow, color: T.accentLight,
                        fontFamily: T.fontMono, fontWeight: 500,
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 20 }}>
                  <p style={{ fontSize: 12, color: T.textDim, marginBottom: 10, fontWeight: 500 }}>优化检查</p>
                  {[
                    { label: "标题含关键词", ok: true },
                    { label: "Meta描述 ≤160字符", ok: true },
                    { label: "H2标签结构完整", ok: true },
                    { label: "内链建议", ok: false },
                    { label: "图片ALT标签", ok: false },
                  ].map((c, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 0", fontSize: 13, color: c.ok ? T.green : T.orange,
                    }}>
                      {c.ok ? <Icons.Check /> : <span style={{ fontSize: 14 }}>○</span>}
                      <span style={{ color: T.textMuted }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: IMAGE STYLE SELECT */}
        {step === 3 && !generatedImages.length && (
          <div style={{ maxWidth: 820, margin: "32px auto 0", animation: "fadeUp 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, marginBottom: 10 }}>选择配图风格</h2>
              <p style={{ color: T.textMuted, fontSize: 15 }}>根据博文内容和目标受众，选择最适合的视觉风格</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
              {IMAGE_STYLES.map(style => (
                <button key={style.id} onClick={() => setSelectedStyle(style.id)} style={{
                  background: T.surface,
                  border: `2px solid ${selectedStyle === style.id ? style.color : T.border}`,
                  borderRadius: 16, padding: 0, cursor: "pointer",
                  overflow: "hidden", textAlign: "left", transition: "all 0.3s",
                  boxShadow: selectedStyle === style.id ? `0 0 24px ${style.color}33` : "none",
                  transform: selectedStyle === style.id ? "scale(1.02)" : "scale(1)",
                }}>
                  <div style={{ height: 100, background: style.preview, position: "relative", overflow: "hidden" }}>
                    {style.trend && (
                      <span style={{
                        position: "absolute", top: 8, right: 8, padding: "3px 8px", borderRadius: 6, fontSize: 10,
                        background: "rgba(0,0,0,0.5)", color: T.orange, fontWeight: 600, backdropFilter: "blur(4px)",
                      }}>🔥 热门</span>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>{style.name}</div>
                    <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.5 }}>{style.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            {selectedStyle && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={() => handleGenerateImages(selectedStyle)} style={{
                  padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer",
                  fontFamily: T.font, fontSize: 15, fontWeight: 600,
                  background: `linear-gradient(135deg, ${T.accent}, #8B5CF6)`,
                  color: "#fff", display: "flex", alignItems: "center", gap: 10,
                  boxShadow: `0 6px 24px ${T.accentGlow}`,
                }}>
                  <Icons.Image /> 生成配图
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: IMAGE GENERATING */}
        {step === 4 && (
          <div style={{ maxWidth: 600, margin: "100px auto", textAlign: "center", animation: "fadeUp 0.5s ease" }}>
            <div style={{
              width: 64, height: 64, margin: "0 auto 32px", borderRadius: 16,
              background: `linear-gradient(135deg, ${T.accent}, ${T.pink})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "pulse 1.5s ease infinite",
            }}>
              <Icons.Image />
            </div>
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
              正在生成配图<LoadingDots />
            </h2>
            <p style={{ color: T.textMuted, fontSize: 14 }}>AI 正在根据博文内容和所选风格创作配图</p>
          </div>
        )}

        {/* STEP 3 with images: IMAGE RESULTS */}
        {step === 3 && generatedImages.length > 0 && (
          <div style={{ maxWidth: 900, margin: "32px auto 0", animation: "fadeUp 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, marginBottom: 10 }}>配图已生成</h2>
              <p style={{ color: T.textMuted, fontSize: 15 }}>
                风格：{IMAGE_STYLES.find(s => s.id === selectedStyle)?.name} · 点击选择要使用的配图
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
              {generatedImages.map((_, i) => {
                const style = IMAGE_STYLES.find(s => s.id === selectedStyle);
                return (
                  <div key={i} style={{
                    borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}`,
                    background: T.surface, cursor: "pointer", transition: "all 0.3s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
                    onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                  >
                    <div style={{ height: 200, background: style?.preview, position: "relative", overflow: "hidden" }}>
                      <div style={{
                        position: "absolute", inset: 0, display: "flex", alignItems: "center",
                        justifyContent: "center", flexDirection: "column", gap: 8,
                        background: "rgba(0,0,0,0.2)", backdropFilter: "blur(2px)",
                      }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)",
                        }}>
                          <Icons.Image />
                        </div>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                          配图 #{i + 1} · 1200×630
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, color: T.textMuted }}>{["博文头图", "内容配图", "章节插图", "社媒封面"][i]}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <SmallBtn icon={<Icons.Download />} />
                        <SmallBtn icon={<Icons.Refresh />} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button onClick={() => { setGeneratedImages([]); setSelectedStyle(null); }} style={{
                padding: "12px 24px", borderRadius: 10, border: `1px solid ${T.border}`,
                background: "transparent", color: T.textMuted, cursor: "pointer",
                fontFamily: T.font, fontSize: 14, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Icons.Refresh /> 换一种风格
              </button>
              <button onClick={handleGenerateSocial} style={{
                padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
                fontFamily: T.font, fontSize: 14, fontWeight: 600,
                background: `linear-gradient(135deg, ${T.accent}, #8B5CF6)`,
                color: "#fff", display: "flex", alignItems: "center", gap: 8,
                boxShadow: `0 4px 20px ${T.accentGlow}`,
              }}>
                下一步：社媒优化 <Icons.ArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SOCIAL MEDIA */}
        {step === 5 && (
          <div style={{ maxWidth: 900, margin: "32px auto 0", animation: "fadeUp 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 700, marginBottom: 10 }}>社交媒体分享卡片</h2>
              <p style={{ color: T.textMuted, fontSize: 15 }}>一图总结博文内容，优化各平台传播效果</p>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}`,
                  background: T.surface, boxShadow: `0 20px 60px rgba(0,0,0,0.4)`,
                }}>
                  <div style={{
                    height: 200, position: "relative",
                    background: `linear-gradient(135deg, #0B0F1A 0%, #1A1040 40%, ${T.accent} 100%)`,
                    padding: 28, display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  }}>
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{
                        display: "inline-block", padding: "4px 10px", borderRadius: 6,
                        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                        fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 12,
                      }}>📊 深度解析</div>
                      <h3 style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.3, margin: 0 }}>
                        {blog?.title}
                      </h3>
                    </div>
                  </div>
                  <div style={{ padding: "24px 28px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {blog?.outline.slice(0, 4).map((sec, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                            background: [T.accent, T.green, T.orange, T.pink][i % 4] + "22",
                            color: [T.accent, T.green, T.orange, T.pink][i % 4],
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 700, fontFamily: T.fontMono, marginTop: 1,
                          }}>{i + 1}</div>
                          <span style={{ fontSize: 13.5, color: T.textMuted, lineHeight: 1.5 }}>{sec.h}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}`,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: `linear-gradient(135deg, ${T.accent}, ${T.green})`,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                        }}>✦</div>
                        <span style={{ fontSize: 12, color: T.textDim }}>BlogCraft · {blog?.readTime} 阅读</span>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {blog?.keywords.slice(0, 3).map((kw, i) => (
                          <span key={i} style={{
                            padding: "2px 8px", borderRadius: 4, fontSize: 10,
                            background: T.accentGlow, color: T.accentLight, fontFamily: T.fontMono,
                          }}>#{kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center" }}>
                  <ActionBtn icon={<Icons.Download />} label="下载 PNG" />
                  <ActionBtn icon={<Icons.Download />} label="下载 SVG" />
                  <ActionBtn icon={<Icons.Copy />} label="复制分享文案" />
                </div>
              </div>

              <div style={{ width: 280, flexShrink: 0 }}>
                <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <Icons.Share /> 分享平台优化
                  </h3>
                  {[
                    { name: "Twitter / X", size: "1200×675", icon: "𝕏" },
                    { name: "LinkedIn", size: "1200×627", icon: "in" },
                    { name: "微信公众号", size: "900×500", icon: "微" },
                    { name: "小红书", size: "1080×1440", icon: "📕" },
                    { name: "Instagram", size: "1080×1080", icon: "📷" },
                  ].map((p, i) => (
                    <button key={i} style={{
                      width: "100%", padding: "12px 14px", marginBottom: 8, borderRadius: 10,
                      border: `1px solid ${i === 0 ? T.accent : T.border}`,
                      background: i === 0 ? T.accentGlow : "transparent",
                      color: T.text, cursor: "pointer", fontFamily: T.font,
                      fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, background: T.card,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, flexShrink: 0,
                      }}>{p.icon}</div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: T.textDim }}>{p.size}</div>
                      </div>
                      {i === 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: T.green, fontWeight: 600 }}>当前</span>}
                    </button>
                  ))}
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                    <p style={{ fontSize: 12, color: T.textDim, marginBottom: 10 }}>自动生成文案</p>
                    <div style={{
                      background: T.card, borderRadius: 10, padding: 14,
                      fontSize: 13, color: T.textMuted, lineHeight: 1.7, border: `1px solid ${T.border}`,
                    }}>
                      🤖 AI Agent正在从"工具"进化为"协作伙伴"。从编程到客服，智能体已在多个领域创造显著价值。<br /><br />
                      这篇深度解析带你了解2025年Agent技术的最新趋势👇<br /><br />
                      #AIAgent #人工智能 #大模型
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              textAlign: "center", marginTop: 48, padding: "32px 24px",
              background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`,
            }}>
              <h3 style={{ fontFamily: T.fontDisplay, fontSize: 20, marginBottom: 8 }}>🎉 博文创作完成！</h3>
              <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 20 }}>文章、配图和社媒卡片已全部生成，可以随时下载或分享</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <button onClick={reset} style={{
                  padding: "12px 24px", borderRadius: 10, border: `1px solid ${T.border}`,
                  background: "transparent", color: T.textMuted, cursor: "pointer",
                  fontFamily: T.font, fontSize: 14, fontWeight: 500,
                }}>新建博文</button>
                <button style={{
                  padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontFamily: T.font, fontSize: 14, fontWeight: 600,
                  background: `linear-gradient(135deg, ${T.green}, #00B09B)`, color: "#fff",
                }}>全部下载</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}

function GeneratingStep({ label, delay }) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => setDone(true), delay + 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [delay]);
  if (!visible) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 10,
      background: T.surface, border: `1px solid ${T.border}`, animation: "slideIn 0.4s ease",
    }}>
      {done ? (
        <div style={{ color: T.green }}><Icons.Check /></div>
      ) : (
        <div style={{
          width: 16, height: 16, borderRadius: "50%",
          border: `2px solid ${T.border}`, borderTopColor: T.accent,
          animation: "spin 0.8s linear infinite",
        }} />
      )}
      <span style={{ fontSize: 13, color: done ? T.text : T.textMuted }}>{label}</span>
    </div>
  );
}

function BlogTitle({ text }) {
  const { displayed, done } = useTypewriter(text, 30, true);
  return (
    <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 700, lineHeight: 1.4, marginBottom: 16, color: T.text }}>
      {displayed}
      {!done && <span style={{ color: T.accent, animation: "pulse 0.5s ease infinite" }}>|</span>}
    </h2>
  );
}

function ActionBtn({ icon, label }) {
  return (
    <button style={{
      padding: "8px 14px", borderRadius: 8, border: `1px solid ${T.border}`,
      background: "transparent", color: T.textMuted, cursor: "pointer",
      fontFamily: T.font, fontSize: 12, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderLight; e.currentTarget.style.color = T.text; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
    >
      {icon} {label}
    </button>
  );
}

function SmallBtn({ icon }) {
  return (
    <button style={{
      width: 28, height: 28, borderRadius: 6, border: `1px solid ${T.border}`,
      background: "transparent", color: T.textDim, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderLight; e.currentTarget.style.color = T.text; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
    >
      {icon}
    </button>
  );
}
