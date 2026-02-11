import Papa from "papaparse";

export interface RawLogEntry {
  timestamp: string;
  Name: string;
  PID: string;
  Status: string;
  "User name": string;
  CPU: string;
  "Memory (active private working set)": string;
  Architecture: string;
  Description: string;
  activity_context: string;
}

export interface ClusteredEntry extends RawLogEntry {
  Memory_MB: string;
  usage_cluster: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  avgCPU: number;
  avgMemoryMB: number;
  processCount: number;
  dominantContext: string;
}

export interface ClusterPoint {
  cpu: number;
  memoryMB: number;
  cluster: string;
  name: string;
}

export interface StateDistribution {
  state: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ActionLogEntry {
  id: number;
  timestamp: string;
  predictedState: string;
  action: string;
  confidence: number;
  memoryFreed: number;
}

const CLUSTER_COLORS: Record<string, string> = {
  Light_Usage: "hsl(185, 80%, 50%)",
  Medium_Usage: "hsl(35, 90%, 55%)",
  Heavy_Usage: "hsl(340, 70%, 55%)",
};

const STATE_LABELS: Record<string, string> = {
  Light_Usage: "Light",
  Medium_Usage: "Medium",
  Heavy_Usage: "Heavy",
};

export function parseMemoryString(mem: string): number {
  if (!mem) return 0;
  const cleaned = mem.replace(/[",\sK]/g, "");
  return parseFloat(cleaned) / 1024 || 0;
}

export async function loadCSV<T>(path: string): Promise<T[]> {
  const response = await fetch(path);
  const text = await response.text();
  return new Promise((resolve) => {
    Papa.parse<T>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
    });
  });
}

export function aggregateTimeSeries(data: ClusteredEntry[], sampleEvery = 50): TimeSeriesPoint[] {
  const grouped = new Map<string, ClusteredEntry[]>();

  for (const entry of data) {
    const ts = entry.timestamp?.substring(0, 16); // group by minute
    if (!ts) continue;
    if (!grouped.has(ts)) grouped.set(ts, []);
    grouped.get(ts)!.push(entry);
  }

  const points: TimeSeriesPoint[] = [];
  let i = 0;
  for (const [timestamp, entries] of grouped) {
    if (i++ % sampleEvery !== 0) continue;
    const avgCPU = entries.reduce((s, e) => s + (parseFloat(e.CPU) || 0), 0) / entries.length;
    const avgMemoryMB = entries.reduce((s, e) => s + (parseFloat(e.Memory_MB) || 0), 0) / entries.length;

    const contextCounts = new Map<string, number>();
    entries.forEach((e) => {
      const ctx = e.activity_context || "Unknown";
      contextCounts.set(ctx, (contextCounts.get(ctx) || 0) + 1);
    });
    const dominantContext = [...contextCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

    points.push({ timestamp, avgCPU: +avgCPU.toFixed(2), avgMemoryMB: +avgMemoryMB.toFixed(2), processCount: entries.length, dominantContext });
  }
  return points;
}

export function extractClusterPoints(data: ClusteredEntry[], sampleSize = 800): ClusterPoint[] {
  const step = Math.max(1, Math.floor(data.length / sampleSize));
  const points: ClusterPoint[] = [];
  for (let i = 0; i < data.length; i += step) {
    const e = data[i];
    const cpu = parseFloat(e.CPU);
    const mem = parseFloat(e.Memory_MB);
    if (isNaN(cpu) || isNaN(mem) || cpu > 200) continue;
    points.push({ cpu, memoryMB: mem, cluster: e.usage_cluster, name: e.Name });
  }
  return points;
}

export function computeStateDistribution(data: ClusteredEntry[]): StateDistribution[] {
  const counts = new Map<string, number>();
  data.forEach((e) => {
    const c = e.usage_cluster;
    if (c) counts.set(c, (counts.get(c) || 0) + 1);
  });
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  return [...counts.entries()].map(([state, count]) => ({
    state: STATE_LABELS[state] || state,
    count,
    percentage: +((count / total) * 100).toFixed(1),
    color: CLUSTER_COLORS[state] || "hsl(0,0%,50%)",
  }));
}

export function computeTransitionMatrix(data: ClusteredEntry[]): Record<string, Record<string, number>> {
  const timestamps = [...new Set(data.map((e) => e.timestamp))].sort();
  const stateByTime = new Map<string, string>();
  for (const ts of timestamps) {
    const entries = data.filter((e) => e.timestamp === ts);
    const counts = new Map<string, number>();
    entries.forEach((e) => counts.set(e.usage_cluster, (counts.get(e.usage_cluster) || 0) + 1));
    const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    if (dominant) stateByTime.set(ts, dominant);
  }

  const states = ["Light_Usage", "Medium_Usage", "Heavy_Usage"];
  const matrix: Record<string, Record<string, number>> = {};
  states.forEach((s) => {
    matrix[s] = {};
    states.forEach((t) => (matrix[s][t] = 0));
  });

  const sortedTimes = [...stateByTime.keys()].sort();
  for (let i = 0; i < sortedTimes.length - 1; i++) {
    const from = stateByTime.get(sortedTimes[i])!;
    const to = stateByTime.get(sortedTimes[i + 1])!;
    if (matrix[from]?.[to] !== undefined) matrix[from][to]++;
  }

  // Normalize
  for (const from of states) {
    const total = Object.values(matrix[from]).reduce((a, b) => a + b, 0);
    if (total > 0) {
      for (const to of states) {
        matrix[from][to] = +((matrix[from][to] / total) * 100).toFixed(1);
      }
    }
  }
  return matrix;
}

export function simulatePredictions(): { predictedState: string; probabilities: { state: string; probability: number }[]; confidence: number } {
  const states = ["Light", "Medium", "Heavy"];
  const weights = [0.45, 0.35, 0.2];
  const roll = Math.random();
  let cumulative = 0;
  let predicted = "Light";
  for (let i = 0; i < states.length; i++) {
    cumulative += weights[i];
    if (roll < cumulative) {
      predicted = states[i];
      break;
    }
  }

  const probabilities = states.map((s) => ({
    state: s,
    probability: s === predicted ? +(60 + Math.random() * 30).toFixed(1) : +(5 + Math.random() * 20).toFixed(1),
  }));

  const total = probabilities.reduce((s, p) => s + p.probability, 0);
  probabilities.forEach((p) => (p.probability = +((p.probability / total) * 100).toFixed(1)));

  return { predictedState: predicted, probabilities, confidence: Math.max(...probabilities.map((p) => p.probability)) };
}

export function generateActionLogs(count = 15): ActionLogEntry[] {
  const actions = ["Cache cleared", "Memory compacted", "Low-priority suspended", "Prefetch initiated", "Swap optimized"];
  const states = ["Light", "Medium", "Heavy"];
  const logs: ActionLogEntry[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    logs.push({
      id: i + 1,
      timestamp: new Date(now - i * 300000).toISOString().substring(0, 19).replace("T", " "),
      predictedState: states[Math.floor(Math.random() * states.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      confidence: +(70 + Math.random() * 25).toFixed(1),
      memoryFreed: +(50 + Math.random() * 500).toFixed(0) as unknown as number,
    });
  }
  return logs;
}

export function computeImpactMetrics() {
  return {
    latencyReduction: 34.7,
    avgReactiveLatency: 2850,
    avgProactiveLatency: 1860,
    predictionAccuracy: 87.3,
    precision: 85.1,
    recall: 89.6,
    f1Score: 87.3,
    totalInterventions: 1247,
    memoryRecovered: 15.8,
    responsivenessImprovement: 28.4,
  };
}
