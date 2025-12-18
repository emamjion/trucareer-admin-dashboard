"use client";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/create-salary`;

type SalaryData = {
  companyName: string;
  designation: string;
  location: string;
  experienceLevel: string;
  experience: number;
  totalMonthly: number;
  whichYearsSalary: number;
  minimumIncrement: number;
  yearsOfIncrement: number;
  gender: string;
  employmentType: string;
  department: string;
  isVerified: boolean;
};

interface SalaryEntryDialogProps {
  onSuccess?: () => void;
}

export function SalaryEntryDialog({ onSuccess }: SalaryEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [salaryData, setSalaryData] = useState<SalaryData>({
    companyName: "",
    designation: "",
    location: "",
    experienceLevel: "",
    experience: 0,
    totalMonthly: 0,
    whichYearsSalary: new Date().getFullYear(),
    minimumIncrement: 0,
    yearsOfIncrement: 0,
    gender: "",
    employmentType: "",
    department: "",
    isVerified: false,
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
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to create salary data");

      if (data.success) {
        toast.success("Salary added successfully!");
        onSuccess?.();
        setOpen(false);
      }

      // reset form
      setSalaryData({
        companyName: "",
        designation: "",
        location: "",
        experienceLevel: "",
        experience: 0,
        totalMonthly: 0,
        whichYearsSalary: new Date().getFullYear(),
        minimumIncrement: 0,
        yearsOfIncrement: 0,
        gender: "",
        employmentType: "",
        department: "",
        isVerified: false,
      });
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Salary Entry</DialogTitle>
          <DialogDescription>
            Share your salary information to help others in the community
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                placeholder="e.g., Software Engineer"
                value={salaryData.designation}
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    designation: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="e.g., Google"
                value={salaryData.companyName}
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Bangalore"
                value={salaryData.location}
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input
                id="experience"
                type="number"
                placeholder="3"
                value={salaryData.experience}
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    experience: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={salaryData.experienceLevel}
                onValueChange={(val: string) =>
                  setSalaryData((prev) => ({ ...prev, experienceLevel: val }))
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

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Engineering"
                value={salaryData.department}
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalMonthly">Total Monthly (BDT)</Label>
              <Input
                id="totalMonthly"
                type="number"
                value={salaryData.totalMonthly}
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    totalMonthly: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whichYearsSalary">Salary Year</Label>
              <Input
                id="whichYearsSalary"
                type="number"
                value={salaryData.whichYearsSalary}
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    whichYearsSalary: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumIncrement">Minimum Increment (%)</Label>
              <Input
                id="minimumIncrement"
                type="number"
                value={salaryData.minimumIncrement}
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    minimumIncrement: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={salaryData.gender}
                onValueChange={(val: string) =>
                  setSalaryData((prev) => ({ ...prev, gender: val }))
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

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                value={salaryData.employmentType}
                onValueChange={(val: string) =>
                  setSalaryData((prev) => ({ ...prev, employmentType: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
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
