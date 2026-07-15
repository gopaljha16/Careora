"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  MapPin, 
  Banknote, 
  Link as LinkIcon,
  MessageSquare,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const STATUS_COLORS: Record<string, string> = {
  WISHLIST: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
  APPLIED: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  PHONE_SCREEN: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  INTERVIEW: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  OFFER: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  REJECTED: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
  WITHDRAWN: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300"
};

export default function JobDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Resume Tracker State
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [resumeVersion, setResumeVersion] = useState("");
  const [coverLetterNotes, setCoverLetterNotes] = useState("");
  const [savingResume, setSavingResume] = useState(false);

  // Interview Dialog State
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [interviewType, setInterviewType] = useState("PHONE");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [savingInterview, setSavingInterview] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      if (!session?.token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/applications/${id}`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        setApp(res.data);
        setResumeVersion(res.data.resumeVersion || "");
        setCoverLetterNotes(res.data.coverLetterNotes || "");
      } catch (error) {
        console.error("Failed to fetch app details", error);
        router.push("/jobs");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id, session?.token, router]);

  async function handleAddNote() {
    if (!newNote.trim() || !session?.token) return;
    
    setSubmittingNote(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/applications/${id}/notes`,
        { content: newNote },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      
      setApp((prev: any) => ({
        ...prev,
        appNotes: [res.data, ...prev.appNotes] // Prepend new note
      }));
      setNewNote("");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingNote(false);
    }
  }

  async function handleSaveResume() {
    if (!session?.token) return;
    setSavingResume(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/applications/${id}`,
        { resumeVersion, coverLetterNotes },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      setApp((prev: any) => ({
        ...prev,
        resumeVersion: res.data.resumeVersion,
        coverLetterNotes: res.data.coverLetterNotes
      }));
      setIsEditingResume(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingResume(false);
    }
  }

  async function handleAddInterview() {
    if (!session?.token || !interviewDate || !interviewTime) return;
    setSavingInterview(true);
    try {
      // Create proper datetime string
      const scheduledAt = new Date(`${interviewDate}T${interviewTime}`).toISOString();
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/applications/${id}/interviews`,
        { roundType: interviewType, scheduledAt, notes: interviewNotes },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      
      setApp((prev: any) => ({
        ...prev,
        interviews: [...(prev.interviews || []), res.data].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      }));
      
      setIsInterviewDialogOpen(false);
      setInterviewDate("");
      setInterviewTime("");
      setInterviewNotes("");
      setInterviewType("PHONE");
    } catch (error) {
      console.error(error);
    } finally {
      setSavingInterview(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading application details...</div>;
  if (!app) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link href="/jobs" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Pipeline
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{app.job.company}</h1>
              <Badge variant="secondary" className={`text-sm px-3 py-0.5 ${STATUS_COLORS[app.status]}`}>
                {app.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground font-medium flex items-center gap-2">
              <Building2 className="h-5 w-5" /> {app.job.role}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
              Delete
            </Button>
            <Button>Edit Application</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Job Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Location</div>
                  <div className="text-muted-foreground">{app.job.location || "Not specified"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Banknote className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Salary</div>
                  <div className="text-muted-foreground">{app.job.salary || "Not specified"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Applied On</div>
                  <div className="text-muted-foreground">
                    {app.appliedAt ? format(new Date(app.appliedAt), "MMM d, yyyy") : "Not applied"}
                  </div>
                </div>
              </div>
              {app.job.jobUrl && (
                <div className="flex items-start gap-3 text-sm pt-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <a href={app.job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline line-clamp-2">
                    {app.job.jobUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resume & Cover Letter Tracker */}
          <Card className="shadow-sm border border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Application Materials</CardTitle>
              {!isEditingResume && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingResume(true)}>Edit</Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditingResume ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resumeVersion" className="text-xs">Resume Version</Label>
                    <Input 
                      id="resumeVersion" 
                      placeholder="e.g. Frontend v2" 
                      value={resumeVersion}
                      onChange={(e) => setResumeVersion(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coverLetterNotes" className="text-xs">Cover Letter Key Points</Label>
                    <Textarea 
                      id="coverLetterNotes" 
                      placeholder="Emphasized Next.js experience..." 
                      value={coverLetterNotes}
                      onChange={(e) => setCoverLetterNotes(e.target.value)}
                      className="mt-1 resize-none h-20"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingResume(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSaveResume} disabled={savingResume}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Resume Version</div>
                    <div className="text-sm font-medium text-foreground">{app.resumeVersion || "Not specified"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Cover Letter Notes</div>
                    <div className="text-sm text-foreground whitespace-pre-wrap">{app.coverLetterNotes || "None"}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Notes & Interviews */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm border border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Textarea 
                    placeholder="Add a new note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleAddNote} disabled={submittingNote || !newNote.trim()}>
                      {submittingNote ? "Adding..." : "Add Note"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 mt-4 border-t border-border">
                  {app.appNotes && app.appNotes.length > 0 ? (
                    app.appNotes.map((note: any) => (
                      <div key={note.id} className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No notes added yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" /> Interviews
                </CardTitle>
                <CardDescription>Track your interview rounds.</CardDescription>
              </div>
              
              <Dialog open={isInterviewDialogOpen} onOpenChange={setIsInterviewDialogOpen}>
                <DialogTrigger render={<Button variant="outline" size="sm">Add Round</Button>} />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Interview Round</DialogTitle>
                    <DialogDescription>Schedule a new interview round for this application.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Round Type</Label>
                      <Select value={interviewType} onValueChange={(val) => setInterviewType(val || "PHONE")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PHONE">Phone Screen</SelectItem>
                          <SelectItem value="TECHNICAL">Technical Round</SelectItem>
                          <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
                          <SelectItem value="FINAL">Final Round</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Prep Notes (Optional)</Label>
                      <Textarea 
                        placeholder="Topics to study, interviewer name..." 
                        value={interviewNotes}
                        onChange={e => setInterviewNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsInterviewDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddInterview} disabled={savingInterview || !interviewDate || !interviewTime}>
                      {savingInterview ? "Saving..." : "Add Interview"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {app.interviews && app.interviews.length > 0 ? (
                <div className="space-y-4">
                  {app.interviews.map((interview: any) => (
                    <div key={interview.id} className="border border-border rounded-lg p-4 bg-card shadow-sm flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-foreground">{interview.roundType} Round</div>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(interview.scheduledAt), "MMM d, yyyy • h:mm a")}
                        </div>
                        {interview.notes && (
                          <p className="text-sm text-muted-foreground mt-3">{interview.notes}</p>
                        )}
                      </div>
                      {interview.outcome && (
                        <Badge variant="outline" className="bg-muted">
                          {interview.outcome}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No interviews scheduled yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
