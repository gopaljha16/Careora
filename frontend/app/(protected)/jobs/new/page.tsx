"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().optional(),
  status: z.string(),
  source: z.string().optional(),
  notes: z.string().optional(),
  platform: z.string().min(1, "Platform is required"),
  isReferral: z.boolean(),
  referralName: z.string().optional(),
});

const PLATFORMS = ["LinkedIn", "Naukri", "Instahyre", "AngelList", "Indeed", "Direct", "Referral", "Other"];

export default function NewJobPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      role: "",
      jobUrl: "",
      location: "",
      salary: "",
      description: "",
      status: "WISHLIST",
      source: "",
      notes: "",
      platform: "LinkedIn",
      isReferral: false,
      referralName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    if (!session?.token) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/applications`,
        values,
        { headers: { Authorization: `Bearer ${session.token}` } },
      );
      router.push("/jobs");
      router.refresh();
    } catch (e) {
      console.error(e);
      setError("Failed to create application. Please try again.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Add Application
        </h2>
        <p className="text-muted-foreground mt-1">
          Track a new job opportunity in your pipeline.
        </p>
      </div>

      <Card className="shadow-sm border border-border">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Enter the information about the role and company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Company <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Role <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="WISHLIST">Wishlist</SelectItem>
                          <SelectItem value="APPLIED">Applied</SelectItem>
                          <SelectItem value="PHONE_SCREEN">
                            Phone Screen
                          </SelectItem>
                          <SelectItem value="INTERVIEW">Interview</SelectItem>
                          <SelectItem value="OFFER">Offer</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Link to post, event, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform <span className="text-destructive">*</span></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PLATFORMS.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="isReferral"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3 bg-muted/20 shadow-sm mt-8">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Referral Application</FormLabel>
                          <FormDescription>Did someone refer you?</FormDescription>
                        </div>
                        <FormControl>
                          <input 
                            type="checkbox" 
                            className="h-5 w-5 accent-primary rounded cursor-pointer"
                            checked={field.value} 
                            onChange={field.onChange} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {form.watch("isReferral") && (
                <FormField
                  control={form.control}
                  name="referralName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referrer Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe from Engineering"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Remote, New York, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <Input placeholder="$100k - $120k" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="jobUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://careers.acme.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any initial thoughts or things to remember..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Save Application"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
