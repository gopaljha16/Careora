"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    dailyGoal: 5,
    emailNotifications: true,
    reminderEnabled: true,
    reminderTime: "09:00"
  });

  useEffect(() => {
    async function fetchSettings() {
      if (!session?.token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/settings/reminders`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        setSettings({
          dailyGoal: res.data.dailyGoal || 5,
          emailNotifications: res.data.emailNotifications ?? true,
          reminderEnabled: res.data.reminderEnabled ?? true,
          reminderTime: res.data.reminderTime || "09:00"
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [session?.token]);

  async function handleSave() {
    if (!session?.token) return;
    setSaving(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/settings/reminders`,
        {
          dailyGoal: parseInt(settings.dailyGoal as any) || 5,
          emailNotifications: settings.emailNotifications,
          reminderEnabled: settings.reminderEnabled,
          reminderTime: settings.reminderTime
        },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <Card className="shadow-sm border border-border">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your personal information associated with your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={session?.user?.name || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={session?.user?.email || ""} disabled />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-border">
        <CardHeader>
          <CardTitle>Goals & Targets</CardTitle>
          <CardDescription>
            Set your application targets to build consistency.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dailyGoal">Daily Application Goal</Label>
            <Input 
              id="dailyGoal" 
              type="number" 
              min={1} 
              value={settings.dailyGoal} 
              onChange={e => setSettings(s => ({ ...s, dailyGoal: parseInt(e.target.value) || 1 }))}
            />
            <p className="text-xs text-muted-foreground pt-1">
              This goal determines the progress shown on your Dashboard.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-border">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage when and how you receive updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <div className="font-medium text-foreground text-sm">Daily Digest Email</div>
              <div className="text-xs text-muted-foreground">Receive a daily summary of your job search progress.</div>
            </div>
            <div>
              <Button 
                variant={settings.emailNotifications ? "default" : "outline"}
                onClick={() => setSettings(s => ({ ...s, emailNotifications: !s.emailNotifications }))}
                className="w-24"
              >
                {settings.emailNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-4 border border-border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium text-foreground text-sm">Daily Reminder Push</div>
                <div className="text-xs text-muted-foreground">Get reminded if you haven't applied to jobs today.</div>
              </div>
              <div>
                <Button 
                  variant={settings.reminderEnabled ? "default" : "outline"}
                  onClick={() => setSettings(s => ({ ...s, reminderEnabled: !s.reminderEnabled }))}
                  className="w-24"
                >
                  {settings.reminderEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
            
            {settings.reminderEnabled && (
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <Label htmlFor="reminderTime" className="text-sm">Reminder Time</Label>
                <Input 
                  id="reminderTime" 
                  type="time" 
                  className="w-32"
                  value={settings.reminderTime}
                  onChange={e => setSettings(s => ({ ...s, reminderTime: e.target.value }))}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Saving Changes..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}
