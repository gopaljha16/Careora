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
          <p className="text-sm text-muted-foreground pt-2">
            * Note: Changing name and email is currently not supported in this demo.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-border">
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage when you receive daily email digests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <div className="font-medium text-foreground">Daily Digest Email</div>
              <div className="text-sm text-muted-foreground">Receive a daily summary of your job search progress at 8 PM.</div>
            </div>
            <div>
              <Button variant="outline" disabled>Enabled</Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            * Notification preferences are coming soon to the UI. You are currently enrolled by default.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
