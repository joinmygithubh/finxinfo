import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  PieChart as PieIcon,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const mockMonthlyData = [
  { month: 'Jun', revenue: 42000, expenses: 24000, profit: 18000 },
  { month: 'Jul', revenue: 51000, expenses: 27000, profit: 24000 },
  { month: 'Aug', revenue: 49000, expenses: 25500, profit: 23500 },
  { month: 'Sep', revenue: 63000, expenses: 31000, profit: 32000 },
  { month: 'Oct', revenue: 72000, expenses: 34000, profit: 38000 },
  { month: 'Nov', revenue: 86450, expenses: 38200, profit: 48250 },
];

export const InteractiveDashboardVisual = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full max-w-xl mx-auto lg:max-w-none bg-navy-950/90 backdrop-blur-xl border border-navy-700/80 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-white"
    >
      {/* Top Header / Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center text-americanRed border border-navy-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-white">
                Executive Financial Ledger
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Live Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-400">QuickBooks Online &bull; All Accounts Tied</p>
          </div>
        </div>

        {/* ProAdvisor Verified Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 border border-navy-700 text-xs font-semibold text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CPA Verified</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
        {/* Metric 1 */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Monthly Revenue</span>
            <span className="text-emerald-400 font-semibold flex items-center text-[11px]">
              +18.4%
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-heading text-white">$86,450</div>
          <div className="text-[10px] text-slate-400 mt-1">Categorized & Clean</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Operating Net</span>
            <span className="text-emerald-400 font-semibold flex items-center text-[11px]">
              +24.1%
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-heading text-emerald-400">$48,250</div>
          <div className="text-[10px] text-slate-400 mt-1">Margin: 55.8%</div>
        </div>

        {/* Metric 3 */}
        <div className="col-span-2 sm:col-span-1 bg-navy-900/90 border border-navy-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Reconciliation</span>
            <span className="text-amber-400 font-semibold text-[11px]">Daily</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-heading text-white">100%</div>
          <div className="w-full bg-navy-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-1.5 rounded-full w-full"></div>
          </div>
        </div>
      </div>

      {/* Chart View Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 bg-navy-900 p-1 rounded-lg border border-navy-800 text-xs">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
              activeTab === 'revenue'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cash Flow / P&L
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
              activeTab === 'expenses'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Operating Expenses
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Audit-Ready Status</span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-44 sm:h-48 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockMonthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2A64A7" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#0A2342" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C62835" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#C62835" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#06162B',
                borderColor: '#1E3A8A',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fff',
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, '']}
            />
            {activeTab === 'revenue' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Gross Revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Net Profit"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#profitGrad)"
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey="expenses"
                name="Operating Expenses"
                stroke="#C62835"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Ledger Verification Banner */}
      <div className="mt-3 pt-3 border-t border-navy-800/90 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Federal & State Tax Readiness:</span>
          <span className="font-bold text-emerald-400">100% Prepared</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Last reconciled by <span className="text-white font-medium">FinXinfo ProAdvisor</span> 12 mins ago
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveDashboardVisual;

