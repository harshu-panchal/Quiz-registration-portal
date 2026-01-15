import React, { useState, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Wallet as WalletIcon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  History,
  Download,
  Filter,
  Plus,
  ArrowRight,
  Search,
  MapPin,
  Calendar,
  Banknote,
  ShieldCheck,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import StatusModal from "../../components/StatusModal";
import Modal from "../../components/Modal";

import { transactionService } from "../../services/transactionService";

const Wallet = () => {
  const { t } = useLanguage();
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [statsData, setStatsData] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    totalPayouts: 0,
    revenueTrend: []
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("Last 6 Months");
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [addFundsModalOpen, setAddFundsModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactions({
        type: activeFilter,
        search: searchTerm,
        limit: 50 // Fetch more for scrolling
      });

      if (response.success) {
        setTransactions(response.data.map(tx => ({
          id: tx.transactionId,
          type: tx.type,
          source: tx.source,
          amount: `${tx.type === 'Income' ? '+' : '-'}₹${tx.amount.toLocaleString()}`,
          date: new Date(tx.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          city: tx.city,
          status: tx.status,
          icon: tx.type === 'Income' ? ArrowDownLeft : ArrowUpRight,
          iconColor: tx.type === 'Income' ? "text-green-600" : "text-orange-600",
          iconBg: tx.type === 'Income' ? "bg-green-50" : "bg-orange-50",
          description: tx.description,
          method: tx.paymentMethod
        })));

        setStatsData(response.stats); // Use stats from backend
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, [activeFilter, searchTerm]); // Refetch when filters change

  const revenueTrend = useMemo(() => {
    // Backend should return data in correct format, but fallback to empty if needed
    if (statsData.revenueTrend && statsData.revenueTrend.length > 0) {
      return statsData.revenueTrend;
    }
    return [
      { month: "Jan", revenue: 0 },
      { month: "Feb", revenue: 0 },
      { month: "Mar", revenue: 0 },
      { month: "Apr", revenue: 0 },
      { month: "May", revenue: 0 },
      { month: "Jun", revenue: 0 },
    ];
  }, [statsData.revenueTrend]);

  const filteredTransactions = transactions; // Filtering is handled by backend + local useEffect re-fetch

  const handleWithdraw = () => {
    setWithdrawModalOpen(true);
  };

  const handleAddFunds = () => {
    setAddFundsModalOpen(true);
  };

  const handleRowClick = (tx) => {
    setSelectedTransaction(tx);
    setDetailsModalOpen(true);
  };

  const stats = [
    {
      label: "total_balance",
      value: `₹${statsData.totalBalance.toLocaleString()}`,
      change: "+12.5%", // Dynamic change calculation would require historical data comparison
      icon: WalletIcon,
      trend: "up",
    },
    {
      label: "monthly_income",
      value: `₹${statsData.monthlyIncome.toLocaleString()}`,
      change: "+8.2%",
      icon: ArrowDownLeft,
      trend: "up",
    },
    {
      label: "total_payouts",
      value: `₹${statsData.totalPayouts.toLocaleString()}`,
      change: "-3.1%",
      icon: ArrowUpRight,
      trend: "down",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 max-w-[1600px] mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {t('wallet')}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              {t('manage_finances')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleWithdraw}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <ArrowUpRight className="w-4 h-4" />
              {t('withdraw')}
            </button>
            <button
              onClick={handleAddFunds}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20">
              <Plus className="w-4 h-4" />
              {t('add_funds')}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {t(stat.label)}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-slate-900">
                    {stat.value}
                  </h3>
                  <span
                    className={`text-[10px] font-bold ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Revenue Trend Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-[2.5rem] border border-slate-100 shadow-sm bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {t('revenue_insights')}
                </h3>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">
                  {t('monthly_performance')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    {t('revenue')}
                  </span>
                </div>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl text-slate-600 focus:ring-primary-500/10 cursor-pointer outline-none">
                  <option>{t('last_6_months')}</option>
                  <option>{t('last_year')}</option>
                </select>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="#6366f1"
                        stopOpacity={0.01}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="8 8"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 800, fill: "#94a3b8" }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 800, fill: "#94a3b8" }}
                  />
                  <Tooltip
                    cursor={{
                      stroke: "#6366f1",
                      strokeWidth: 2,
                      strokeDasharray: "4 4",
                    }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "20px",
                      border: "1px solid #f1f5f9",
                      boxShadow:
                        "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.04)",
                      padding: "12px 16px",
                    }}
                    itemStyle={{
                      fontSize: "12px",
                      fontWeight: "900",
                      color: "#1e293b",
                    }}
                    labelStyle={{
                      fontSize: "10px",
                      fontWeight: "900",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Transactions Section */}
          <div className="glass-card rounded-[2.5rem] border border-slate-100 shadow-sm bg-white overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/30">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {t('activity_history')}
                </h3>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">
                  {t('latest_movements')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('search_transactions')}
                    className="bg-white border border-slate-200 text-xs pl-11 pr-4 py-2.5 rounded-2xl w-full sm:w-64 focus:ring-primary-500/10 focus:border-primary-200 transition-all outline-none"
                  />
                </div>
                <button
                  onClick={() => setFilterModalOpen(true)}
                  className={`p-2.5 rounded-2xl border transition-all shadow-sm ${activeFilter !== "All"
                    ? "bg-primary-50 border-primary-200 text-primary-600"
                    : "bg-white border-slate-200 text-slate-500 hover:text-primary-600 hover:border-primary-100"
                    }`}>
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400">{t('loading_transactions')}</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400">{t('no_transactions')}</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filteredTransactions.map((tx, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    onClick={() => handleRowClick(tx)}
                    className="p-6 hover:bg-slate-50/80 transition-all group cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-14 h-14 rounded-2xl ${tx.iconBg} ${tx.iconColor} flex items-center justify-center transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 shadow-sm`}>
                          <tx.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors">
                            {tx.source}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-primary-400" />
                              {tx.city}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-primary-400" />
                              {tx.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5">
                        <p
                          className={`text-base font-black ${tx.amount.startsWith("+")
                            ? "text-green-600"
                            : "text-slate-900"
                            }`}>
                          {tx.amount}
                        </p>
                        <span
                          className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full ${tx.status === "Completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                            }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="p-6 bg-slate-50/30 border-t border-slate-50 text-center">
              <button
                onClick={() => setStatementModalOpen(true)}
                className="group text-[11px] font-black text-primary-600 hover:text-primary-700 flex items-center gap-2 mx-auto uppercase tracking-[0.2em] transition-all">
                {t('view_full_statement')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title={t('withdraw_funds')}
        maxWidth="max-w-lg">
        <div className="space-y-6">
          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm">
              <WalletIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">
                {t('available_balance')}
              </p>
              <h4 className="text-xl font-black text-primary-900">
                ₹10,45,000.00
              </h4>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {t('amount_to_withdraw')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-10 pr-4 text-lg font-black focus:ring-primary-500/10 focus:border-primary-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {t('select_bank')}
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button className="p-4 bg-white border-2 border-primary-500 rounded-2xl flex items-center gap-4 text-left shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">
                      HDFC Bank •••• 4242
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {t('primary_account')}
                    </p>
                  </div>
                  <div className="ml-auto w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={() => {
                setWithdrawModalOpen(false);
                setStatusModal({
                  isOpen: true,
                  type: "success",
                  title: "Withdrawal Initiated",
                  message:
                    "Your withdrawal request of ₹10,000.00 has been successfully initiated. Funds will reach your bank within 2-3 business days.",
                });
              }}
              className="w-full py-4 bg-primary-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20">
              {t('confirm_withdrawal')}
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              {t('secure_transaction')}
            </p>
          </div>
        </div>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        isOpen={addFundsModalOpen}
        onClose={() => setAddFundsModalOpen(false)}
        title={t('add_funds_wallet')}
        maxWidth="max-w-lg">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[1000, 5000, 10000].map((amt) => (
              <button
                key={amt}
                className="py-3 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-200 rounded-xl text-xs font-black text-slate-600 hover:text-primary-600 transition-all">
                +₹{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {t('enter_amount')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-10 pr-4 text-lg font-black focus:ring-primary-500/10 focus:border-primary-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {t('payment_method')}
              </label>
              <div className="space-y-2">
                <button className="w-full p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 text-left hover:border-primary-200 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-black text-slate-900">
                    Razorpay (UPI, Cards, Netbanking)
                  </p>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-300" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setAddFundsModalOpen(false);
              setStatusModal({
                isOpen: true,
                type: "success",
                title: "Deposit Successful",
                message:
                  "Funds have been added to your wallet instantly. You can now use them for payouts and other activities.",
              });
            }}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20">
            {t('proceed_payment')}
          </button>
        </div>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={t('transaction_details')}
        maxWidth="max-w-md">
        {selectedTransaction && (
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className={`w-20 h-20 rounded-[2rem] ${selectedTransaction.iconBg} ${selectedTransaction.iconColor} flex items-center justify-center shadow-sm`}>
                <selectedTransaction.icon className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900">
                  {selectedTransaction.amount}
                </h4>
                <p className="text-sm font-bold text-slate-500">
                  {selectedTransaction.source}
                </p>
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${selectedTransaction.status === "Completed"
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
                  }`}>
                {selectedTransaction.status}
              </span>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t('transaction_id')}
                </span>
                <span className="text-xs font-black text-slate-900">
                  {selectedTransaction.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t('date_time')}
                </span>
                <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                  <Clock className="w-3 h-3 text-primary-500" />
                  {selectedTransaction.date}, 02:45 PM
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t('payment_method')}
                </span>
                <span className="text-xs font-black text-slate-900">
                  {selectedTransaction.method}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t('location')}
                </span>
                <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                  <MapPin className="w-3 h-3 text-primary-500" />
                  {selectedTransaction.city}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Description
              </p>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl text-xs font-medium text-slate-600 leading-relaxed">
                {selectedTransaction.description}
              </div>
            </div>

            <button className="w-full py-4 border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              {t('download_invoice')}
            </button>
          </div>
        )}
      </Modal>

      {/* Statement Modal */}
      <Modal
        isOpen={statementModalOpen}
        onClose={() => setStatementModalOpen(false)}
        title={t('full_statement')}
        maxWidth="max-w-lg">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('selected_period')}
              </p>
              <h5 className="text-sm font-black text-slate-900">
                Oct 01, 2023 - Oct 31, 2023
              </h5>
            </div>
            <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary-600 transition-all shadow-sm">
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">
                {t('total_inflow')}
              </p>
              <h6 className="text-lg font-black text-green-700">
                ₹8,43,249.00
              </h6>
            </div>
            <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100">
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">
                {t('total_outflow')}
              </p>
              <h6 className="text-lg font-black text-red-700">₹1,37,500.00</h6>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-4 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-3">
              <Download className="w-4 h-4" />
              {t('download_pdf')}
            </button>
            <button className="w-full py-4 border border-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
              <ExternalLink className="w-4 h-4" />
              {t('export_excel')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title={t('filter_transactions')}
        maxWidth="max-w-sm">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              {t('transaction_type')}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {["All", "Income", "Payout"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setActiveFilter(type);
                    setFilterModalOpen(false);
                  }}
                  className={`w-full p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between ${activeFilter === type
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}>
                  {type}
                  {activeFilter === type && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setActiveFilter("All");
              setFilterModalOpen(false);
            }}
            className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">
            {t('reset_filters')}
          </button>
        </div>
      </Modal>

      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </DashboardLayout>
  );
};

export default Wallet;
