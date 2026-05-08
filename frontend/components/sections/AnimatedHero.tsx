'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface AnimatedHeroProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  slogan?: string;
}

type NetworkNode = {
  id: string;
  label: string;
  image: string;
  radius: number;
  angle: number;
};

const NODES: NetworkNode[] = [
  { id: 'hf', label: '高频读写器', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_p6nq.jpg', radius: 160, angle: 0 },
  { id: 'uhf', label: '超高频读写器', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2184B_x6b5.jpg', radius: 160, angle: 60 },
  { id: 'ant', label: '天线系统', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2480B_4f8u.jpg', radius: 160, angle: 120 },
  { id: 'hht', label: '手持终端', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_7bkj.jpg', radius: 160, angle: 180 },
  { id: 'pad', label: '工业平板', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_hd05.jpg', radius: 160, angle: 240 },
  { id: 'mw', label: '中间件', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/4_3ji7.jpg', radius: 160, angle: 300 },
];

const NODE_SIZE = 96;

export default function AnimatedHero({ title, subtitle, ctaLabel, ctaUrl, slogan }: AnimatedHeroProps) {
  const [year, setYear] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    const target = 20;
    const duration = 2000;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setYear(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, []);

  const cx = 240;
  const cy = 220;

  function getNodePos(node: NetworkNode) {
    const rad = (node.angle * Math.PI) / 180;
    return {
      x: cx + Math.cos(rad) * node.radius,
      y: cy + Math.sin(rad) * node.radius,
    };
  }

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-neutral-900">
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-center">
          {/* ── Left: text ── */}
          <div className="lg:col-span-2 text-white">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-400/20 backdrop-blur-sm mb-8">
              <div className="text-2xl font-bold text-primary-400 tabular-nums">{year}<span className="text-primary-300">+</span></div>
              <div className="text-xs text-neutral-400 leading-tight">
                年专注<br />RFID领域
              </div>
            </div>

            <div className="w-12 h-0.5 bg-primary-400 mb-8 animate-fade-in" />

            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold mb-5 animate-fade-in-up leading-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-base text-neutral-300 mb-7 animate-fade-in-up font-light leading-relaxed">
                {subtitle}
              </p>
            )}

            {slogan && (
              <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-400/10 border border-accent-400/25">
                  <svg className="w-4 h-4 text-accent-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span className="text-sm font-semibold text-accent-200 tracking-wide">{slogan}</span>
                </div>
              </div>
            )}

            {ctaLabel && ctaUrl && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {ctaLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* ── Right: RFID network ── */}
          <div className="lg:col-span-3 relative flex items-center justify-center">
            <svg
              viewBox="0 0 480 440"
              className="w-full max-w-[560px] h-auto"
              aria-label="RFID product network"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="spoke-active" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* ── Spokes: center → each node ── */}
              {NODES.map((node, i) => {
                const pos = getNodePos(node);
                const isHovered = hoveredNode === i;

                return (
                  <g key={`spoke-${i}`} style={{ transition: 'opacity 0.4s' }}>
                    {/* Base line */}
                    <line
                      x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                      stroke={isHovered ? 'url(#spoke-active)' : '#1e293b'}
                      strokeWidth={isHovered ? 1.5 : 0.6}
                      filter={isHovered ? 'url(#glow)' : undefined}
                    />
                    {/* Outward-traveling pulse (all simultaneous, staggered) */}
                    <circle r="3" fill="#22d3ee" filter="url(#glow)">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        begin={`${i * 0.5}s`}
                        path={`M${cx},${cy} L${pos.x},${pos.y}`}
                      />
                    </circle>
                  </g>
                );
              })}

              {/* ── Center hub ── */}
              <g>
                {/* Core circle */}
                <circle cx={cx} cy={cy} r="18" fill="transparent" stroke="#06b6d4" strokeOpacity="0.25" strokeWidth="1">
                  <animate attributeName="r" values="18;21;18" dur="6s" repeatCount="indefinite" />
                </circle>

                {/* Wave icon */}
                <g transform={`translate(${cx - 9}, ${cy - 8})`} stroke="#22d3ee" strokeWidth="1.3" fill="none" opacity="0.7">
                  <path d="M9 0 Q13 4 9 8 Q5 4 9 0" />
                  <path d="M4 1 Q8 5 4 9 Q0 5 4 1" />
                  <path d="M14 1 Q18 5 14 9 Q10 5 14 1" />
                </g>
              </g>

              {/* ── Product nodes (flat, no border) ── */}
              {NODES.map((node, i) => {
                const pos = getNodePos(node);
                const isHovered = hoveredNode === i;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(i)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Position group (SVG transform) */}
                    <g transform={`translate(${pos.x}, ${pos.y})`}>
                      {/* Scale via CSS transform on inner div */}
                      <g>
                        <foreignObject x={-NODE_SIZE / 2} y={-NODE_SIZE / 2} width={NODE_SIZE} height={NODE_SIZE}>
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', overflow: 'hidden', transform: isHovered ? 'scale(1.5)' : 'scale(1)', transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)', transformBox: 'fill-box', transformOrigin: 'center' }}>
                            <img
                              src={node.image}
                              alt={node.label}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              loading="lazy"
                            />
                          </div>
                        </foreignObject>
                      </g>
                    </g>

                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + NODE_SIZE / 2 + 16}
                      textAnchor="middle"
                      fill={isHovered ? '#67e8f9' : '#94a3b8'}
                      style={{ fontSize: '10px', fontFamily: 'system-ui, sans-serif', fontWeight: isHovered ? 600 : 400, transition: 'fill 0.3s' }}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
    </section>
  );
}
