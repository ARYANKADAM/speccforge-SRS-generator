"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "../components/Nav";
import Image from "next/image";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const COMPLETENESS_COLORS = {
    complete: "#14b8a6",
    high: "#06b6d4",
    medium: "#22c55e",
    low: "#f97316",
  };

  const tooltipStyle = {
    backgroundColor: "rgba(2, 6, 23, 0.95)",
    border: "1px solid rgba(51, 65, 85, 0.8)",
    borderRadius: "12px",
    color: "#e2e8f0",
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_420px_at_15%_0%,rgba(56,189,248,0.16),transparent_62%),radial-gradient(900px_420px_at_85%_10%,rgba(99,102,241,0.16),transparent_58%),linear-gradient(135deg,#020617,#0b1731_50%,#0f172a)] text-slate-100">
        <Nav />

        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden sm:block">
          <div className="absolute top-[12%] left-[-6%] opacity-30 animate-float-slow">
            <Image src="/images/cloud.png" alt="Cloud" width={420} height={220} className="drop-shadow-lg" />
          </div>
          <div className="absolute bottom-[12%] right-[-7%] opacity-25 animate-float-slower">
            <Image src="/images/cloud.png" alt="Cloud" width={500} height={240} className="drop-shadow-lg" />
          </div>
        </div>

        <div className="flex justify-center items-center min-h-screen pt-24">
          <div className="bg-slate-900/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-slate-700/80 text-center">
            <div className="relative mb-6 mx-auto w-20 h-20">
              <svg className="w-20 h-20 text-cyan-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="absolute inset-0 border-4 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin"></div>
            </div>

            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent mb-2">
              Loading Dashboard
            </h3>
            <p className="text-slate-300 font-medium">
              Analyzing your documents...
            </p>

            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_420px_at_15%_0%,rgba(56,189,248,0.16),transparent_62%),radial-gradient(900px_420px_at_85%_10%,rgba(99,102,241,0.16),transparent_58%),linear-gradient(135deg,#020617,#0b1731_50%,#0f172a)] text-slate-100">
        <Nav />
        <div className="container mx-auto px-4 pt-32 pb-12">
          <div className="max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-700/70 p-8">
            <div className="bg-red-900/30 border border-red-700 text-red-200 px-6 py-4 rounded-xl">
              <strong className="font-bold">Error: </strong>
              <span>{error || "Failed to load dashboard"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completenessData = [
    { name: "100%", value: dashboardData.completenessDistribution.complete, color: COMPLETENESS_COLORS.complete },
    { name: "75-99%", value: dashboardData.completenessDistribution.high, color: COMPLETENESS_COLORS.high },
    { name: "50-74%", value: dashboardData.completenessDistribution.medium, color: COMPLETENESS_COLORS.medium },
    { name: "0-49%", value: dashboardData.completenessDistribution.low, color: COMPLETENESS_COLORS.low },
  ].filter((item) => item.value > 0);

  const pdfCoverage = dashboardData.totalDocuments
    ? Math.round((dashboardData.documentsWithPDF / dashboardData.totalDocuments) * 100)
    : 0;

  const radialData = [
    {
      name: "Completeness",
      value: dashboardData.averageCompleteness,
      fill: "url(#completenessGradient)",
    },
    {
      name: "PDF Coverage",
      value: pdfCoverage,
      fill: "url(#pdfGradient)",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_420px_at_15%_0%,rgba(56,189,248,0.16),transparent_62%),radial-gradient(900px_420px_at_85%_10%,rgba(99,102,241,0.16),transparent_58%),linear-gradient(135deg,#020617,#0b1731_50%,#0f172a)] text-slate-100">
      <Nav />

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden sm:block">
        <div className="absolute top-[12%] left-[-6%] opacity-30 animate-float-slow">
          <Image src="/images/cloud.png" alt="Cloud" width={420} height={220} className="drop-shadow-lg" />
        </div>
        <div className="absolute bottom-[12%] right-[-7%] opacity-25 animate-float-slower">
          <Image src="/images/cloud.png" alt="Cloud" width={500} height={240} className="drop-shadow-lg" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-28 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-5 backdrop-blur">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <svg className="h-10 w-10 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Project Dashboard
            </h1>
            <p className="text-slate-300">Analytics and delivery insights for your SRS workspace</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-1">Total Documents</p>
                  <p className="text-3xl font-bold text-cyan-300">{dashboardData.totalDocuments}</p>
                </div>
                <div className="p-3 bg-cyan-500/15 rounded-xl border border-cyan-400/30">
                  <svg className="h-8 w-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 hover:border-teal-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-1">Avg Completeness</p>
                  <p className="text-3xl font-bold text-teal-300">{dashboardData.averageCompleteness}%</p>
                </div>
                <div className="p-3 bg-teal-500/15 rounded-xl border border-teal-400/30">
                  <svg className="h-8 w-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 hover:border-indigo-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-1">Total Features</p>
                  <p className="text-3xl font-bold text-indigo-300">{dashboardData.totalFeatures}</p>
                </div>
                <div className="p-3 bg-indigo-500/15 rounded-xl border border-indigo-400/30">
                  <svg className="h-8 w-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 hover:border-orange-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-1">PDF Coverage</p>
                  <p className="text-3xl font-bold text-orange-300">{pdfCoverage}%</p>
                </div>
                <div className="p-3 bg-orange-500/15 rounded-xl border border-orange-400/30">
                  <svg className="h-8 w-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 xl:col-span-1">
              <h3 className="text-xl font-bold text-slate-100 mb-4">Delivery Pulse</h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadialBarChart
                  data={radialData}
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="95%"
                  barSize={20}
                  startAngle={180}
                  endAngle={-180}
                >
                  <defs>
                    <linearGradient id="completenessGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="pdfGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-slate-800/70 px-3 py-2">
                  <span className="text-teal-300">Average Completeness</span>
                  <span className="font-bold text-slate-100">{dashboardData.averageCompleteness}%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800/70 px-3 py-2">
                  <span className="text-orange-300">PDF Availability</span>
                  <span className="font-bold text-slate-100">{pdfCoverage}%</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 xl:col-span-2">
              <h3 className="text-xl font-bold text-slate-100 mb-4">Creation Wave</h3>
              {dashboardData.trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={dashboardData.trendData}>
                    <defs>
                      <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#waveFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-slate-400">
                  Not enough activity data for trend visualization.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 xl:col-span-2">
              <h3 className="text-xl font-bold text-slate-100 mb-4">Completeness Bands</h3>
              {completenessData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={completenessData}>
                    <defs>
                      <linearGradient id="barTeal" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <filter id="glow">
                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#22d3ee" floodOpacity="0.35" />
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="url(#barTeal)" filter="url(#glow)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  No documents yet.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 xl:col-span-1">
              <h3 className="text-xl font-bold text-slate-100 mb-4">Distribution Ring</h3>
              {completenessData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={completenessData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={112}
                      paddingAngle={4}
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {completenessData.map((entry, idx) => (
                        <Cell key={`slice-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">No data</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              <svg className="h-6 w-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h3>
            {dashboardData.recentDocuments.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-800/60 rounded-xl hover:bg-slate-800 transition-colors duration-200 border border-slate-700/80">
                    <div className="flex-1">
                      <Link href={`/profile/${doc.id}`} className="font-semibold text-slate-100 hover:text-cyan-300">
                        {doc.projectName}
                      </Link>
                      <p className="text-sm text-slate-400 mt-1">
                        {doc.featureCount} features • {doc.filledFields}/{doc.totalFields} sections filled
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          doc.completeness === 100 ? "text-emerald-300" :
                          doc.completeness >= 75 ? "text-cyan-300" :
                          doc.completeness >= 50 ? "text-amber-300" :
                          "text-rose-300"
                        }`}>
                          {doc.completeness}%
                        </div>
                        <p className="text-xs text-slate-400">Complete</p>
                      </div>
                      <div className="flex gap-2">
                        {doc.hasPDF && (
                          <span className="px-2 py-1 bg-orange-500/15 border border-orange-400/30 text-orange-200 text-xs font-semibold rounded">PDF</span>
                        )}
                        {doc.hasMarkdown && (
                          <span className="px-2 py-1 bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs font-semibold rounded">MD</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No documents yet. Create your first SRS document!</p>
                <Link href="/form" className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold rounded-xl hover:shadow-lg transition-all duration-300">
                  Create Document
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
