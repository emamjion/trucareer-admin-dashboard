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
  isVerified: boolean;
  createdAt: string;
}

export default function PendingSalaryPage() {
  const [data, setData] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(""); // 🔍 SEARCH STATE

  const [selected, setSelected] = useState<Salary | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterType, setFilterType] = useState("");

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
  const filteredData = data.filter((item) => {
    const matchSearch =
      `${item.companyName} ${item.designation} ${item.department}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchExperience = filterExperience
      ? item.experienceLevel === filterExperience
      : true;

    const matchLocation = filterLocation
      ? item.location.toLowerCase().includes(filterLocation.toLowerCase())
      : true;

    const matchDepartment = filterDepartment
      ? item.department.toLowerCase().includes(filterDepartment.toLowerCase())
      : true;

    const matchType = filterType ? item.type === filterType : true;

    return (
      matchSearch &&
      matchExperience &&
      matchLocation &&
      matchDepartment &&
      matchType
    );
  });

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Pending Approval</h1>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company, designation, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full lg:max-w-3xl">
            {/* TYPE */}
            <select
              className="border rounded-md px-3 py-2 text-sm bg-background"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="salary">Salary</option>
              <option value="story">Story</option>
            </select>

            {/* EXPERIENCE */}
            <select
              className="border rounded-md px-3 py-2 text-sm bg-background"
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
            >
              <option value="">All Experience</option>
              <option value="Entry">Entry</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>

            {/* LOCATION */}
            <select
              className="border rounded-md px-3 py-2 text-sm bg-background"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {[...new Set(data.map((i) => i.location))].map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* DEPARTMENT */}
            <select
              className="border rounded-md px-3 py-2 text-sm bg-background"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {[...new Set(data.map((i) => i.department))].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* BASIC INFO */}
              <div>
                <p className="text-muted-foreground">Company</p>
                <p className="font-medium">{selected.companyName}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Designation</p>
                <p className="font-medium">{selected.designation}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium">{selected.location}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{selected.department}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Employment Type</p>
                <p className="font-medium">{selected.employmentType}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Experience Level</p>
                <p className="font-medium">{selected.experienceLevel}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Experience (Years)</p>
                <p className="font-medium">{selected.experience}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium">{selected.gender || "N/A"}</p>
              </div>

              {/* SALARY INFO */}
              {selected.totalMonthly && (
                <>
                  <Separator className="col-span-2 my-2" />

                  <div>
                    <p className="text-muted-foreground">Monthly Salary</p>
                    <p className="font-semibold text-green-600">
                      ৳ {selected.totalMonthly.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Salary Year</p>
                    <p className="font-medium">{selected.whichYearsSalary}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Minimum Increment</p>
                    <p className="font-medium">{selected.minimumIncrement}%</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Increment Year</p>
                    <p className="font-medium">{selected.yearsOfIncrement}</p>
                  </div>
                </>
              )}

              {/* STORY */}
              {selected.storyDescription && (
                <>
                  <Separator className="col-span-2 my-2" />
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1">Story</p>
                    <p className="leading-relaxed">
                      {selected.storyDescription}
                    </p>
                  </div>
                </>
              )}

              {/* META */}
              <Separator className="col-span-2 my-2" />

              <div>
                <p className="text-muted-foreground">Anonymous</p>
                <Badge variant={selected.isAnonymous ? "secondary" : "outline"}>
                  {selected.isAnonymous ? "Yes" : "No"}
                </Badge>
              </div>

              <div>
                <p className="text-muted-foreground">Verified</p>
                <Badge
                  variant={selected.isVerified ? "default" : "destructive"}
                >
                  {selected.isVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>

              <div className="col-span-2">
                <p className="text-muted-foreground">Submitted At</p>
                <p className="font-medium">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
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
