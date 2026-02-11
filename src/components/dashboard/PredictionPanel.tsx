import { motion } from "framer-motion";
import { Activity, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { simulatePredictions } from "@/lib/dataProcessing";

export function PredictionPanel() {
  const [prediction, setPrediction] = useState(simulatePredictions());

  useEffect(() => {
    const interval = setInterval(() => setPrediction(simulatePredictions()), 5000);
    return () => clearInterval(interval);
  }, []);

  const stateColors: Record<string, string> = {
    Light: "text-primary",
    Medium: "text-warning",
    Heavy: "text-destructive",
  };

  const barColors: Record<string, string> = {
    Light: "bg-primary",
    Medium: "bg-warning",
    Heavy: "bg-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card glow-primary rounded-lg p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-sm font-semibold text-foreground">LSTM Prediction</h3>
        <span className="animate-pulse-glow ml-auto h-2 w-2 rounded-full bg-accent" />
      </div>

      <div className="mb-5 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Next Predicted State</p>
        <motion.p
          key={prediction.predictedState}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-mono text-3xl font-bold ${stateColors[prediction.predictedState]}`}
        >
          {prediction.predictedState}
        </motion.p>
        <p className="font-mono text-xs text-muted-foreground">
          Confidence: <span className="text-foreground">{prediction.confidence}%</span>
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Probability Distribution</p>
        {prediction.probabilities.map((p) => (
          <div key={p.state} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-foreground">{p.state}</span>
              <span className="font-mono text-muted-foreground">{p.probability}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.probability}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${barColors[p.state]}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
