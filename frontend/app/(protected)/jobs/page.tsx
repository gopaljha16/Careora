"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { formatDistanceToNow } from "date-fns";

const STATUSES = [
  "WISHLIST",
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN"
];

const STATUS_COLORS: Record<string, string> = {
  WISHLIST: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  APPLIED: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  PHONE_SCREEN: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  INTERVIEW: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  OFFER: "bg-green-100 text-green-700 hover:bg-green-200",
  REJECTED: "bg-red-100 text-red-700 hover:bg-red-200",
  WITHDRAWN: "bg-orange-100 text-orange-700 hover:bg-orange-200"
};

// --- Droppable Column Component ---
function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="min-h-[150px] h-full">
      {children}
    </div>
  );
}

// --- Sortable Item Component ---
function SortableAppCard({ app }: { app: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: app.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-900 line-clamp-1">{app.job.company}</h4>
        <Badge variant="secondary" className={`text-xs ml-2 ${STATUS_COLORS[app.status]}`}>
          {app.status.replace("_", " ")}
        </Badge>
      </div>
      <p className="text-sm text-slate-600 line-clamp-1 mb-3">{app.job.role}</p>
      <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-3 border-t border-slate-100">
        <span>{app.appliedAt ? formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true }) : "Not applied"}</span>
        <Link 
          href={`/jobs/${app.id}`} 
          className="text-primary hover:underline"
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking link
        >
          View details
        </Link>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function KanbanBoardPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    async function fetchApps() {
      if (session?.token) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/applications`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          setApplications(res.data);
        } catch (error) {
          console.error("Failed to fetch applications", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchApps();
  }, [session?.token]);

  // Group applications by status
  const columns = STATUSES.map(status => ({
    id: status,
    title: status.replace("_", " "),
    apps: applications.filter(a => a.status === status)
  }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const appId = active.id as string;
    const overId = over.id as string; // Could be a column ID or another app ID

    // Find the app being dragged
    const activeApp = applications.find(a => a.id === appId);
    if (!activeApp) return;

    // Determine the target status
    let newStatus = activeApp.status;
    if (STATUSES.includes(overId)) {
      newStatus = overId;
    } else {
      const overApp = applications.find(a => a.id === overId);
      if (overApp) {
        newStatus = overApp.status;
      }
    }

    if (activeApp.status !== newStatus) {
      // Optimistic update
      setApplications(prev => prev.map(a => 
        a.id === appId ? { ...a, status: newStatus } : a
      ));

      // API call
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/applications/${appId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${session?.token}` } }
        );
      } catch (error) {
        console.error("Failed to update status", error);
        // Revert on failure (simplified - ideally fetch fresh data)
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading pipeline...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Pipeline</h2>
          <p className="text-slate-500 mt-1">Drag and drop applications to update their status.</p>
        </div>
        <Link href="/jobs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Application
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full items-start min-w-max">
            {columns.map((col) => (
              <div key={col.id} className="w-80 flex flex-col bg-slate-100 rounded-xl max-h-full">
                <div className="p-4 flex items-center justify-between border-b border-slate-200">
                  <h3 className="font-semibold text-sm text-slate-700 capitalize">{col.title.toLowerCase()}</h3>
                  <span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2 rounded-full font-medium">
                    {col.apps.length}
                  </span>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto">
                  <SortableContext 
                    id={col.id} 
                    items={col.apps.map(a => a.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumn id={col.id}>
                      {col.apps.map((app) => (
                        <SortableAppCard key={app.id} app={app} />
                      ))}
                    </DroppableColumn>
                  </SortableContext>
                </div>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
