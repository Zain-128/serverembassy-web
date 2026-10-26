"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Cpu, HardDrive, Layers, ShieldCheck, Wind, Zap } from "lucide-react";

interface Chapter {
  index: string;
  tag: string;
  title: [string, string];
  specLabel: string;
  specValue: string;
  description: string;
  icon: typeof Cpu;
  start: number;
  end: number;
}

const CHAPTERS: Chapter[] = [
  {
    index: "01",
    tag: "The Media Unit",
    title: ["Enterprise NVMe", "Solid-State Drive Module"],
    specLabel: "Throughput",
    specValue: "14,000 MB/s Read · Power-Loss Protected",
    description:
      "It begins at the drive level. High-speed enterprise solid-state media with multi-layer 3D NAND, hardware encryption, and precision aluminum hot-swap sled.",
    icon: HardDrive,
    start: 0.0,
    end: 0.19,
  },
  {
    index: "02",
    tag: "16-Bay Matrix",
    title: ["Hot-Swap Backplane", "High-Density Drive Cage"],
    specLabel: "Capacity",
    specValue: "16x U.3 NVMe Bays · Up to 122TB Raw",
    description:
      "Each drive docks seamlessly into the front array, mating directly with high-bandwidth backplanes and real-time status telemetry indicators.",
    icon: Layers,
    start: 0.20,
    end: 0.39,
  },
  {
    index: "03",
    tag: "Compute Engine",
    title: ["Dual-Socket Core", "32x DDR5 ECC Memory"],
    specLabel: "Compute",
    specValue: "Dual 64-Core CPUs & Copper Vapor Chambers",
    description:
      "The motherboard slides into the chassis, marrying dual high-TDP processor sockets with electro-polished copper heatpipe arrays and 32 DDR5 channels.",
    icon: Cpu,
    start: 0.40,
    end: 0.64,
  },
  {
    index: "04",
    tag: "Thermal Dynamics",
    title: ["Laminar Airflow", "Counter-Rotating Fan Wall"],
    specLabel: "Cooling",
    specValue: "6x Hot-Swap Redundant Fans & Baffle",
    description:
      "A 6-module high-CFM fan partition clicks into place behind the drive array, guiding high-static pressure airflow across the compute engine.",
    icon: Wind,
    start: 0.65,
    end: 0.81,
  },
  {
    index: "05",
    tag: "Mission Critical",
    title: ["Titanium Redundancy", "Ready for Deployment"],
    specLabel: "Reliability",
    specValue: "Dual 2400W 80+ Titanium PSUs · 99.999% SLA",
    description:
      "Rear redundant power modules and PCIe Gen5 accelerators engage. The brushed aluminum top cover locks flush with integrated laser telemetry.",
    icon: Zap,
    start: 0.82,
    end: 1.0,
  },
];

const TOTAL_FRAMES = 80;
const FRAME_PATH = (idx: number) =>
  `/frames/server/frame_${String(idx).padStart(5, "0")}.webp`;

export default function ServerCinematicScrubber() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const stateRef = useRef({
    currentFrame: 0,
    targetFrame: 0,
    progress: 0,
    loadedCount: 0,
    isReady: false,
  });

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [loadPct, setLoadPct] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Canvas render routine:
  // On desktop, the 3D server is anchored dedicatedly in the RIGHT column!
  // The LEFT column is 100% reserved for the build narrative.
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const isDesktop = window.innerWidth >= 1024;

    // Responsive contain scaling: server top and bottom are NEVER clipped
    const fitScale = Math.min(cw / iw, ch / ih);
    const scale = isDesktop ? fitScale * 1.05 : Math.min(cw / iw, ch / ih) * 1.1;
    const dw = iw * scale;
    const dh = ih * scale;

    // Desktop: Anchor the 3D model in the right 60% zone
    let dx = (cw - dw) * 0.5;
    if (isDesktop) {
      const rightCenter = cw * 0.65;
      dx = rightCenter - dw * 0.5;
    }

    const dy = (ch - dh) * 0.5 + (isDesktop ? ch * 0.03 : 0);

    ctx.fillStyle = "#05070c";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    drawFrame(Math.round(stateRef.current.currentFrame));
  }, [drawFrame]);

  // Preloader
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    let loaded = 0;
    const onSingleLoad = (index: number) => {
      if (!mounted) return;
      loaded++;
      stateRef.current.loadedCount = loaded;
      const pct = Math.round((loaded / TOTAL_FRAMES) * 100);
      setLoadPct(pct);

      if (index === 0) {
        drawFrame(0);
      }

      if (loaded >= 12 && !stateRef.current.isReady) {
        stateRef.current.isReady = true;
        setIsLoaded(true);
      }

      if (loaded === TOTAL_FRAMES) {
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => onSingleLoad(i);
      img.onerror = () => onSingleLoad(i);
      img.src = FRAME_PATH(i + 1);
      images[i] = img;
    }

    return () => {
      mounted = false;
    };
  }, [drawFrame]);

  // Scroll listener & Lerp Animation Loop
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      stateRef.current.progress = progress;
      stateRef.current.targetFrame = progress * (TOTAL_FRAMES - 1);

      const chapterIdx = CHAPTERS.findIndex(
        (c) => progress >= c.start && progress <= c.end
      );
      if (chapterIdx !== -1) {
        setActiveChapterIndex(chapterIdx);
      }

      if (!userInteracted && progress > 0.02) {
        setUserInteracted(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const loop = () => {
      const state = stateRef.current;
      const diff = state.targetFrame - state.currentFrame;

      if (Math.abs(diff) > 0.01) {
        state.currentFrame += diff * 0.14;
        const frameToDraw = Math.max(
          0,
          Math.min(TOTAL_FRAMES - 1, Math.round(state.currentFrame))
        );
        drawFrame(frameToDraw);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [drawFrame, resizeCanvas, userInteracted]);

  const scrollToChapter = (idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    const targetProgress = CHAPTERS[idx].start + 0.03;
    const targetY = container.offsetTop + targetProgress * totalScrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const currentChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  return (
    <section
      ref={containerRef}
      className="relative h-[480vh] bg-[#05070c] text-white selection:bg-[#0066ff] selection:text-white"
      aria-label="PowerLine Enterprise Assembly Flow"
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#05070c]">
        {/* Hardware 3D Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: isLoaded ? 1 : 0.4 }}
        />

        {/* Cinematic Backdrop & Left Shadow Mask */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,transparent_45%,#05070c_90%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[48%] bg-gradient-to-r from-[#05070c] via-[#05070c]/95 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#05070c] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05070c] to-transparent" />

        {/* Ambient Lights */}
        <div className="pointer-events-none absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-[#0066ff]/14 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-[#ffaa00]/10 blur-[130px]" />

        {/* MAIN STAGE GRID: LEFT (Narrative Stepper) | RIGHT (Assembly Flow) */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-8 md:px-12">
          {/* Top Brand & Telemetry Bar */}
          <div className="flex items-center justify-between pt-24 md:pt-28">
            <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-[#070b14]/80 px-4 py-1.5 backdrop-blur-md shadow-md">
              <span className="flex h-2 w-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                Manufacturing & Assembly Flow
              </p>
            </div>

            {/* Step Counter */}
            <div className="flex items-center gap-2 font-mono text-xs text-white/70 rounded-full border border-white/10 bg-[#070b14]/80 px-3.5 py-1.5 backdrop-blur-md shadow-md">
              <span className="font-bold text-[#00f0ff]">{currentChapter.index}</span>
              <span className="text-white/30">/</span>
              <span className="text-white/40">05</span>
            </div>
          </div>

          {/* Middle Body: Dedicated Left Column Narrative */}
          <div className="my-auto grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5 max-w-lg">
              {/* Interactive 5-Step Stepper */}
              <div className="mb-5 flex flex-wrap items-center gap-1.5">
                {CHAPTERS.map((ch, idx) => (
                  <button
                    key={ch.index}
                    onClick={() => scrollToChapter(idx)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      activeChapterIndex === idx
                        ? "bg-[#0066ff] text-white shadow-[0_0_12px_rgba(0,102,255,0.45)] font-semibold"
                        : "border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {ch.index} {ch.tag.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Active Chapter Content */}
              {CHAPTERS.map((ch, idx) => {
                const isActive = activeChapterIndex === idx;
                const Icon = ch.icon;

                return (
                  <div
                    key={ch.index}
                    className={`transition-all duration-500 ease-out ${
                      isActive
                        ? "opacity-100 translate-y-0 block"
                        : "opacity-0 translate-y-4 hidden pointer-events-none"
                    }`}
                  >
                    {/* Chapter Tag */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#0066ff]/40 bg-[#0066ff]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00f0ff] backdrop-blur-sm">
                      <Icon size={14} className="text-[#00f0ff]" />
                      <span>
                        {ch.index} — {ch.tag}
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 className="mt-3.5 font-display text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-[40px]">
                      {ch.title[0]} <br />
                      <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                        {ch.title[1]}
                      </span>
                    </h2>

                    {/* Narrative Description */}
                    <p className="mt-3.5 text-sm leading-relaxed text-white/75">
                      {ch.description}
                    </p>

                    {/* Hardware Specification Pill */}
                    <div className="mt-5 inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs backdrop-blur-md">
                      <span className="font-mono uppercase tracking-wider text-white/40">
                        {ch.specLabel}:
                      </span>
                      <span className="font-semibold text-white/95">
                        {ch.specValue}
                      </span>
                    </div>

                    {/* Action Buttons on Step 05 */}
                    {idx === 4 && (
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                          href="/shop"
                          className="group inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-5 py-2.5 text-xs md:text-sm font-semibold text-white shadow-[0_4px_25px_rgba(0,102,255,0.45)] transition-all hover:bg-[#0052cc]"
                        >
                          Configure Server
                          <ArrowRight
                            size={15}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs md:text-sm font-semibold text-white/90 backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10"
                        >
                          Request Architecture Quote
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Free space for 3D assembly canvas */}
            <div className="hidden lg:col-span-7 lg:block" />
          </div>

          {/* Bottom Progress Scrubber */}
          <div className="flex flex-col gap-2.5 pb-2">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#0066ff] via-[#00f0ff] to-[#ffaa00] transition-all duration-150 ease-out shadow-[0_0_12px_#00f0ff]"
                style={{
                  width: `${Math.max(2, Math.min(100, stateRef.current.progress * 100))}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/50">
              <div className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00ff66]" />
                <span className="font-mono tracking-wider uppercase">
                  Drive → Chassis → Compute → Thermal → Lockdown
                </span>
              </div>

              {!userInteracted && (
                <div className="hidden items-center gap-2 font-mono text-white/70 animate-pulse sm:flex">
                  <span>Scroll down to experience full build flow</span>
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              )}

              <div className="font-mono">
                {Math.round(stateRef.current.progress * 100)}% ASSEMBLED
              </div>
            </div>
          </div>
        </div>

        {/* Loading Pill */}
        {!isLoaded && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[#05070c]/85 backdrop-blur-sm transition-opacity duration-500">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0a0f1d]/90 px-6 py-5 shadow-2xl">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066ff]">
                <Cpu size={22} className="animate-spin text-white" />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-white/80">
                Calibrating Assembly Sequence
              </p>
              <div className="h-1.5 w-36 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-[#0066ff] transition-all duration-200"
                  style={{ width: `${loadPct}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-white/50">
                {loadPct}% Cached
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
