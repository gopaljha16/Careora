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

const STATUS_COLORS: Record<string, string> = {
  WISHLIST: "bg-slate-100 text-slate-700",
  APPLIED: "bg-blue-100 text-blue-700",
  PHONE_SCREEN: "bg-purple-100 text-purple-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  OFFER: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  WITHDRAWN: "bg-orange-100 text-orange-700"
};

export default function JobDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      if (!session?.token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/applications/${id}`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        setApp(res.data);
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

  if (loading) return <div className="p-8 text-center text-slate-500">Loading application details...</div>;
  if (!app) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link href="/jobs" className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Pipeline
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{app.job.company}</h1>
              <Badge variant="secondary" className={`text-sm px-3 py-0.5 ${STATUS_COLORS[app.status]}`}>
                {app.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-xl text-slate-600 font-medium flex items-center gap-2">
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
          <Card className="border-0 shadow-sm ring-1 ring-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">Location</div>
                  <div className="text-slate-600">{app.job.location || "Not specified"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Banknote className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">Salary</div>
                  <div className="text-slate-600">{app.job.salary || "Not specified"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-900">Applied On</div>
                  <div className="text-slate-600">
                    {app.appliedAt ? format(new Date(app.appliedAt), "MMM d, yyyy") : "Not applied"}
                  </div>
                </div>
              </div>
              {app.job.jobUrl && (
                <div className="flex items-start gap-3 text-sm pt-2">
                  <LinkIcon className="h-4 w-4 text-slate-400 mt-0.5" />
                  <a href={app.job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline line-clamp-2">
                    {app.job.jobUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Notes & Interviews */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-0 shadow-sm ring-1 ring-slate-200">
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

                <div className="space-y-4 pt-4 mt-4 border-t">
                  {app.appNotes && app.appNotes.length > 0 ? (
                    app.appNotes.map((note: any) => (
                      <div key={note.id} className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No notes added yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm ring-1 ring-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" /> Interviews
                </CardTitle>
                <CardDescription>Track your interview rounds.</CardDescription>
              </div>
              <Button variant="outline" size="sm">Add Round</Button>
            </CardHeader>
            <CardContent>
              {app.interviews && app.interviews.length > 0 ? (
                <div className="space-y-4">
                  {app.interviews.map((interview: any) => (
                    <div key={interview.id} className="border border-slate-100 rounded-lg p-4 bg-white shadow-sm flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-slate-900">{interview.roundType} Round</div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(interview.scheduledAt), "MMM d, yyyy • h:mm a")}
                        </div>
                        {interview.notes && (
                          <p className="text-sm text-slate-600 mt-3">{interview.notes}</p>
                        )}
                      </div>
                      {interview.outcome && (
                        <Badge variant="outline" className="bg-slate-50">
                          {interview.outcome}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">No interviews scheduled yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
