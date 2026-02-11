import { motion } from "framer-motion";
import { ActionLogEntry } from "@/lib/dataProcessing";

interface ActionLogTableProps {
  logs: ActionLogEntry[];
}

const stateStyles: Record<string, string> = {
  Light: "bg-primary/20 text-primary",
  Medium: "bg-warning/20 text-warning",
  Heavy: "bg-destructive/20 text-destructive",
};

export function ActionLogTable({ logs }: ActionLogTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="glass-card rounded-lg p-5"
    >
      <div className="mb-4">
        <h3 className="font-mono text-sm font-semibold text-foreground">Proactive Action Log</h3>
        <p className="text-xs text-muted-foreground">Memory interventions triggered by ML predictions</p>
      </div>
      <div className="scrollbar-thin max-h-[320px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 font-medium">Time</th>
              <th className="pb-2 font-medium">State</th>
              <th className="pb-2 font-medium">Action</th>
              <th className="pb-2 font-medium text-right">Conf.</th>
              <th className="pb-2 font-medium text-right">Freed</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                <td className="py-2 font-mono text-muted-foreground">{log.timestamp.substring(11)}</td>
                <td className="py-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${stateStyles[log.predictedState]}`}>
                    {log.predictedState}
                  </span>
                </td>
                <td className="py-2 text-foreground">{log.action}</td>
                <td className="py-2 text-right font-mono text-foreground">{log.confidence}%</td>
                <td className="py-2 text-right font-mono text-accent">{log.memoryFreed} MB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
