"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  TrendingUp,
  Trash2,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  storyId: string | null;
  onRefresh: () => void;
}

export default function SalaryStoryDetailsDialog({
  open,
  setOpen,
  storyId,
  onRefresh,
}: Props) {
  const [data, setData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!open || !storyId) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/salaries/${storyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {
        toast.error("Failed to load story");
      }
    })();
  }, [open, storyId]);

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/salaries/${storyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!json.success) return toast.error("Update failed");

      toast.success("Story updated");
      setEditMode(false);
      onRefresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/salaries/${storyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!json.success) return toast.error("Delete failed");

      toast.success("Story deleted");
      setConfirmDelete(false);
      setOpen(false);
      onRefresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (!data) return null;

  return (
    <>
      {/* ================= MAIN DETAILS ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Salary Story Details</span>
              {data.isAnonymous && <Badge>Anonymous</Badge>}
            </DialogTitle>
          </DialogHeader>

          {/* ================= VIEW MODE ================= */}
          {!editMode ? (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 bg-muted/30">
                <Info icon={<Building2 />} label="Company" value={data.companyName} />
                <Info icon={<Briefcase />} label="Role" value={data.designation} />
                <Info icon={<MapPin />} label="Location" value={data.location} />
                <Info icon={<Calendar />} label="Salary Year" value={data.whichYearsSalary} />
              </div>

              {/* Salary Highlight */}
              <div className="rounded-xl bg-primary/5 p-5 text-center">
                <p className="text-sm text-muted-foreground">Monthly Salary</p>
                <p className="text-3xl font-bold text-primary">
                  ৳ {data.totalMonthly}
                </p>
                <p className="mt-1 text-sm flex justify-center gap-1 items-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Increment {data.minimumIncrement}%
                </p>
              </div>

              {/* Story */}
              <Section title="Story">
                <p className="text-muted-foreground">{data.storyDescription}</p>
              </Section>

              {/* Pros / Cons */}
              <div className="grid grid-cols-2 gap-6">
                <List title="Pros" items={data.pros} />
                <List title="Cons" items={data.cons} />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
                <Button onClick={() => setEditMode(true)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
              </div>
            </div>
          ) : (
            /* ================= EDIT MODE (LIKE ADD FORM) ================= */
            <div className="space-y-6">
              <Section title="Company Information">
                <Grid>
                  <Field label="Company Name">
                    <Input
                      value={data.companyName}
                      onChange={(e) =>
                        setData({ ...data, companyName: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Designation">
                    <Input
                      value={data.designation}
                      onChange={(e) =>
                        setData({ ...data, designation: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Location">
                    <Input
                      value={data.location}
                      onChange={(e) =>
                        setData({ ...data, location: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Department">
                    <Input
                      value={data.department}
                      onChange={(e) =>
                        setData({ ...data, department: e.target.value })
                      }
                    />
                  </Field>
                </Grid>
              </Section>

              <Section title="Story">
                <Field label="Title">
                  <Input
                    value={data.storyTitle}
                    onChange={(e) =>
                      setData({ ...data, storyTitle: e.target.value })
                    }
                  />
                </Field>
                <Field label="Description">
                  <Textarea
                    rows={4}
                    value={data.storyDescription}
                    onChange={(e) =>
                      setData({ ...data, storyDescription: e.target.value })
                    }
                  />
                </Field>
              </Section>

              <div className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <p className="font-medium">Post as Anonymous</p>
                  <p className="text-xs text-muted-foreground">
                    Identity will be hidden publicly
                  </p>
                </div>
                <Switch
                  checked={data.isAnonymous}
                  onCheckedChange={(v) =>
                    setData({ ...data, isAnonymous: v })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= DELETE CONFIRM ================= */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this salary story? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ================= SMALL UI HELPERS ================= */

function Info({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: any) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children }: any) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function List({ title, items }: any) {
  return (
    <div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <ul className="list-disc pl-5 text-sm text-muted-foreground">
        {items?.length ? items.map((i: string, idx: number) => <li key={idx}>{i}</li>) : "—"}
      </ul>
    </div>
  );
}
