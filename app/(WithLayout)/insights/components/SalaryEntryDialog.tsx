"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/create-salary`;

/* ---------------- TYPES ---------------- */

type SalaryData = {
  companyName: string;
  designation: string;
  location: string;
  experienceLevel: string;
  experience: number;
  totalMonthly: number;
  whichYearsSalary: number;
  minimumIncrement: number;
  // yearsOfIncrement: number;
  gender: string;
  employmentType: string;
  department: string;
  isVerified: boolean;
  type: string;
};

interface SalaryEntryDialogProps {
  onSuccess?: () => void;
}

/* ---------------- CONSTANT DATA ---------------- */

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

const currentYear = new Date().getFullYear();
const salaryYears = Array.from(
  { length: currentYear - 2020 + 1 },
  (_, i) => 2020 + i
);

/* ---------------- COMPONENT ---------------- */

export function SalaryEntryDialog({ onSuccess }: SalaryEntryDialogProps) {
  const [open, setOpen] = useState(false);

  const [salaryData, setSalaryData] = useState<SalaryData>({
    companyName: "",
    designation: "",
    location: "",
    experienceLevel: "",
    experience: 0,
    totalMonthly: 0,
    whichYearsSalary: currentYear,
    minimumIncrement: 0,
    // yearsOfIncrement: 0,
    gender: "",
    employmentType: "",
    department: "",
    isVerified: false,
    type: "salary",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSave = async () => {
    if (!token) return toast.error("Unauthorized. Please login again.");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(salaryData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create salary data");
      }

      toast.success("Salary added successfully!");
      onSuccess?.();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Salary Data
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Add New Salary Entry</DialogTitle>
          <DialogDescription>
            Share your salary information to help others
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Designation & Company */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Designation</Label>
              <Input
                value={salaryData.designation}
                onChange={(e) =>
                  setSalaryData((p) => ({
                    ...p,
                    designation: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>Company</Label>
              <Input
                value={salaryData.companyName}
                onChange={(e) =>
                  setSalaryData((p) => ({
                    ...p,
                    companyName: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Location</Label>
              <Input
                value={salaryData.location}
                onChange={(e) =>
                  setSalaryData((p) => ({
                    ...p,
                    location: e.target.value,
                  }))
                }
              />
            </div>

            {/* Experience ComboBox */}
            <div>
              <Label>Experience (Years)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {salaryData.experience} Years
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-h-64 overflow-y-auto">
                  <Command>
                    <CommandInput placeholder="Search experience..." />
                    <CommandGroup>
                      {experienceYears.map((year) => (
                        <CommandItem
                          key={year}
                          onSelect={() =>
                            setSalaryData((p) => ({
                              ...p,
                              experience: year,
                            }))
                          }
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              salaryData.experience === year
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {year} Years
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Experience Level & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Experience Level</Label>
              <Select
                value={salaryData.experienceLevel}
                onValueChange={(v) =>
                  setSalaryData((p) => ({ ...p, experienceLevel: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry">Entry</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department ComboBox */}
            <div>
              <Label>Department</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {salaryData.department || "Select department"}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 max-h-64 overflow-y-auto">
                  <Command>
                    <CommandInput placeholder="Search department..." />
                    <CommandEmpty>No department found.</CommandEmpty>
                    <CommandGroup>
                      {departments.map((dept) => (
                        <CommandItem
                          key={dept}
                          onSelect={() =>
                            setSalaryData((p) => ({
                              ...p,
                              department: dept,
                            }))
                          }
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              salaryData.department === dept
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {dept}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Salary Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Total Monthly (BDT)</Label>
              <Input
                type="number"
                value={salaryData.totalMonthly}
                onChange={(e) =>
                  setSalaryData((p) => ({
                    ...p,
                    totalMonthly: Number(e.target.value),
                  }))
                }
              />
            </div>

            {/* Salary Year ComboBox */}
            <div>
              <Label>Salary Year</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {salaryData.whichYearsSalary}
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Search year..." />
                    <CommandGroup>
                      {salaryYears.map((year) => (
                        <CommandItem
                          key={year}
                          onSelect={() =>
                            setSalaryData((p) => ({
                              ...p,
                              whichYearsSalary: year,
                            }))
                          }
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              salaryData.whichYearsSalary === year
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {year}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Minimum Increment (%)</Label>
              <Input
                type="number"
                value={salaryData.minimumIncrement}
                onChange={(e) =>
                  setSalaryData((p) => ({
                    ...p,
                    minimumIncrement: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          {/* Extra Fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <Label>Years of Increment</Label>
              <Input
                type="number"
                value={salaryData.yearsOfIncrement}
                onChange={(e) =>
                  setSalaryData((p) => ({
                    ...p,
                    yearsOfIncrement: Number(e.target.value),
                  }))
                }
              />
            </div> */}

            <div>
              <Label>Employment Type</Label>
              <Select
                value={salaryData.employmentType}
                onValueChange={(v) =>
                  setSalaryData((p) => ({ ...p, employmentType: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                value={salaryData.gender}
                onValueChange={(v) =>
                  setSalaryData((p) => ({ ...p, gender: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Entry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
