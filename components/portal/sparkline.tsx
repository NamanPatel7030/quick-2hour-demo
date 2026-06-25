'use client';

import { useId, useMemo } from 'react';

interface SparklineProps {
  data: number[];
  height?: number;
  stroke?: string;
  fill?: string;
  showDots?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  height = 36,
  stroke = 'var(--color-primary-base)',
  fill = 'var(--color-primary-lighter)',
  showDots = false,
  className,
}: SparklineProps) {
  const id = useId();
  const { path, area, points, width, min, max } = useMemo(() => {
    if (!data.length) {
      return { path: '', area: '', points: [], width: 100, min: 0, max: 0 };
    }
    const minV = Math.min(...data);
    const maxV = Math.max(...data);
    const range = maxV - minV || 1;
    const w = 100;
    const h = height;
    const stepX = w / Math.max(data.length - 1, 1);
    const pts = data.map((v, i) => ({
      x: i * stepX,
      y: h - ((v - minV) / range) * h,
    }));
    const pathD = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');
    const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;
    return { path: pathD, area: areaD, points: pts, width: w, min: minV, max: maxV };
  }, [data, height]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ width: '100%', height }}
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.8" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {showDots &&
        points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={1.6} fill={stroke} />
        ))}
    </svg>
  );
}