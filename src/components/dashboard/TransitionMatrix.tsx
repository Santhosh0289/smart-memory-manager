import { motion } from "framer-motion";

interface TransitionMatrixProps {
  matrix: Record<string, Record<string, number>>;
}

const labels: Record<string, string> = {
  Light_Usage: "Light",
  Medium_Usage: "Medium",
  Heavy_Usage: "Heavy",
};

export function TransitionMatrix({ matrix }: TransitionMatrixProps) {
  const states = ["Light_Usage", "Medium_Usage", "Heavy_Usage"];

  const getIntensity = (value: number) => {
    if (value > 60) return "bg-primary/40 text-primary";
    if (value > 30) return "bg-warning/30 text-warning";
    if (value > 10) return "bg-destructive/20 text-foreground";
    return "bg-secondary/50 text-muted-foreground";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.42 }}
      className="glass-card rounded-lg p-5"
    >
      <div className="mb-4">
        <h3 className="font-mono text-sm font-semibold text-foreground">State Transition Matrix</h3>
        <p className="text-xs text-muted-foreground">Probability of transitioning between states (%)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left text-muted-foreground">From \ To</th>
              {states.map((s) => (
                <th key={s} className="p-2 text-center font-mono text-muted-foreground">{labels[s]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {states.map((from) => (
              <tr key={from}>
                <td className="p-2 font-mono font-medium text-foreground">{labels[from]}</td>
                {states.map((to) => (
                  <td key={to} className="p-1 text-center">
                    <span className={`inline-block w-14 rounded px-2 py-1.5 font-mono font-semibold ${getIntensity(matrix[from]?.[to] || 0)}`}>
                      {matrix[from]?.[to] || 0}%
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
