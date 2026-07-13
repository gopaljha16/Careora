"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Clock, FileCheck, Target, Send, Flame } from "lucide-react";
import axios from "axios";
import { Heatmap } from "@/components/ui/heatmap";
import { LearningEditor } from "@/components/ui/learning-editor";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ['#94a3b8', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#f97316'];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Record<string, any> | null>(null);
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
          console.error("Failed to fetch stats", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchStats();
  }, [session?.token]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading dashboard...</div>;
  }

  // Format the data for recharts
  const barData = stats?.applicationsPerDay?.map((d: {date: string, count: number}) => {
    const date = new Date(d.date);
    return {
      name: `${date.getMonth() + 1}/${date.getDate()}`,
      Applications: d.count,
    };
  }) || [];

  const heatmapData = stats?.heatmapData || [];

  const pieData = stats?.byStatus?.map((s: {status: string, count: number}) => ({
    name: s.status,
    value: s.count,
  })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Here's an overview of your job search progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.totalApplications || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applied Today</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.todayApplications || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Keep up the momentum</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applied This Week</CardTitle>
            <FileCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.weekApplications || 0}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-primary/20 bg-primary/5 text-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Active Pipeline</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.activePipeline || 0}</div>
            <p className="text-xs text-primary/80 mt-1">Interviews & pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Application Heatmap (90 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {heatmapData.length > 0 ? (
                <Heatmap data={heatmapData} days={90} />
              ) : (
                <div className="text-muted-foreground">No application data.</div>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Application Velocity (14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'var(--muted)' }}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid var(--border)', 
                        backgroundColor: 'var(--card)', 
                        color: 'var(--foreground)'
                      }}
                    />
                    <Bar dataKey="Applications" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="border border-indigo-100 dark:border-indigo-900/50 shadow-sm bg-gradient-to-br from-indigo-50/30 to-transparent dark:from-indigo-950/20 dark:to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-500" />
                Referral Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">{stats?.referralStats?.percentage || 0}%</div>
              <p className="text-sm text-indigo-600/80 dark:text-indigo-400/70 mt-1">of applications are referrals (30d)</p>
            </CardContent>
          </Card>

          <LearningEditor />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry: {name: string, value: number}, index: number) => (
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
                <div className="text-muted-foreground">No applications yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
