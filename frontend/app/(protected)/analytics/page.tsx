"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heatmap } from "@/components/ui/heatmap";
import { ReferralLogger } from "@/components/ui/referral-logger";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Briefcase, Activity, CheckCircle, Users } from "lucide-react";

const COLORS = ['var(--primary)', 'var(--ring)', 'var(--destructive)', 'var(--secondary)', '#8b5cf6', '#3b82f6'];

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (session?.token) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/stats`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          setStats(res.data);
        } catch (error) {
          console.error("Failed to fetch analytics", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchStats();
  }, [session?.token]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading analytics...</div>;
  }

  const referralPieData = [
    { name: 'Referral', value: stats?.referralStats?.referrals || 0 },
    { name: 'Direct', value: stats?.referralStats?.direct || 0 }
  ].filter(d => d.value > 0);

  const platformBarData = stats?.platformBreakdown?.map((p: any) => ({
    name: p.platform,
    Applications: p.count,
  })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h2>
        <p className="text-muted-foreground mt-1">Detailed insights into your job search performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.totalApplications || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applied Today</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.todayApplications || 0}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Pipeline</CardTitle>
            <CheckCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.activePipeline || 0}</div>
          </CardContent>
        </Card>

        <Card className="border border-indigo-100 dark:border-indigo-900/50 shadow-sm bg-gradient-to-br from-indigo-50/30 to-transparent dark:from-indigo-950/30 dark:to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Referral Rate (30d)</CardTitle>
            <Users className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{stats?.referralStats?.percentage || 0}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="shadow-sm border border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Application Heatmap (365 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.heatmapData ? <Heatmap data={stats.heatmapData} days={365} /> : <div className="text-muted-foreground">No data available</div>}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <ReferralLogger />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Platform Breakdown (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {platformBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformBarData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <Tooltip 
                      cursor={{ fill: 'var(--muted)' }} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid var(--border)', 
                        backgroundColor: 'var(--card)', 
                        color: 'var(--foreground)' 
                      }} 
                    />
                    <Bar dataKey="Applications" fill="var(--primary)" radius={[0, 4, 4, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No applications with platform selected.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Referral vs Direct (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {referralPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={referralPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {referralPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid var(--border)', 
                        backgroundColor: 'var(--card)', 
                        color: 'var(--foreground)' 
                      }} 
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground">No referral data yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
