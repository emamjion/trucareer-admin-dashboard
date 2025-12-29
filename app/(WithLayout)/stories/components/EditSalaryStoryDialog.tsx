"use client";

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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/salaries`;

interface EditSalaryStoryDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  storyData: any; // SalaryStory object
  onSuccess: () => void | Promise<void>;
}

interface SalaryStoryForm {
  companyName: string;
  designation: string;
  location: string;
  department: string;

  experience: number;
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead" | "Manager";

  totalMonthly: number;
  whichYearsSalary: number;
  minimumIncrement: number;

  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";

  storyDescription: string;
  isAnonymous: boolean;
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

const currentYear = new Date().getFullYear();
const salaryYears = Array.from(
  { length: currentYear - 2020 + 1 },
  (_, i) => 2020 + i
);

const experienceLevels = ["Entry", "Mid", "Senior", "Lead", "Manager"];
const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const genders = ["Male", "Female", "Other", "Prefer not to say"];

const Combobox = ({
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
        <PopoverContent className="w-full p-0">
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

export default function EditSalaryStoryDialog({
  open,
  setOpen,
  storyData,
  onSuccess,
}: EditSalaryStoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<SalaryStoryForm>({
    defaultValues: storyData,
  });

  useEffect(() => {
    reset(storyData);
  }, [storyData, reset]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const onSubmit = async (values: SalaryStoryForm) => {
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await fetch(`${API_URL}/${storyData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to update salary story");
        return;
      }

      toast.success("Salary story updated successfully");
      setOpen(false);
      await onSuccess();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Salary Story</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input {...register("companyName", { required: true })} />
            </div>
            <div>
              <Label>Designation</Label>
              <Input {...register("designation", { required: true })} />
            </div>
            <div>
              <Label>Location</Label>
              <Input {...register("location", { required: true })} />
            </div>
            <Combobox
              label="Department"
              value={watch("department")}
              options={departments}
              placeholder="Select department"
              onChange={(v) => setValue("department", v as string)}
            />
          </div>

          {/* Experience */}
          <div className="grid grid-cols-3 gap-4">
            <Combobox
              label="Experience (Years)"
              value={watch("experience")}
              options={experienceYears}
              placeholder="Select years"
              onChange={(v) => setValue("experience", Number(v))}
            />

            <Combobox
              label="Experience Level"
              value={watch("experienceLevel")}
              options={experienceLevels}
              placeholder="Select level"
              onChange={(v) => setValue("experienceLevel", v as any)}
            />

            <Combobox
              label="Salary Year"
              value={watch("whichYearsSalary")}
              options={salaryYears}
              placeholder="Select year"
              onChange={(v) => setValue("whichYearsSalary", Number(v))}
            />
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Monthly Salary</Label>
              <Input
                type="number"
                {...register("totalMonthly", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>
            <div>
              <Label>Minimum Increment (%)</Label>
              <Input
                type="number"
                {...register("minimumIncrement", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Employment & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <Combobox
              label="Employment Type"
              value={watch("employmentType")}
              options={employmentTypes}
              placeholder="Select employment"
              onChange={(v) => setValue("employmentType", v as any)}
            />

            <Combobox
              label="Gender"
              value={watch("gender")}
              options={genders}
              placeholder="Select gender"
              onChange={(v) => setValue("gender", v as any)}
            />
          </div>

          {/* Story */}
          <div>
            <Label>Story Description</Label>
            <Textarea rows={4} {...register("storyDescription")} />
          </div>

          {/* Anonymous */}
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <p className="font-medium">Post as Anonymous</p>
              <p className="text-xs text-muted-foreground">
                Your identity will not be shown publicly
              </p>
            </div>
            <Switch
              checked={watch("isAnonymous")}
              onCheckedChange={(v) => setValue("isAnonymous", v)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Story"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
