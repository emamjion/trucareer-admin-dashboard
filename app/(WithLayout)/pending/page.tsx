"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Salary {
  _id: string;
  type: "salary" | "story";
  companyName: string;
  designation: string;
  location: string;
  experienceLevel: string;
  experience: string;
  totalMonthly?: number;
  whichYearsSalary?: number;
  minimumIncrement?: number;
  yearsOfIncrement?: number;
  gender?: string;
  employmentType: string;
  department: string;
  storyTitle?: string;
  storyDescription?: string;
  pros?: string[];
  cons?: string[];
  isAnonymous: boolean;
  createdAt: string;
}

export default function PendingSalaryPage() {
  const [data, setData] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(""); // 🔍 SEARCH STATE

  const [selected, setSelected] = useState<Salary | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔁 FETCH PENDING DATA
  const fetchPending = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();
      setData(json.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ APPROVE
  const approveSalary = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    setData((prev) => prev.filter((i) => i._id !== id));
    toast.success("Approved successfully");
  };

  // ❌ REJECT
  const rejectSalary = async () => {
    if (!rejectId) return;

    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${rejectId}/reject`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      }
    );

    setData((prev) => prev.filter((i) => i._id !== rejectId));
    setRejectId(null);
    setRejectReason("");
    toast.success("Rejected successfully");
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // 🔍 FILTER LOGIC (THIS IS THE MAIN PART)
  const filteredData = data.filter((item) =>
    `${item.companyName} ${item.designation} ${item.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Pending Approval</h1>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company, designation, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((item) => (
            <Card key={item._id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">
                    {item.companyName} – {item.designation}
                  </h3>
                  <Badge>{item.type}</Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {item.department} • {item.employmentType}
                </p>

                {item.type === "salary" && (
                  <p className="text-sm">
                    Salary: <strong>{item.totalMonthly}</strong>
                  </p>
                )}

                {item.type === "story" && (
                  <p className="text-sm line-clamp-2">
                    {item.storyDescription}
                  </p>
                )}

                <Separator />

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelected(item)}
                  >
                    View Details
                  </Button>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => approveSalary(item._id)}>
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRejectId(item._id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* DETAILS MODAL */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-2 text-sm">
              <p>
                <b>Company:</b> {selected.companyName}
              </p>
              <p>
                <b>Designation:</b> {selected.designation}
              </p>
              <p>
                <b>Location:</b> {selected.location}
              </p>
              <p>
                <b>Experience:</b> {selected.experienceLevel}
              </p>
              <p>
                <b>Department:</b> {selected.department}
              </p>
              <p>
                <b>Employment:</b> {selected.employmentType}
              </p>

              {selected.type === "salary" && (
                <>
                  <p>
                    <b>Salary:</b> {selected.totalMonthly}
                  </p>
                  <p>
                    <b>Year:</b> {selected.whichYearsSalary}
                  </p>
                  <p>
                    <b>Increment:</b> {selected.minimumIncrement}%
                  </p>
                </>
              )}

              {selected.type === "story" && (
                <>
                  <p>
                    <b>Title:</b> {selected.storyTitle}
                  </p>
                  <p>{selected.storyDescription}</p>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* REJECT MODAL */}
      <Dialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Enter reject reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={rejectSalary}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
