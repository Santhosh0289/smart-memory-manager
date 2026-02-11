import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TimeSeriesPoint } from "@/lib/dataProcessing";

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-lg p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-mono text-sm font-semibold text-foreground">System Resource Timeline</h3>
          <p className="text-xs text-muted-foreground">CPU & Memory usage over 30 days</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary" /> CPU %
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent" /> Memory MB
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(185, 80%, 50%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(185, 80%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 10 }}
            tickFormatter={(v) => v?.substring(5, 10)}
            stroke="hsl(220, 15%, 18%)"
          />
          <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 10 }} stroke="hsl(220, 15%, 18%)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 15%, 18%)",
              borderRadius: 8,
              fontSize: 12,
              color: "hsl(210, 20%, 90%)",
            }}
          />
          <Area type="monotone" dataKey="avgCPU" stroke="hsl(185, 80%, 50%)" fill="url(#cpuGrad)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="avgMemoryMB" stroke="hsl(160, 70%, 45%)" fill="url(#memGrad)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
