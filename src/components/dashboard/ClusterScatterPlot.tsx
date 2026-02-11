import { motion } from "framer-motion";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ClusterPoint } from "@/lib/dataProcessing";

interface ClusterScatterPlotProps {
  data: ClusterPoint[];
}

const COLORS: Record<string, string> = {
  Light_Usage: "hsl(185, 80%, 50%)",
  Medium_Usage: "hsl(35, 90%, 55%)",
  Heavy_Usage: "hsl(340, 70%, 55%)",
};

export function ClusterScatterPlot({ data }: ClusterScatterPlotProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-lg p-5"
    >
      <div className="mb-4">
        <h3 className="font-mono text-sm font-semibold text-foreground">K-Means Cluster Visualization</h3>
        <p className="text-xs text-muted-foreground">CPU vs Memory colored by usage cluster</p>
      </div>
      <div className="mb-3 flex gap-4 text-xs">
        {Object.entries(COLORS).map(([label, color]) => (
          <span key={label} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {label.replace("_", " ")}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
          <XAxis
            dataKey="cpu"
            name="CPU %"
            tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 10 }}
            stroke="hsl(220, 15%, 18%)"
            label={{ value: "CPU %", position: "bottom", fill: "hsl(215, 15%, 50%)", fontSize: 10 }}
          />
          <YAxis
            dataKey="memoryMB"
            name="Memory MB"
            tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 10 }}
            stroke="hsl(220, 15%, 18%)"
            label={{ value: "Memory MB", angle: -90, position: "insideLeft", fill: "hsl(215, 15%, 50%)", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 15%, 18%)",
              borderRadius: 8,
              fontSize: 12,
              color: "hsl(210, 20%, 90%)",
            }}
            formatter={(value: number, name: string) => [value.toFixed(2), name]}
          />
          <Scatter data={data} fill="hsl(185, 80%, 50%)">
            {data.map((entry, idx) => (
              <Cell key={idx} fill={COLORS[entry.cluster] || "hsl(215, 15%, 50%)"} opacity={0.6} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
