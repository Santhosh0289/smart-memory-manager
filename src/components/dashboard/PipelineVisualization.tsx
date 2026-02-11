import { motion } from "framer-motion";
import { BrainCircuit, Database, GitBranch } from "lucide-react";

export function PipelineVisualization() {
  const stages = [
    { icon: Database, label: "Raw System Logs", sub: "79K+ process entries", color: "text-muted-foreground" },
    { icon: GitBranch, label: "K-Means Clustering", sub: "State abstraction (L/M/H)", color: "text-primary" },
    { icon: BrainCircuit, label: "LSTM Forecasting", sub: "Temporal sequence prediction", color: "text-accent" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-card rounded-lg p-5"
    >
      <h3 className="mb-4 font-mono text-sm font-semibold text-foreground">Hybrid ML Pipeline</h3>
      <div className="flex items-center justify-between">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.2 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="rounded-lg bg-secondary p-3">
                <stage.icon className={`h-5 w-5 ${stage.color}`} />
              </div>
              <p className="text-xs font-medium text-foreground">{stage.label}</p>
              <p className="text-[10px] text-muted-foreground">{stage.sub}</p>
            </motion.div>
            {i < stages.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                className="mx-2 h-px w-16 bg-gradient-to-r from-primary/50 to-accent/50"
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
