"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronsUpDown,
  MapPin,
  Pencil,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  storyId: string | null;
  onRefresh: () => void;
}

const departments = [
  "Executive Leadership",
  "Administration",
  "Human Resources (HR) & People Operations",
  "Finance & Accounting",
  "Information Technology (IT)",
  "Engineering & Development",
  "Product Development",
  "Product Management",
  "Operations",
  "Business Development",
  "Sales & Marketing",
  "Customer Service & Support",
  "Research & Development (R&D)",
  "Legal & Compliance",
  "Supply Chain & Procurement",
  "Quality Assurance (QA)",
  "Risk Management",
  "Public Relations (PR) & Corporate Communications",
  "Facilities & Maintenance",
  "Logistics & Distribution",
  "Data Science & Analytics",
  "Design & User Experience (UX/UI)",
  "Security (Physical & Cybersecurity)",
  "Project Management",
];

const experienceYears = Array.from({ length: 16 }, (_, i) => i);
const experienceLevels = ["Entry", "Mid", "Senior", "Lead", "Manager"];
const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const genders = ["Male", "Female", "Other", "Prefer not to say"];
const currentYear = new Date().getFullYear();
const salaryYears = Array.from(
  { length: currentYear - 2020 + 1 },
  (_, i) => 2020 + i
);

// 🔹 Reusable Command ComboBox
const ComboBox = ({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value?: string | number;
  options: (string | number)[];
  placeholder: string;
  onChange: (v: string | number) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {value ?? placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-h-64 overflow-y-auto">
          <Command>
            <CommandInput placeholder={`Search ${label}`} />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.toString()}
                  onSelect={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

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

  const fetchData = async () => {
    if (!storyId || !token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/salaries/${storyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      toast.error("Failed to load story");
    }
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open, storyId]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/salaries/${storyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, type: "story" }),
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Salary Story Details</span>
              {data.isAnonymous && <Badge>Anonymous</Badge>}
            </DialogTitle>
          </DialogHeader>

          {!editMode ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 bg-muted/30">
                <Info
                  icon={<Building2 />}
                  label="Company"
                  value={data.companyName}
                />
                <Info
                  icon={<Briefcase />}
                  label="Role"
                  value={data.designation}
                />
                <Info
                  icon={<MapPin />}
                  label="Location"
                  value={data.location}
                />
                <Info
                  icon={<Calendar />}
                  label="Salary Year"
                  value={data.whichYearsSalary}
                />
                <Info label="Department" value={data.department} />
                <Info
                  label="Experience"
                  value={`${data.experience} yrs (${data.experienceLevel})`}
                />
                <Info label="Employment Type" value={data.employmentType} />
                {data.gender && <Info label="Gender" value={data.gender} />}
              </div>

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

              <Section title="Story">
                <p className="text-muted-foreground">{data.storyDescription}</p>
              </Section>

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
            <div className="space-y-6">
              <Section title="Company & Department">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      value={data.companyName}
                      onChange={(e) =>
                        setData({ ...data, companyName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input
                      value={data.designation}
                      onChange={(e) =>
                        setData({ ...data, designation: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={data.location}
                      onChange={(e) =>
                        setData({ ...data, location: e.target.value })
                      }
                    />
                  </div>
                  <ComboBox
                    label="Department"
                    value={data.department}
                    options={departments}
                    placeholder="Select department"
                    onChange={(v) => setData({ ...data, department: v })}
                  />
                </div>
              </Section>

              <Section title="Experience & Salary Year">
                <div className="grid grid-cols-3 gap-4">
                  <ComboBox
                    label="Experience (Years)"
                    value={data.experience}
                    options={experienceYears}
                    placeholder="Select years"
                    onChange={(v) =>
                      setData({ ...data, experience: Number(v) })
                    }
                  />
                  <ComboBox
                    label="Experience Level"
                    value={data.experienceLevel}
                    options={experienceLevels}
                    placeholder="Select level"
                    onChange={(v) => setData({ ...data, experienceLevel: v })}
                  />
                  <ComboBox
                    label="Salary Year"
                    value={data.whichYearsSalary}
                    options={salaryYears}
                    placeholder="Select year"
                    onChange={(v) =>
                      setData({ ...data, whichYearsSalary: Number(v) })
                    }
                  />
                </div>
              </Section>

              <Section title="Salary Details">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Monthly Salary</Label>
                    <Input
                      type="number"
                      value={data.totalMonthly}
                      onChange={(e) =>
                        setData({
                          ...data,
                          totalMonthly: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Minimum Increment (%)</Label>
                    <Input
                      type="number"
                      value={data.minimumIncrement}
                      onChange={(e) =>
                        setData({
                          ...data,
                          minimumIncrement: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </Section>

              <Section title="Additional Info">
                <div className="grid grid-cols-2 gap-4">
                  <ComboBox
                    label="Employment Type"
                    value={data.employmentType}
                    options={employmentTypes}
                    placeholder="Select employment"
                    onChange={(v) => setData({ ...data, employmentType: v })}
                  />
                  <ComboBox
                    label="Gender"
                    value={data.gender}
                    options={genders}
                    placeholder="Select gender"
                    onChange={(v) => setData({ ...data, gender: v })}
                  />
                </div>
              </Section>

              <Section title="Story">
                <Textarea
                  rows={4}
                  value={data.storyDescription}
                  onChange={(e) =>
                    setData({ ...data, storyDescription: e.target.value })
                  }
                />
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
                  onCheckedChange={(v) => setData({ ...data, isAnonymous: v })}
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

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this salary story? This action
            cannot be undone.
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

/* ================= UI Helpers ================= */
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
