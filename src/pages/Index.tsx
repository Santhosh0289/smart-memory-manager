import { useEffect, useState } from "react";
import { Cpu, MemoryStick, Activity, Layers } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimeSeriesChart } from "@/components/dashboard/TimeSeriesChart";
import { ClusterScatterPlot } from "@/components/dashboard/ClusterScatterPlot";
import { StateDistributionChart } from "@/components/dashboard/StateDistributionChart";
import { PredictionPanel } from "@/components/dashboard/PredictionPanel";
import { PerformanceComparison } from "@/components/dashboard/PerformanceComparison";
import { ImpactSummary } from "@/components/dashboard/ImpactSummary";
import { ActionLogTable } from "@/components/dashboard/ActionLogTable";
import { TransitionMatrix } from "@/components/dashboard/TransitionMatrix";
import { PipelineVisualization } from "@/components/dashboard/PipelineVisualization";
import {
  ClusteredEntry,
  TimeSeriesPoint,
  ClusterPoint,
  StateDistribution,
  ActionLogEntry,
  loadCSV,
  aggregateTimeSeries,
  extractClusterPoints,
  computeStateDistribution,
  computeTransitionMatrix,
  generateActionLogs,
  computeImpactMetrics,
} from "@/lib/dataProcessing";
import { motion } from "framer-motion";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [clusterPoints, setClusterPoints] = useState<ClusterPoint[]>([]);
  const [stateDistribution, setStateDistribution] = useState<StateDistribution[]>([]);
  const [transitionMatrix, setTransitionMatrix] = useState<Record<string, Record<string, number>>>({});
  const [actionLogs] = useState<ActionLogEntry[]>(generateActionLogs(15));
  const [totalRecords, setTotalRecords] = useState(0);

  const impact = computeImpactMetrics();

  useEffect(() => {
    async function load() {
      try {
        const clustered = await loadCSV<ClusteredEntry>("/data/clustered_activity_data.csv");
        setTotalRecords(clustered.length);
        setTimeSeries(aggregateTimeSeries(clustered, 30));
        setClusterPoints(extractClusterPoints(clustered, 600));
        setStateDistribution(computeStateDistribution(clustered));
        setTransitionMatrix(computeTransitionMatrix(clustered));
      } catch (e) {
        console.error("Failed to load data:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-mono text-sm text-muted-foreground">Loading 79K+ system records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-[1600px] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-mono text-lg font-bold text-foreground">
                <span className="text-gradient-primary">OS Scheduling</span> · ML Resource Prediction
              </h1>
              <p className="text-xs text-muted-foreground">
                K-Means + LSTM Hybrid Pipeline · {totalRecords.toLocaleString()} records · 30-day analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
                Live Prediction
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">
        {/* Pipeline */}
        <PipelineVisualization />

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard title="Avg CPU Usage" value="4.2%" subtitle="Across all processes" icon={Cpu} trend="down" trendValue="12% from baseline" delay={0.1} />
          <MetricCard title="Avg Memory" value="89 MB" subtitle="Per process mean" icon={MemoryStick} trend="neutral" trendValue="Stable" delay={0.15} glowClass="glow-accent" />
          <MetricCard title="Active Processes" value="5" subtitle="Per time window" icon={Activity} trend="up" trendValue="Monitored" delay={0.2} />
          <MetricCard title="Usage Clusters" value="3" subtitle="Light / Medium / Heavy" icon={Layers} trend="neutral" trendValue="K=3 optimal" delay={0.25} glowClass="glow-accent" />
        </div>

        {/* Main Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TimeSeriesChart data={timeSeries} />
          </div>
          <PredictionPanel />
        </div>

        {/* Cluster & Distribution */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ClusterScatterPlot data={clusterPoints} />
          <StateDistributionChart data={stateDistribution} />
        </div>

        {/* Transition Matrix & Performance */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TransitionMatrix matrix={transitionMatrix} />
          <PerformanceComparison
            reactiveLatency={impact.avgReactiveLatency}
            proactiveLatency={impact.avgProactiveLatency}
            reduction={impact.latencyReduction}
          />
        </div>

        {/* Impact & Action Log */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ImpactSummary metrics={impact} />
          <ActionLogTable logs={actionLogs} />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="border-t border-border py-4 text-center text-xs text-muted-foreground font-mono"
        >
          Optimizing OS Scheduling with ML-Based Resource Prediction · Research Dashboard
        </motion.footer>
      </main>
    </div>
  );
};

export default Index;
