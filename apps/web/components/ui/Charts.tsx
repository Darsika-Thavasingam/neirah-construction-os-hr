/**
 * Pure SVG chart components — no external dependencies.
 * Enhanced with smooth grow-up SVG animations, pulse effects, and interactive hover highlights.
 */

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

export function DonutChart({
  data,
  size = 150,
  thickness = 26,
  centerLabel = 'Employess',
  centerValue = 482,
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div style={{ width: size, height: size }} />;

  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const gap = 3;

  let offset = 0;
  const slices = data.map((d) => {
    const fraction = d.value / total;
    const dashLen = Math.max(0, fraction * circumference - gap);
    const slice = { ...d, dashLen, offset };
    offset += fraction * circumference;
    return slice;
  });

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.07) 0%, rgba(255, 255, 255, 0) 70%)',
        borderRadius: '50%',
        padding: 4,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        <defs>
          <radialGradient id="donutGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
          <style>{`
            @keyframes donutRotate {
              0% { transform: rotate(-90deg); }
              100% { transform: rotate(270deg); }
            }
            .donut-slice-anim {
              transition: stroke-dasharray 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s ease, filter 0.3s ease;
              cursor: pointer;
            }
            .donut-slice-anim:hover {
              stroke-width: ${thickness + 4}px;
              filter: drop-shadow(0 4px 12px rgba(37, 99, 235, 0.4));
            }
          `}</style>
        </defs>

        {/* Ambient Backdrop Ring */}
        <circle cx={cx} cy={cy} r={r + thickness / 2} fill="url(#donutGlow)" />

        {/* Decorative Grid Rings */}
        <circle cx={cx} cy={cy} r={r - thickness / 2 - 2} fill="none" stroke="rgba(226, 232, 240, 0.6)" strokeWidth={1} strokeDasharray="3 3" />

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(241, 245, 249, 0.9)" strokeWidth={thickness} />

        {/* Slices */}
        {slices.map((s, i) => (
          <circle
            key={i}
            className="donut-slice-anim"
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${s.dashLen} ${circumference - s.dashLen}`}
            strokeDashoffset={circumference / 4 - s.offset}
            strokeLinecap="round"
          />
        ))}

        {/* Center text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={22}
          fontWeight={800}
          fill="#0F172A"
          fontFamily="Inter, sans-serif"
        >
          {centerValue}
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11.5}
          fontWeight={600}
          fill="#64748B"
          fontFamily="Inter, sans-serif"
        >
          {centerLabel}
        </text>
      </svg>
    </div>
  );
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  barColor?: string;
}

export function MiniBarChart({ data, height = 140, barColor = '#2563EB' }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = 32;
  const gap = 16;
  const width = data.length * (barW + gap) - gap;
  const chartH = height - 36;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        background: 'linear-gradient(180deg, rgba(239, 246, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)',
        padding: '8px 12px 0',
        borderRadius: 14,
        border: '1px solid rgba(226, 232, 240, 0.6)',
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="barGradientBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <style>{`
            @keyframes barGrowUp {
              0% { transform: scaleY(0); }
              100% { transform: scaleY(1); }
            }
            @keyframes barGlowPulse {
              0%, 100% { filter: drop-shadow(0 2px 6px rgba(37, 99, 235, 0.25)); }
              50% { filter: drop-shadow(0 4px 14px rgba(37, 99, 235, 0.5)); }
            }
            .animated-bar {
              transform-origin: bottom;
              animation: barGrowUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              cursor: pointer;
              transition: fill 0.25s ease, filter 0.25s ease, transform 0.25s ease;
            }
            .animated-bar:hover {
              filter: drop-shadow(0 6px 12px rgba(37, 99, 235, 0.4));
              transform: scaleY(1.04);
            }
            .active-top-bar {
              animation: barGrowUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards, barGlowPulse 2.5s infinite ease-in-out;
            }
          `}</style>
        </defs>

        {/* Background Horizontal Guidelines */}
        {[0.25, 0.5, 0.75].map((ratio, idx) => (
          <line
            key={idx}
            x1={0}
            y1={chartH * (1 - ratio)}
            x2={width}
            y2={chartH * (1 - ratio)}
            stroke="#E2E8F0"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
        ))}

        {data.map((d, i) => {
          const barH = Math.max(8, (d.value / max) * (chartH - 20));
          const x = i * (barW + gap);
          const y = chartH - barH;
          const isHighest = d.value === max;

          return (
            <g key={i}>
              {/* Value text above bar */}
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={isHighest ? '#1D4ED8' : '#2563EB'}
                fontFamily="Inter, sans-serif"
              >
                {d.value}
              </text>

              {/* Bar with grow-up animation */}
              <rect
                className={`animated-bar ${isHighest ? 'active-top-bar' : ''}`}
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={6}
                ry={6}
                fill={isHighest ? 'url(#barGradientActive)' : 'url(#barGradientBlue)'}
                style={{ animationDelay: `${i * 0.08}s` }}
              />

              {/* Month Label below bar */}
              <text
                x={x + barW / 2}
                y={chartH + 18}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="#64748B"
                fontFamily="Inter, sans-serif"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface LegendProps {
  items: { label: string; value: number; color: string; pct?: string }[];
}

export function ChartLegend({ items }: LegendProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
          <span style={{ width: 130, color: '#334155', fontWeight: 500 }}>{item.label}</span>
          <span style={{ width: 36, fontWeight: 700, color: '#0F172A', textAlign: 'right' }}>{item.value}</span>
          {item.pct && (
            <span style={{ width: 40, color: '#64748B', fontSize: 12, textAlign: 'right' }}>
              {item.pct}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
