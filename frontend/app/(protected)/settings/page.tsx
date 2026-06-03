"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-slate-200">
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
          <p className="text-sm text-slate-500 pt-2">
            * Note: Changing name and email is currently not supported in this demo.
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm ring-1 ring-slate-200">
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage when you receive daily email digests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <div className="font-medium text-slate-900">Daily Digest Email</div>
              <div className="text-sm text-slate-500">Receive a daily summary of your job search progress at 8 PM.</div>
            </div>
            <div>
              <Button variant="outline" disabled>Enabled</Button>
            </div>
          </div>
          <p className="text-sm text-slate-500 pt-4">
            * Notification preferences are coming soon to the UI. You are currently enrolled by default.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
