import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatusModal from "../../components/StatusModal";
import ExportOptionsModal from "../../components/ExportOptionsModal";
import RecentActivityModal from "../../components/RecentActivityModal";
import { analyticsService } from "../../services/analyticsService";
import { handleApiError } from "../../utils/errorHandler";

const Analytics = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRecentActivityOpen, setIsRecentActivityOpen] = useState(false);
  const [chartView, setChartView] = useState("Monthly");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // API state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getDashboardAnalytics(dateRange);
      setAnalyticsData(response.data);
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    setIsDateRangeOpen(!isDateRangeOpen);
  };

  const dateOptions = [
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days",
    "All Time",
  ];

  const handleDateSelect = (option) => {
    setDateRange(option);
    setIsDateRangeOpen(false);
  };

  const handleDownloadReport = () => {
    setIsExportOpen(true);
  };

  const handleViewLog = (log) => {
    setStatusModal({
      isOpen: true,
      type: "info",
      title: "Activity Details",
      message: `Viewing details for: ${log.action}. Target: ${log.target}, Time: ${log.time}`,
    });
  };

  const handleViewAllLogs = () => {
    setIsRecentActivityOpen(true);
  };

  // Use API data or fallback to defaults
  const stats = analyticsData?.stats || [
    {
      label: "Total Students",
      value: "0",
      trend: "0%",
      isPositive: true,
      icon: "Users",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Quiz Completion Rate",
      value: "0%",
      trend: "0%",
      isPositive: true,
      icon: "Award",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Avg. Test Score",
      value: "0/100",
      trend: "0%",
      isPositive: false,
      icon: "Activity",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const iconMap = {
    Users: Users,
    Award: Award,
    Activity: Activity,
    BookOpen: BookOpen,
    TrendingUp: TrendingUp
  };

  const monthlyGrowthData = analyticsData?.monthlyGrowth || [];
  const weeklyGrowthData = analyticsData?.weeklyGrowth || [];
  const performanceData = analyticsData?.performance || [];
  const recentActivity = analyticsData?.recentActivity || [];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Platform Analytics
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Deep dive into student performance and platform growth.
            </p>
          </div>
          <div className="flex items-center gap-2 relative">
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={handleDateFilter}
                className={`w-full btn-modern-outline !py-2.5 !px-4 flex items-center justify-center gap-2 transition-all ${isDateRangeOpen ? "border-primary-300 bg-primary-50/30" : ""
                  }`}>
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold">{dateRange}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDateRangeOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {isDateRangeOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDateRangeOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20 overflow-hidden">
                      {dateOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleDateSelect(option)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${dateRange === option
                            ? "bg-primary-50 text-primary-600"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}>
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={handleDownloadReport}
              className="flex-1 sm:flex-none btn-modern-primary !py-2.5 !px-4 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-xs font-bold">Download Report</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-red-900">Failed to load analytics</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchAnalytics}
              className="text-xs font-bold text-red-600 hover:text-red-700 underline">
              Retry
            </button>
          </motion.div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = iconMap[stat.icon] || Users;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={stat.label}
                className="glass-card p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.textColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-[10px] font-black ${stat.isPositive ? "text-green-600" : "text-red-600"
                      }`}>
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.trend}
                  </div>
                </div>
                <h4 className="text-2xl font-black text-slate-900">
                  {stat.value}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Registration Growth
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  New students registered over time.
                </p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {["Monthly", "Weekly"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setChartView(view)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${chartView === view
                      ? "bg-white shadow-sm text-primary-600"
                      : "text-slate-500 hover:text-slate-700"
                      }`}>
                    {view}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    chartView === "Monthly"
                      ? monthlyGrowthData
                      : weeklyGrowthData
                  }>
                  <defs>
                    <linearGradient
                      id="colorStudents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-lg font-black text-slate-900 mb-2">
              Quiz Performance
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-8">
              Score distribution across all modules.
            </p>

            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value">
                    {performanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">84%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Avg Score
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                {
                  label: "High Scores (90+)",
                  color: "bg-green-500",
                  value: "24%",
                },
                {
                  label: "Average (70-89)",
                  color: "bg-blue-500",
                  value: "48%",
                },
                {
                  label: "Passing (50-69)",
                  color: "bg-orange-500",
                  value: "18%",
                },
                { label: "Below Avg", color: "bg-red-500", value: "10%" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-[11px] font-bold text-slate-600">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Activity Section */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Recent System Activity
            </h3>
            <button
              onClick={handleViewAllLogs}
              className="text-xs font-black text-primary-600 hover:text-primary-700 transition-colors">
              View All Logs
            </button>
          </div>
          <div className="p-2">
            {recentActivity.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm">No recent activity found.</div>
            ) : (
              recentActivity.map((log, idx) => {
                const Icon = Users; // Default icon for now or map based on log type
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">
                          {log.action}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Target:{" "}
                          <span className="text-slate-700 font-bold">
                            {log.target}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-900">
                          {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          {new Date(log.time).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewLog(log)}
                        className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-primary-600 transition-all opacity-0 group-hover:opacity-100">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
      />

      <ExportOptionsModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Export Analytics Data"
      />

      <RecentActivityModal
        isOpen={isRecentActivityOpen}
        onClose={() => setIsRecentActivityOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Analytics;
