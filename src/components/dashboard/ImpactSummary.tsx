import { motion } from "framer-motion";
import { TrendingDown, Target, Shield, Gauge } from "lucide-react";

interface ImpactSummaryProps {
  metrics: {
    latencyReduction: number;
    predictionAccuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    totalInterventions: number;
    memoryRecovered: number;
    responsivenessImprovement: number;
  };
}

export function ImpactSummary({ metrics }: ImpactSummaryProps) {
  const items = [
    { label: "Latency Reduction", value: `${metrics.latencyReduction}%`, icon: TrendingDown, color: "text-accent" },
    { label: "Prediction Accuracy", value: `${metrics.predictionAccuracy}%`, icon: Target, color: "text-primary" },
    { label: "Precision / Recall", value: `${metrics.precision}% / ${metrics.recall}%`, icon: Shield, color: "text-chart-4" },
    { label: "Responsiveness ↑", value: `${metrics.responsivenessImprovement}%`, icon: Gauge, color: "text-accent" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card glow-accent rounded-lg p-5"
    >
      <div className="mb-4">
        <h3 className="font-mono text-sm font-semibold text-foreground">Impact Summary</h3>
        <p className="text-xs text-muted-foreground">ML pipeline evaluation metrics</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            className="rounded-md bg-secondary/50 p-3"
          >
            <item.icon className={`mb-1 h-4 w-4 ${item.color}`} />
            <p className={`font-mono text-lg font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex justify-between rounded-md bg-secondary/30 p-3 text-xs">
        <div>
          <span className="text-muted-foreground">Total Interventions</span>
          <p className="font-mono font-bold text-foreground">{metrics.totalInterventions.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Memory Recovered</span>
          <p className="font-mono font-bold text-foreground">{metrics.memoryRecovered} GB</p>
        </div>
        <div>
          <span className="text-muted-foreground">F1 Score</span>
          <p className="font-mono font-bold text-foreground">{metrics.f1Score}%</p>
        </div>
      </div>
    </motion.div>
  );
}
