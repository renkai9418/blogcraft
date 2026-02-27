import { useState, useEffect, useCallback, useRef } from "react";

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
  red: "#FF4757",
  text: "#E8ECF4",
  textMuted: "#7B8AB8",
  textDim: "#4A5578",
  font: "'DM Sans', sans-serif",
  fontDisplay: "'Playfair Display', serif",
  fontMono: "'JetBrains Mono', monospace",
};

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

// ─── Icons ───
const I = {
  Settings: () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Wand: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M15 4V2m0 2v2m0-2h2m-2 0h-2m-4.586 4.586L3 18l3 3 9.414-9.414" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.414 8.586l6 6" strokeLinecap="round"/></svg>,
  Globe: () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z"/></svg>,
  Image: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Share: () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>,
  Sparkles: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" strokeLinejoin="round"/></svg>,
  Check: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ArrowRight: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Link: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round"/></svg>,
  FileText: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  Copy: () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Download: () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Refresh: () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>,
  X: () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>,
  Key: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Eye: () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>,
  Plus: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14" strokeLinecap="round"/></svg>,
  Zap: () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinejoin="round" strokeLinecap="round"/></svg>,
};

// ─── Simulated blog data ───
const DEMO_BLOG = {
  title: "2025年AI Agent的崛起：从工具到协作伙伴的进化之路",
  meta: "深度解析AI Agent技术演进、落地场景与未来趋势，探讨智能体如何重塑人机协作范式。",
  sections: [
    {
      h: "引言：从ChatBot到Agent的范式跃迁",
      p: "2024年被称为「大模型应用元年」，而2025年正在成为「AI Agent爆发年」。当LLM从单纯的对话工具进化为具备自主规划、工具调用和持续学习能力的智能体，人机协作的边界正在被重新定义。这不仅是技术的进步，更是整个软件交互范式的根本性变革。",
      canImage: false,
    },
    {
      h: "什么是AI Agent？重新理解智能体",
      p: "AI Agent不仅仅是一个能聊天的模型，而是具备感知环境、自主决策、执行行动和反馈迭代四大核心能力的系统。它能够分解复杂任务、动态调用外部工具、在多步推理中保持上下文一致性，并根据执行结果自我修正。从ReAct框架到Plan-and-Execute范式，Agent架构正在快速演进。",
      canImage: true,
      imagePrompt: "一张展示AI Agent核心架构的示意图：感知→决策→执行→反馈的循环流程",
    },
    {
      h: "落地场景：Agent已经在哪些领域创造价值",
      p: "在软件开发领域，Cursor、Claude Code等编程Agent已经能完成从需求分析到代码部署的全流程；在企业办公中，智能助手Agent可以自动处理邮件、安排日程、生成报告；在客户服务场景，Agent能根据用户历史行为提供个性化解决方案，将平均处理时间缩短60%以上。",
      canImage: true,
      imagePrompt: "展示AI Agent在不同行业（编程、办公、客服）中的应用场景拼图",
    },
    {
      h: "技术挑战与解决路径",
      p: "当前Agent面临的核心挑战包括：长程推理中的「幻觉累积」问题、多Agent协作时的通信效率、以及安全边界的精确控制。业界正在通过强化学习微调、结构化记忆系统、以及分层权限管控等方法逐步突破这些瓶颈。MCP协议的出现为Agent间的标准化通信提供了可能。",
      canImage: true,
      imagePrompt: "技术挑战的可视化图：幻觉累积、通信效率、安全边界三大挑战及解决方案",
    },
    {
      h: "展望：Agent Native的未来",
      p: "正如Mobile Native重塑了App生态，Agent Native将重新定义软件交互范式。未来的操作系统可能以Agent为核心，用户不再需要手动操作每个应用，而是通过自然语言描述目标，由Agent自主编排和执行。这不是取代人类，而是让人类专注于更高价值的创造性工作。",
      canImage: false,
    },
  ],
  socialTitle: "AI Agent 2025: 从工具到伙伴",
  socialSubtitle: "智能体如何重塑人机协作的未来",
  seoScore: 92,
  keywords: ["AI Agent", "智能体", "大模型应用", "LLM", "人机协作", "自主决策"],
  readTime: "8 min",
  wordCount: 3200,
};

const IMAGE_STYLES = [
  { id: "tech-minimal", name: "科技极简", desc: "清晰线条 · 几何构图", color: "#6C5CE7", trend: true, bg: "linear-gradient(135deg, #0B0F1A 0%, #1A1040 50%, #6C5CE7 100%)" },
  { id: "gradient-glass", name: "毛玻璃渐变", desc: "柔和渐变 · 磨砂质感", color: "#00D2B4", trend: true, bg: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #00D2B4 100%)" },
  { id: "flat-illust", name: "扁平插画", desc: "矢量风格 · 色彩鲜明", color: "#FF9F43", trend: true, bg: "linear-gradient(135deg, #FF9F43 0%, #FF6B6B 50%, #ee5a24 100%)" },
  { id: "3d-render", name: "3D 渲染", desc: "C4D风格 · 立体质感", color: "#FF6B9D", trend: false, bg: "linear-gradient(135deg, #FF6B9D 0%, #c44569 50%, #6C5CE7 100%)" },
];

// ─── API Providers config ───
const API_PROVIDERS = [
  { id: "anthropic", name: "Anthropic (Claude)", placeholder: "sk-ant-...", docUrl: "https://console.anthropic.com/" },
  { id: "openai", name: "OpenAI", placeholder: "sk-...", docUrl: "https://platform.openai.com/api-keys" },
  { id: "openai-image", name: "OpenAI (DALL·E 图片)", placeholder: "sk-...", docUrl: "https://platform.openai.com/api-keys" },
  { id: "midjourney", name: "Midjourney API", placeholder: "mj-...", docUrl: "https://docs.midjourney.com/" },
];

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function BlogGenerator() {
  const [step, setStep] = useState(0);
  // 0=input, 1=generating blog, 2=blog result (with inline image slots), 3=social card
  const [inputMode, setInputMode] = useState("topic");
  const [topic, setTopic] = useState("");
  const [blog, setBlog] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState(() => {
    const saved = {};
    API_PROVIDERS.forEach(p => { saved[p.id] = ""; });
    return saved;
  });
  const [sectionImages, setSectionImages] = useState({});
  const [generatingSection, setGeneratingSection] = useState(null);
  const [selectedStylePerSection, setSelectedStylePerSection] = useState({});
  const [showSocial, setShowSocial] = useState(false);
  const [socialGenerating, setSocialGenerating] = useState(false);
  const [socialReady, setSocialReady] = useState(false);
  const [socialStyle, setSocialStyle] = useState("tech-minimal");

  useEffect(() => {
    if (!document.querySelector(`link[href*="Playfair"]`)) {
      const el = document.createElement("link");
      el.rel = "stylesheet"; el.href = FONTS_LINK;
      document.head.appendChild(el);
    }
  }, []);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setStep(1);
    setTimeout(() => { setBlog(DEMO_BLOG); setStep(2); }, 3200);
  };

  const handleGenerateSectionImage = (sectionIdx) => {
    const style = selectedStylePerSection[sectionIdx] || "tech-minimal";
    setGeneratingSection(sectionIdx);
    setTimeout(() => {
      setSectionImages(prev => ({
        ...prev,
        [sectionIdx]: { style, images: [1, 2, 3], selected: null },
      }));
      setGeneratingSection(null);
    }, 2200);
  };

  const handleSelectSectionImage = (sectionIdx, imageIdx) => {
    setSectionImages(prev => ({
      ...prev,
      [sectionIdx]: { ...prev[sectionIdx], selected: imageIdx },
    }));
  };

  const handleGenerateSocial = () => {
    setSocialGenerating(true);
    setTimeout(() => {
      setSocialGenerating(false);
      setSocialReady(true);
    }, 2000);
  };

  const reset = () => {
    setStep(0); setBlog(null); setTopic("");
    setSectionImages({}); setGeneratingSection(null);
    setSelectedStylePerSection({}); setShowSocial(false);
    setSocialGenerating(false); setSocialReady(false);
  };

  const hasConfiguredApi = Object.values(apiKeys).some(v => v.trim().length > 0);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font, color: T.text, position: "relative", overflow: "hidden" }}>
      {/* Background glows */}
      <div style={{ position: "fixed", top: "-30%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${T.accentGlow} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T.greenGlow} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      {/* ═══ HEADER ═══ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100, padding: "14px 28px",
        borderBottom: `1px solid ${T.border}`, background: "rgba(11,15,26,0.88)",
        backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>BlogCraft</span>
          <span style={{ fontSize: 9, fontFamily: T.fontMono, padding: "2px 7px", borderRadius: 20, background: T.accentGlow, color: T.accentLight, fontWeight: 500 }}>AI-POWERED</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {step >= 2 && (
            <Btn onClick={reset} ghost small><I.Refresh /> 新建</Btn>
          )}
          <Btn onClick={() => setShowSettings(true)} ghost small style={{ position: "relative" }}>
            <I.Settings />
            <span>设置</span>
            {!hasConfiguredApi && (
              <div style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: T.red }} />
            )}
          </Btn>
        </div>
      </header>

      {/* ═══ SETTINGS MODAL ═══ */}
      {showSettings && (
        <SettingsModal
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          onClose={() => setShowSettings(false)}
        />
      )}

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 80px", position: "relative", zIndex: 1 }}>

        {/* ═══ STEP 0: INPUT ═══ */}
        {step === 0 && (
          <div style={{ maxWidth: 680, margin: "48px auto 0", animation: "fadeUp 0.6s ease" }}>
            {/* API Warning */}
            {!hasConfiguredApi && (
              <div onClick={() => setShowSettings(true)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                background: "rgba(255,71,87,0.08)", border: `1px solid rgba(255,71,87,0.2)`,
                borderRadius: 12, marginBottom: 24, cursor: "pointer", transition: "all 0.2s",
              }}>
                <I.Key />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.orange }}>尚未配置 API Key</div>
                  <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>点击此处设置 Claude 或 OpenAI 的 API Token 以启用 AI 功能</div>
                </div>
                <div style={{ marginLeft: "auto", color: T.textDim }}><I.ArrowRight /></div>
              </div>
            )}

            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <h1 style={{
                fontFamily: T.fontDisplay, fontSize: 42, fontWeight: 700, lineHeight: 1.2, marginBottom: 14,
                background: `linear-gradient(135deg, ${T.text} 0%, ${T.accentLight} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>AI 驱动的博文创作</h1>
              <p style={{ color: T.textMuted, fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
                输入主题，自动生成 SEO 友好博文，智能段落配图，一键生成社媒分享卡片
              </p>
            </div>

            {/* Input Mode Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 18, padding: 4, background: T.surface, borderRadius: 12, border: `1px solid ${T.border}` }}>
              {[
                { id: "topic", label: "一句话主题", icon: <I.Sparkles /> },
                { id: "detail", label: "详细大意", icon: <I.FileText /> },
                { id: "url", label: "输入 URL", icon: <I.Link /> },
              ].map(m => (
                <button key={m.id} onClick={() => setInputMode(m.id)} style={{
                  flex: 1, padding: "10px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                  fontFamily: T.font, fontSize: 13, fontWeight: 500,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  background: inputMode === m.id ? T.accent : "transparent",
                  color: inputMode === m.id ? "#fff" : T.textMuted, transition: "all 0.25s",
                }}>{m.icon} {m.label}</button>
              ))}
            </div>

            {/* Input */}
            <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, padding: 20, marginBottom: 14 }}>
              {inputMode === "url" ? (
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
                  placeholder="https://example.com/your-blog-post"
                  style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "13px 15px", color: T.text, fontFamily: T.fontMono, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border}
                />
              ) : (
                <textarea value={topic} onChange={e => setTopic(e.target.value)}
                  placeholder={inputMode === "topic" ? "例如：2025年AI Agent的发展趋势与落地场景分析" : "请描述博文大意，包括核心观点、目标读者、文章风格等..."}
                  rows={inputMode === "topic" ? 2 : 5}
                  style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "13px 15px", color: T.text, fontFamily: T.font, fontSize: 15, outline: "none", resize: "vertical", lineHeight: 1.7, boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border}
                />
              )}
            </div>

            {/* Generate Button */}
            <button onClick={handleGenerate} disabled={!topic.trim()} style={{
              width: "100%", padding: "15px 24px", borderRadius: 13, border: "none",
              cursor: topic.trim() ? "pointer" : "not-allowed", fontFamily: T.font, fontSize: 16, fontWeight: 600,
              background: topic.trim() ? `linear-gradient(135deg, ${T.accent}, #8B5CF6)` : T.surface,
              color: topic.trim() ? "#fff" : T.textDim,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: topic.trim() ? `0 8px 32px ${T.accentGlow}` : "none",
              opacity: topic.trim() ? 1 : 0.6, transition: "all 0.3s",
            }}><I.Wand /> 生成博文</button>

            {/* Quick Examples */}
            <div style={{ marginTop: 28 }}>
              <p style={{ fontSize: 11, color: T.textDim, marginBottom: 10, fontWeight: 500, letterSpacing: "0.05em" }}>快速体验</p>
              {[
                "2025年AI Agent的发展趋势与落地场景分析",
                "远程办公三年后：我们学到了什么",
                "为什么Rust正在成为系统编程的未来",
              ].map((ex, i) => (
                <button key={i} onClick={() => setTopic(ex)} style={{
                  width: "100%", textAlign: "left", padding: "11px 15px", borderRadius: 10, marginBottom: 6,
                  background: T.surface, border: `1px solid ${T.border}`, color: T.textMuted,
                  fontFamily: T.font, fontSize: 13.5, cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 8,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderLight; e.currentTarget.style.color = T.text; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}
                ><I.ArrowRight /> {ex}</button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 1: GENERATING ═══ */}
        {step === 1 && (
          <div style={{ maxWidth: 500, margin: "100px auto", textAlign: "center", animation: "fadeUp 0.5s ease" }}>
            <div style={{ width: 56, height: 56, margin: "0 auto 28px", borderRadius: "50%", border: `3px solid ${T.border}`, borderTopColor: T.accent, animation: "spin 1s linear infinite" }} />
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 600, marginBottom: 10 }}>正在生成博文<LoadingDots /></h2>
            <p style={{ color: T.textMuted, fontSize: 14 }}>AI 正在分析主题、构建大纲、优化 SEO</p>
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10, maxWidth: 340, margin: "28px auto 0" }}>
              {["分析主题与关键词", "构建文章大纲", "生成正文内容", "SEO & GEO 优化"].map((s, i) => (
                <AnimatedStep key={i} label={s} delay={i * 700} />
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 2: BLOG RESULT with inline image generation ═══ */}
        {step === 2 && blog && (
          <div style={{ animation: "fadeUp 0.5s ease", marginTop: 20 }}>
            <div style={{ display: "flex", gap: 20 }}>
              {/* Left: Blog Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 28 }}>
                  {/* Blog Title */}
                  <h2 style={{ fontFamily: T.fontDisplay, fontSize: 25, fontWeight: 700, lineHeight: 1.4, marginBottom: 14, color: T.text }}>{blog.title}</h2>
                  <p style={{ color: T.textMuted, fontSize: 13.5, lineHeight: 1.8, marginBottom: 28, fontStyle: "italic", borderLeft: `3px solid ${T.accent}`, paddingLeft: 14 }}>{blog.meta}</p>

                  {/* Sections with inline image generation */}
                  {blog.sections.map((sec, idx) => (
                    <div key={idx} style={{ marginBottom: 32 }}>
                      <h3 style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, fontFamily: T.fontMono, color: T.accent, background: T.accentGlow, padding: "2px 7px", borderRadius: 4 }}>H2</span>
                        {sec.h}
                      </h3>
                      <p style={{ color: T.textMuted, fontSize: 14, lineHeight: 1.9, marginBottom: 12 }}>{sec.p}</p>

                      {/* ── Image generation slot for this section ── */}
                      {sec.canImage && (
                        <SectionImageSlot
                          sectionIdx={idx}
                          section={sec}
                          sectionImages={sectionImages}
                          generatingSection={generatingSection}
                          selectedStylePerSection={selectedStylePerSection}
                          setSelectedStylePerSection={setSelectedStylePerSection}
                          onGenerate={() => handleGenerateSectionImage(idx)}
                          onSelectImage={(imgIdx) => handleSelectSectionImage(idx, imgIdx)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom actions */}
                <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  <Btn ghost small><I.Copy /> 复制全文</Btn>
                  <Btn ghost small><I.Download /> 导出 Markdown</Btn>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => setShowSocial(true)} style={{
                    padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                    fontFamily: T.font, fontSize: 14, fontWeight: 600,
                    background: `linear-gradient(135deg, ${T.accent}, #8B5CF6)`, color: "#fff",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: `0 4px 20px ${T.accentGlow}`,
                  }}><I.Share /> 生成社媒卡片</button>
                </div>
              </div>

              {/* Right: SEO Panel */}
              <div style={{ width: 260, flexShrink: 0 }}>
                <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, padding: 20, position: "sticky", top: 80 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}><I.Globe /> SEO 分析</h3>
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto", background: `conic-gradient(${T.green} ${blog.seoScore * 3.6}deg, ${T.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 66, height: 66, borderRadius: "50%", background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                        <span style={{ fontSize: 24, fontWeight: 700, color: T.green, fontFamily: T.fontMono }}>{blog.seoScore}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 16, padding: "12px 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: T.fontMono }}>{blog.wordCount.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>字数</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: T.fontMono }}>{blog.readTime}</div>
                      <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>阅读</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: T.textDim, marginBottom: 8, fontWeight: 500 }}>关键词</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {blog.keywords.map((kw, i) => (
                      <span key={i} style={{ padding: "3px 8px", borderRadius: 5, fontSize: 11, background: T.accentGlow, color: T.accentLight, fontFamily: T.fontMono }}>{kw}</span>
                    ))}
                  </div>
                  {/* Image count */}
                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                    <p style={{ fontSize: 11, color: T.textDim, marginBottom: 6, fontWeight: 500 }}>配图进度</p>
                    {blog.sections.filter(s => s.canImage).map((sec, i) => {
                      const realIdx = blog.sections.indexOf(sec);
                      const hasImage = sectionImages[realIdx]?.selected != null;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", fontSize: 12, color: hasImage ? T.green : T.textDim }}>
                          {hasImage ? <I.Check /> : <span>○</span>}
                          <span style={{ color: T.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sec.h}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ═══ SOCIAL CARD MODAL ═══ */}
      {showSocial && blog && (
        <SocialCardModal
          blog={blog}
          socialStyle={socialStyle}
          setSocialStyle={setSocialStyle}
          generating={socialGenerating}
          ready={socialReady}
          onGenerate={handleGenerateSocial}
          onClose={() => { setShowSocial(false); setSocialReady(false); setSocialGenerating(false); }}
        />
      )}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.05); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        * { box-sizing:border-box; margin:0; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:${T.bg}; } ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:3px; }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════
function SettingsModal({ apiKeys, setApiKeys, onClose }) {
  const [visible, setVisible] = useState({});
  const toggleVisible = (id) => setVisible(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 520, maxHeight: "80vh", overflow: "auto",
        background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`,
        padding: 0, boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, fontFamily: T.font, display: "flex", alignItems: "center", gap: 8 }}>
              <I.Settings /> API 设置
            </h2>
            <p style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>配置各平台的 API Key 以启用 AI 功能</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", padding: 4 }}><I.X /></button>
        </div>

        {/* Provider List */}
        <div style={{ padding: "16px 24px 24px" }}>
          {API_PROVIDERS.map((provider) => (
            <div key={provider.id} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{provider.name}</label>
                <a href={provider.docUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: T.accentLight, textDecoration: "none" }}>获取 Key →</a>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    type={visible[provider.id] ? "text" : "password"}
                    value={apiKeys[provider.id]}
                    onChange={e => setApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                    placeholder={provider.placeholder}
                    style={{
                      width: "100%", background: T.card, border: `1px solid ${T.border}`,
                      borderRadius: 9, padding: "10px 40px 10px 12px", color: T.text,
                      fontFamily: T.fontMono, fontSize: 13, outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = T.accent}
                    onBlur={e => e.target.style.borderColor = T.border}
                  />
                  <button onClick={() => toggleVisible(provider.id)} style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: T.textDim, cursor: "pointer", padding: 2,
                  }}>
                    {visible[provider.id] ? <I.EyeOff /> : <I.Eye />}
                  </button>
                </div>
              </div>
              {apiKeys[provider.id] && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, fontSize: 11, color: T.green }}>
                  <I.Check /> 已配置
                </div>
              )}
            </div>
          ))}

          {/* Info box */}
          <div style={{
            padding: "12px 14px", borderRadius: 10, background: "rgba(108,92,231,0.06)",
            border: `1px solid rgba(108,92,231,0.15)`, marginTop: 8,
          }}>
            <p style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.7 }}>
              🔒 所有 API Key 仅保存在您的浏览器本地，不会上传到任何服务器。
              <br />文本生成使用 Anthropic/OpenAI，图片生成使用 DALL·E/Midjourney。
            </p>
          </div>

          {/* Save button */}
          <button onClick={onClose} style={{
            width: "100%", marginTop: 16, padding: "12px", borderRadius: 10,
            border: "none", fontFamily: T.font, fontSize: 14, fontWeight: 600,
            background: `linear-gradient(135deg, ${T.accent}, #8B5CF6)`,
            color: "#fff", cursor: "pointer",
          }}>保存设置</button>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════
// SECTION IMAGE SLOT (inline in blog)
// ═══════════════════════════════════════
function SectionImageSlot({ sectionIdx, section, sectionImages, generatingSection, selectedStylePerSection, setSelectedStylePerSection, onGenerate, onSelectImage }) {
  const data = sectionImages[sectionIdx];
  const isGenerating = generatingSection === sectionIdx;
  const currentStyle = selectedStylePerSection[sectionIdx] || "tech-minimal";
  const [expanded, setExpanded] = useState(false);

  // Already generated images
  if (data?.images) {
    const style = IMAGE_STYLES.find(s => s.id === data.style);
    return (
      <div style={{
        borderRadius: 12, border: `1px solid ${T.border}`, background: T.card,
        padding: 16, marginTop: 8, animation: "fadeUp 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <I.Image />
          <span style={{ fontSize: 12, fontWeight: 600 }}>段落配图</span>
          <span style={{ fontSize: 10, color: T.textDim, fontFamily: T.fontMono }}>· {style?.name}</span>
          {data.selected != null && (
            <span style={{ marginLeft: "auto", fontSize: 10, color: T.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <I.Check /> 已选择
            </span>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {data.images.map((_, imgIdx) => (
            <div key={imgIdx} onClick={() => onSelectImage(imgIdx)} style={{
              borderRadius: 10, overflow: "hidden", cursor: "pointer",
              border: `2px solid ${data.selected === imgIdx ? T.green : "transparent"}`,
              transition: "all 0.2s", position: "relative",
            }}>
              <div style={{
                height: 90, background: style?.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.2, backgroundImage: `radial-gradient(circle at ${30 + imgIdx * 20}% ${40 + imgIdx * 10}%, white 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: T.fontMono, zIndex: 1 }}>#{imgIdx + 1}</span>
              </div>
              {data.selected === imgIdx && (
                <div style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <I.Check />
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={onGenerate} style={{
          marginTop: 10, padding: "6px 12px", borderRadius: 7, fontSize: 11,
          border: `1px solid ${T.border}`, background: "transparent", color: T.textMuted,
          cursor: "pointer", fontFamily: T.font, display: "flex", alignItems: "center", gap: 5,
        }}><I.Refresh /> 重新生成</button>
      </div>
    );
  }

  // Generating state
  if (isGenerating) {
    return (
      <div style={{ borderRadius: 12, border: `1px solid ${T.border}`, background: T.card, padding: 20, marginTop: 8, textAlign: "center" }}>
        <div style={{ width: 32, height: 32, margin: "0 auto 12px", borderRadius: "50%", border: `2px solid ${T.border}`, borderTopColor: T.accent, animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: 12, color: T.textMuted }}>正在为此段落生成配图<LoadingDots /></p>
      </div>
    );
  }

  // Not yet generated — show trigger
  return (
    <div style={{
      borderRadius: 12, border: `1px dashed ${T.border}`, background: "rgba(108,92,231,0.03)",
      padding: 14, marginTop: 8, transition: "all 0.3s",
    }}>
      {!expanded ? (
        <button onClick={() => setExpanded(true)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "4px 0",
          background: "none", border: "none", cursor: "pointer", color: T.accentLight,
          fontFamily: T.font, fontSize: 13, fontWeight: 500,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: T.accentGlow, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I.Plus />
          </div>
          AI 建议在此处添加配图
          <span style={{ fontSize: 10, color: T.textDim, fontStyle: "italic", marginLeft: 4 }}>「{section.imagePrompt?.slice(0, 20)}...」</span>
        </button>
      ) : (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 10 }}>
            <I.Zap /> 建议配图：<span style={{ color: T.accentLight }}>{section.imagePrompt}</span>
          </p>
          {/* Style picker - compact */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {IMAGE_STYLES.map(s => (
              <button key={s.id} onClick={() => setSelectedStylePerSection(prev => ({ ...prev, [sectionIdx]: s.id }))} style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 500,
                border: `1.5px solid ${currentStyle === s.id ? s.color : T.border}`,
                background: currentStyle === s.id ? s.color + "18" : "transparent",
                color: currentStyle === s.id ? s.color : T.textMuted,
                cursor: "pointer", fontFamily: T.font, transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: s.bg, flexShrink: 0 }} />
                {s.name}
              </button>
            ))}
          </div>
          <button onClick={onGenerate} style={{
            padding: "9px 18px", borderRadius: 9, border: "none", cursor: "pointer",
            fontFamily: T.font, fontSize: 13, fontWeight: 600,
            background: `linear-gradient(135deg, ${T.accent}, #8B5CF6)`, color: "#fff",
            display: "flex", alignItems: "center", gap: 7,
            boxShadow: `0 4px 16px ${T.accentGlow}`,
          }}><I.Image /> 生成配图</button>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════
// SOCIAL CARD MODAL
// ═══════════════════════════════════════
function SocialCardModal({ blog, socialStyle, setSocialStyle, generating, ready, onGenerate, onClose }) {
  const [editTitle, setEditTitle] = useState(blog.socialTitle);
  const [editSubtitle, setEditSubtitle] = useState(blog.socialSubtitle);

  const style = IMAGE_STYLES.find(s => s.id === socialStyle);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 680, maxHeight: "90vh", overflow: "auto",
        background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`,
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}><I.Share /> 社媒分享卡片生成</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer" }}><I.X /></button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", gap: 20 }}>
          {/* Left: Card Preview */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: T.textDim, marginBottom: 10, fontWeight: 500 }}>预览</p>
            <div style={{
              borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}`,
              boxShadow: `0 12px 40px rgba(0,0,0,0.3)`,
            }}>
              {/* Card visual */}
              <div style={{
                height: 220, background: style?.bg || T.accent, position: "relative",
                display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24,
              }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.12, backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`, backgroundSize: "22px 22px" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h3 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.25, marginBottom: 8, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
                    {editTitle}
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
                    {editSubtitle}
                  </p>
                </div>
              </div>
              <div style={{ padding: "14px 20px", background: T.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: `linear-gradient(135deg, ${T.accent}, ${T.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✦</div>
                  <span style={{ fontSize: 11, color: T.textDim }}>BlogCraft · {blog.readTime}</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {blog.keywords.slice(0, 2).map((kw, i) => (
                    <span key={i} style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, background: T.accentGlow, color: T.accentLight, fontFamily: T.fontMono }}>#{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {ready && (
              <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "center" }}>
                <Btn ghost small><I.Download /> PNG</Btn>
                <Btn ghost small><I.Download /> SVG</Btn>
                <Btn ghost small><I.Copy /> 复制文案</Btn>
              </div>
            )}
          </div>

          {/* Right: Controls */}
          <div style={{ width: 240 }}>
            <p style={{ fontSize: 11, color: T.textDim, marginBottom: 8, fontWeight: 500 }}>主标题</p>
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{
              width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`,
              background: T.card, color: T.text, fontFamily: T.font, fontSize: 13, outline: "none",
              marginBottom: 12, boxSizing: "border-box",
            }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />

            <p style={{ fontSize: 11, color: T.textDim, marginBottom: 8, fontWeight: 500 }}>副标题</p>
            <input value={editSubtitle} onChange={e => setEditSubtitle(e.target.value)} style={{
              width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`,
              background: T.card, color: T.text, fontFamily: T.font, fontSize: 13, outline: "none",
              marginBottom: 16, boxSizing: "border-box",
            }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />

            <p style={{ fontSize: 11, color: T.textDim, marginBottom: 8, fontWeight: 500 }}>卡片风格</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {IMAGE_STYLES.map(s => (
                <button key={s.id} onClick={() => setSocialStyle(s.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                  borderRadius: 8, border: `1.5px solid ${socialStyle === s.id ? s.color : T.border}`,
                  background: socialStyle === s.id ? s.color + "12" : "transparent",
                  cursor: "pointer", fontFamily: T.font, fontSize: 12, color: T.text, transition: "all 0.2s",
                }}>
                  <div style={{ width: 28, height: 20, borderRadius: 5, background: s.bg, flexShrink: 0 }} />
                  {s.name}
                </button>
              ))}
            </div>

            <p style={{ fontSize: 11, color: T.textDim, marginBottom: 8, fontWeight: 500 }}>平台尺寸</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
              {[
                { name: "Twitter / X", size: "1200×675" },
                { name: "LinkedIn", size: "1200×627" },
                { name: "微信公众号", size: "900×500" },
                { name: "小红书", size: "1080×1440" },
                { name: "Instagram", size: "1080×1080" },
              ].map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 10px", borderRadius: 6, fontSize: 12,
                  background: i === 0 ? T.accentGlow : "transparent",
                  color: i === 0 ? T.accentLight : T.textMuted, cursor: "pointer",
                }}>
                  <span>{p.name}</span>
                  <span style={{ fontFamily: T.fontMono, fontSize: 10 }}>{p.size}</span>
                </div>
              ))}
            </div>

            <button onClick={onGenerate} disabled={generating} style={{
              width: "100%", padding: "11px", borderRadius: 10, border: "none",
              fontFamily: T.font, fontSize: 13, fontWeight: 600, cursor: generating ? "wait" : "pointer",
              background: generating ? T.card : `linear-gradient(135deg, ${T.accent}, #8B5CF6)`,
              color: generating ? T.textMuted : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {generating ? <><div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${T.border}`, borderTopColor: T.accent, animation: "spin 0.8s linear infinite" }} /> 生成中...</> : <><I.Sparkles /> 生成卡片图片</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════
function Btn({ children, ghost, small, onClick, style: extraStyle }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "7px 13px" : "10px 20px",
      borderRadius: small ? 8 : 10,
      border: ghost ? `1px solid ${T.border}` : "none",
      background: ghost ? "transparent" : T.accent,
      color: ghost ? T.textMuted : "#fff",
      cursor: "pointer", fontFamily: T.font,
      fontSize: small ? 12 : 14, fontWeight: 500,
      display: "flex", alignItems: "center", gap: 6,
      transition: "all 0.2s",
      ...extraStyle,
    }}>{children}</button>
  );
}

function LoadingDots() {
  const [d, setD] = useState("");
  useEffect(() => { const iv = setInterval(() => setD(p => p.length >= 3 ? "" : p + "."), 400); return () => clearInterval(iv); }, []);
  return <span style={{ fontFamily: T.fontMono, color: T.accentLight }}>{d || "."}</span>;
}

function AnimatedStep({ label, delay }) {
  const [v, setV] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setV(true), delay);
    const t2 = setTimeout(() => setDone(true), delay + 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [delay]);
  if (!v) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 9, background: T.surface, border: `1px solid ${T.border}`, animation: "slideIn 0.4s ease" }}>
      {done ? <div style={{ color: T.green }}><I.Check /></div> : <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${T.border}`, borderTopColor: T.accent, animation: "spin 0.8s linear infinite" }} />}
      <span style={{ fontSize: 13, color: done ? T.text : T.textMuted }}>{label}</span>
    </div>
  );
}
