'use client'

import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { month: 'Jan', revenue: 1420000, target: 1200000 },
  { month: 'Feb', revenue: 1680000, target: 1350000 },
  { month: 'Mar', revenue: 1590000, target: 1400000 },
  { month: 'Apr', revenue: 1890000, target: 1550000 },
  { month: 'May', revenue: 2120000, target: 1750000 },
  { month: 'Jun', revenue: 2400000, target: 2000000 },
]

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#1E40AF',
  },
  target: {
    label: 'Target',
    color: '#94A3B8',
  },
} satisfies ChartConfig

export function ClippedAreaChart() {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Performance Vector
          </span>
          <h3 className="text-xl font-bold tracking-tight text-zinc-900">
            Revenue & Growth Trajectory
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E40AF]" />
            <span className="text-zinc-600">Actual Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
            <span className="text-zinc-400">Target</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" stroke="#94A3B8" tickLine={false} tickMargin={8} fontSize={11} />
            <YAxis
              stroke="#94A3B8"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="target"
              type="monotone"
              stroke="#CBD5E1"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fill="none"
            />
            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="#1E40AF"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}

