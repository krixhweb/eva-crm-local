
import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/Card";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { formatCurrency } from "../../../../lib/utils";
import type { Deal } from '../../../../types';

type Props = {
  deals: Deal[]; // filtered deals provided by parent
  isDarkMode?: boolean;
};

const stages = ["Lead Gen","Qualification","Proposal","Demo","Negotiation","Closed Won","Closed Lost"];
const palette = ["#9CA3AF","#60A5FA","#A78BFA","#FACC15","#F97316","#22C55E","#EF4444"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, fill, percent, name }: any) => {
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 12;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={sx} cy={sy} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} textAnchor={textAnchor} fill="currentColor" fontSize="12px" fontWeight="500">{name}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} dy={14} textAnchor={textAnchor} fill="#6b7280" fontSize="11px">
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};


const Dashboard: React.FC<Props> = ({ deals }) => {
  // analytics
  const pipelineData = useMemo(() => {
    const byStage: Record<string, number> = {};
    deals.forEach(d => {
      if (!byStage[d.stage]) byStage[d.stage] = 0;
      byStage[d.stage] += d.value;
    });
    return stages.map((s, idx) => ({ name: s, value: byStage[s] || 0, color: palette[idx] })).filter(x => x.value > 0);
  }, [deals]);

  const totalPipelineValue = useMemo(() => pipelineData.reduce((s, p) => s + p.value, 0), [pipelineData]);
  const closedWon = deals.filter(d => d.stage === "Closed Won");
  const closedLost = deals.filter(d => d.stage === "Closed Lost");
  const winRate = (closedWon.length + closedLost.length) === 0 ? 0 : Math.round((closedWon.length / (closedWon.length + closedLost.length)) * 100);
  const totalRevenue = closedWon.reduce((s, d) => s + d.value, 0);

  // weekly mini chart - simple mock from deals created dates if available or values distribution
  const weekly = useMemo(() => {
    const vals = [0,0,0,0,0,0,0];
    deals.slice(-20).forEach((d, i) => vals[i % 7] += d.value / 1000);
    const labels = ["M","T","W","T","F","S","S"];
    return labels.map((l, i) => ({ name: l, v: Math.round(vals[i]) }));
  }, [deals]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Revenue Card */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
          <div>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-gray-500">From {closedWon.length} won deals this period.</p>
          </div>
          <div className="mt-4 w-full h-40 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                 <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}k`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }} 
                    formatter={(value: number) => formatCurrency(value * 1000)} 
                    labelFormatter={(label) => `Day: ${label}`}
                />
                <Bar dataKey="v" radius={[4,4,0,0]} barSize={20}>
                  {weekly.map((d, i) => <Cell key={i} fill={i === 3 ? "#16a34a" : "#86efac"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Value Distribution */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Pipeline Value Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[250px] w-full relative min-w-0">
            {pipelineData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-gray-500">No active deals</div>
            ) : (
                <>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 30, right: 60, bottom: 30, left: 60 }}>
                    <Pie
                        data={pipelineData}
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        labelLine
                        label={renderCustomizedLabel}
                    >
                        {pipelineData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
                    <div className="text-xs text-gray-500">Total Pipeline</div>
                </div>
                </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sales Report */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Sales Report</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="48" stroke="#e6e6e6" strokeWidth="14" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="48"
                stroke="url(#g1)"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={(1 - winRate / 100) * 2 * Math.PI * 48}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">{winRate}%</div>
              <div className="text-xs text-gray-500">Win Rate</div>
            </div>
          </div>

          <div className="w-full mt-3 border-t pt-2 flex justify-around text-sm">
            <div className="text-center">
              <div className="font-semibold">{formatCurrency(totalRevenue)}</div>
              <div className="text-xs text-gray-500">Won Revenue</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{closedWon.length}</div>
              <div className="text-xs text-gray-500">Deals Won</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{closedLost.length}</div>
              <div className="text-xs text-gray-500">Deals Lost</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
