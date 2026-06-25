'use client';

import * as React from 'react';
import { ArrowRight, BarChart3, Download, Filter } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PageHeader } from '@/components/portal/page-header';
import { KpiCard } from '@/components/portal/kpi-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  dannyKpis,
  recoveryTrend,
  statusMix,
  topModalities,
  recoveryByAttorney,
} from '@/data/kpis';
import { formatCurrency, formatPercent } from '@/lib/format';
import { cn } from '@/utils/cn';

type Range = '30d' | '90d' | '365d' | 'All';

const RANGES: { value: Range; label: string }[] = [
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '365d', label: '365D' },
  { value: 'All', label: 'All' },
];

export default function InsightsPage() {
  const [range, setRange] = React.useState<Range>('365d');

  const totalStatus = statusMix.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Insights into your recovery, billing, and case performance."
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="size-3.5" />
              All attorneys
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="size-3.5" />
              All modalities
            </Button>
          </div>
        }
        actions={
          <>
            <div className="inline-flex items-center rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-0.5">
              {RANGES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRange(r.value)}
                  className={cn(
                    'h-8 px-3 text-xs font-medium rounded-md transition-colors',
                    range === r.value
                      ? 'bg-primary-base text-text-white-0 shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'text-text-sub-600 hover:text-text-strong-950 hover:bg-bg-weak-50',
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="md">
              <Download className="size-4" />
              Export
            </Button>
          </>
        }
      />

      {/* KPI strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dannyKpis.map((k) => (
          <KpiCard key={k.id} kpi={k} href={k.href} />
        ))}
      </section>

      {/* Recovery trend + Status mix */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <CardTitle>Recovery trend</CardTitle>
                <span className="text-xs text-text-sub-600">
                  Recovered vs target — last 12 months
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Legend2 color="var(--color-primary-base)" label="Recovered" dashed={false} />
                <Legend2 color="var(--color-text-soft-400)" label="Target" dashed />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RecoveryTrendChart />
            <div className="mt-5 grid grid-cols-3 gap-3">
              <InsightStat
                label="Recovered (Jun)"
                value={formatCurrency(1842500, { compact: true })}
                sublabel="vs $17.6K last month"
              />
              <InsightStat
                label="Avg vs target"
                value="+5.3%"
                sublabel="Above plan YTD"
                tone="success"
              />
              <InsightStat
                label="Variance"
                value="$1.0K"
                sublabel="Under target in Q1"
                tone="warning"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status mix</CardTitle>
            <span className="text-xs text-text-sub-600">All active cases</span>
          </CardHeader>
          <CardContent>
            <StatusMixDonut total={totalStatus} />
          </CardContent>
        </Card>
      </section>

      {/* Top modalities + Recovery by attorney */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top modalities by billed</CardTitle>
              <span className="text-xs text-text-sub-600 tabular-nums">YTD</span>
            </div>
          </CardHeader>
          <CardContent>
            <TopModalitiesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recovery rate by attorney</CardTitle>
              <span className="text-xs text-text-sub-600 tabular-nums">% of billed</span>
            </div>
          </CardHeader>
          <CardContent>
            <RecoveryByAttorneyChart />
          </CardContent>
        </Card>
      </section>

      {/* Footer summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SummaryTile
          label="Total billed YTD"
          value={formatCurrency(18750000, { compact: true })}
          sublabel="$18.75M across 58 cases"
        />
        <SummaryTile
          label="Total recovered"
          value={formatCurrency(8420000, { compact: true })}
          sublabel="44.9% collection rate"
        />
        <SummaryTile
          label="Avg days to paid"
          value="38d"
          sublabel="−4d vs Q1"
          tone="success"
        />
      </section>
    </div>
  );
}

/* ---------------- Charts ---------------- */

function RecoveryTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={recoveryTrend}
        margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
      >
        <defs>
          <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-base)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--color-primary-base)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke="var(--color-stroke-soft-200)"
          strokeDasharray="0"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          stroke="var(--color-text-soft-400)"
          tick={{ fontSize: 11 }}
          dy={6}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="var(--color-text-soft-400)"
          tick={{ fontSize: 11 }}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
          width={48}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: 'var(--color-stroke-sub-300)', strokeDasharray: '3 3' }}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="var(--color-text-soft-400)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          activeDot={false}
          name="Target"
        />
        <Line
          type="monotone"
          dataKey="recovered"
          stroke="var(--color-primary-base)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--color-primary-base)' }}
          activeDot={{ r: 5, fill: 'var(--color-primary-base)' }}
          name="Recovered"
          fill="url(#recoveryGradient)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function StatusMixDonut({ total }: { total: number }) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={statusMix}
            cx="50%"
            cy="46%"
            innerRadius={62}
            outerRadius={92}
            paddingAngle={2}
            dataKey="value"
            stroke="var(--color-bg-white-0)"
            strokeWidth={2}
          >
            {statusMix.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 top-[36%] flex flex-col items-center">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
          Total
        </span>
        <span className="text-title-h4 font-semibold tracking-tight tabular-nums">
          {total}
        </span>
        <span className="text-[11px] text-text-sub-600">cases</span>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        {statusMix.slice(0, 8).map((s) => (
          <li key={s.name} className="flex items-center gap-1.5 min-w-0">
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: s.fill }}
            />
            <span className="truncate text-text-sub-600 flex-1">{s.name}</span>
            <span className="tabular-nums text-text-strong-950 font-medium">
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopModalitiesChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={topModalities}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
        barCategoryGap={10}
      >
        <CartesianGrid
          stroke="var(--color-stroke-soft-200)"
          strokeDasharray="0"
          horizontal={false}
        />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          stroke="var(--color-text-soft-400)"
          tick={{ fontSize: 11 }}
          tickFormatter={(v: number) => `$${(v / 100000).toFixed(0)}K`}
        />
        <YAxis
          type="category"
          dataKey="modality"
          tickLine={false}
          axisLine={false}
          stroke="var(--color-text-strong-950)"
          tick={{ fontSize: 11 }}
          width={100}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: 'var(--color-bg-weak-50)' }}
        />
        <Bar
          dataKey="billed"
          fill="var(--color-primary-base)"
          radius={[0, 6, 6, 0]}
        >
          <LabelList
            dataKey="billed"
            position="right"
            formatter={(v: unknown) => formatCurrency(Number(v ?? 0), { compact: true })}
            style={{
              fill: 'var(--color-text-strong-950)',
              fontSize: 11,
              fontWeight: 500,
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function RecoveryByAttorneyChart() {
  const data = [...recoveryByAttorney].sort((a, b) => b.recovery - a.recovery);
  const palette = [
    'var(--color-primary-base)',
    'var(--color-information-base)',
    'var(--color-success-base)',
    'var(--color-warning-base)',
    'var(--color-feature-base)',
    'var(--color-away-base)',
  ];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 32, left: 8, bottom: 4 }}
        barCategoryGap={10}
      >
        <CartesianGrid
          stroke="var(--color-stroke-soft-200)"
          strokeDasharray="0"
          horizontal={false}
        />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          stroke="var(--color-text-soft-400)"
          tick={{ fontSize: 11 }}
          domain={[0, 1]}
          tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
        />
        <YAxis
          type="category"
          dataKey="attorney"
          tickLine={false}
          axisLine={false}
          stroke="var(--color-text-strong-950)"
          tick={{ fontSize: 11 }}
          width={100}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-bg-weak-50)' }} />
        <Bar dataKey="recovery" radius={[0, 6, 6, 0]}>
          {data.map((d, i) => (
            <Cell key={d.attorney} fill={palette[i % palette.length]} />
          ))}
          <LabelList
            dataKey="recovery"
            position="right"
            formatter={(v: unknown) => {
              const num = Number(v ?? 0);
              return `${formatPercent(num, 0)} · ${data.find((d) => d.recovery === num)?.cases ?? 0} cases`;
            }}
            style={{
              fill: 'var(--color-text-strong-950)',
              fontSize: 11,
              fontWeight: 500,
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------------- Tooltip + small bits ---------------- */

interface TooltipPayload {
  color?: string;
  name?: string;
  value?: number;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-stroke-soft-200 bg-bg-white-0 shadow-lg px-3 py-2 text-xs min-w-[160px]">
      {label && (
        <div className="font-semibold text-text-strong-950 mb-1.5">{label}</div>
      )}
      <ul className="flex flex-col gap-1">
        {payload.map((p) => {
          const v = p.value;
          const formatted = isCurrencyKey(p.dataKey)
            ? formatCurrency(Number(v ?? 0), { compact: false })
            : p.dataKey === 'recovery'
              ? formatPercent(Number(v ?? 0), 0)
              : String(v);
          return (
            <li key={p.name} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-text-sub-600">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                {p.name}
              </span>
              <span className="tabular-nums font-medium text-text-strong-950">
                {formatted}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function isCurrencyKey(k: string | undefined): boolean {
  return k === 'recovered' || k === 'target' || k === 'billed' || k === 'value';
}

function Legend2({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-text-sub-600">
      <span
        className="inline-block w-5 h-0.5 rounded-full"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)`
            : color,
        }}
      />
      {label}
    </span>
  );
}

function InsightStat({
  label,
  value,
  sublabel,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  sublabel: string;
  tone?: 'success' | 'warning' | 'neutral';
}) {
  const toneClass =
    tone === 'success'
      ? 'text-success-base'
      : tone === 'warning'
        ? 'text-warning-base'
        : 'text-text-strong-950';
  return (
    <div className="rounded-lg border border-stroke-soft-200 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
        {label}
      </div>
      <div className={cn('mt-1 text-title-h6 font-semibold tabular-nums', toneClass)}>
        {value}
      </div>
      <div className="text-[11px] text-text-sub-600 mt-0.5">{sublabel}</div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  sublabel,
  tone,
}: {
  label: string;
  value: string;
  sublabel: string;
  tone?: 'success';
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-text-sub-600">
          {label}
        </div>
        <div
          className={cn(
            'mt-2 text-title-h4 font-semibold tracking-tight tabular-nums',
            tone === 'success' && 'text-success-base',
          )}
        >
          {value}
        </div>
        <div className="mt-1 text-xs text-text-sub-600 inline-flex items-center gap-1">
          {sublabel}
          <ArrowRight className="size-3 text-text-soft-400" />
        </div>
      </CardContent>
    </Card>
  );
}