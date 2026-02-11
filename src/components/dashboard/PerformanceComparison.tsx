import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PerformanceComparisonProps {
  reactiveLatency: number;
  proactiveLatency: number;
  reduction: number;
}

export function PerformanceComparison({ reactiveLatency, proactiveLatency, reduction }: PerformanceComparisonProps) {
  const data = [
    { name: "Reactive", latency: reactiveLatency, fill: "hsl(340, 70%, 55%)" },
    { name: "Proactive (ML)", latency: proactiveLatency, fill: "hsl(160, 70%, 45%)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="glass-card rounded-lg p-5"
    >
      <div className="mb-4">
        <h3 className="font-mono text-sm font-semibold text-foreground">Latency Comparison</h3>
        <p className="text-xs text-muted-foreground">
          Reactive vs Proactive scheduling · <span className="text-accent">{reduction}% reduction</span>
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 10 }} stroke="hsl(220, 15%, 18%)" unit=" ms" />
          <YAxis type="category" dataKey="name" tick={{ fill: "hsl(210, 20%, 90%)", fontSize: 12 }} stroke="hsl(220, 15%, 18%)" width={110} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 15%, 18%)",
              borderRadius: 8,
              fontSize: 12,
              color: "hsl(210, 20%, 90%)",
            }}
            formatter={(value: number) => [`${value} ms`, "Avg Latency"]}
          />
          <Bar dataKey="latency" radius={[0, 4, 4, 0]}>
            {data.map((entry, idx) => (
              <motion.rect key={idx} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
