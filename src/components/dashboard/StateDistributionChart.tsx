import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { StateDistribution } from "@/lib/dataProcessing";

interface StateDistributionChartProps {
  data: StateDistribution[];
}

const COLORS = ["hsl(185, 80%, 50%)", "hsl(35, 90%, 55%)", "hsl(340, 70%, 55%)"];

export function StateDistributionChart({ data }: StateDistributionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card rounded-lg p-5"
    >
      <div className="mb-4">
        <h3 className="font-mono text-sm font-semibold text-foreground">State Distribution</h3>
        <p className="text-xs text-muted-foreground">Activity cluster proportions</p>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="state" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: 8,
                fontSize: 12,
                color: "hsl(210, 20%, 90%)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-3">
          {data.map((d, i) => (
            <div key={d.state} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-foreground">{d.state}</span>
                </span>
                <span className="font-mono text-muted-foreground">{d.percentage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
