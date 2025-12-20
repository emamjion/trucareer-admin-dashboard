"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/create-salary`;

interface AddSalaryStoryDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
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

  storyTitle: string;
  storyDescription: string;

  pros: string[];
  cons: string[];
  isAnonymous: boolean;
}

export default function AddSalaryStoryDialog({
  open,
  setOpen,
  onSuccess,
}: AddSalaryStoryDialogProps) {
  const [prosInput, setProsInput] = useState("");
  const [consInput, setConsInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<SalaryStoryForm>({
    defaultValues: {
      isAnonymous: true,
      pros: [],
      cons: [],
      minimumIncrement: 0,
    },
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const onSubmit = async (values: SalaryStoryForm) => {
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...values, type: "story" }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to add salary story");
        return;
      }

      toast.success("Salary story added successfully");
      reset();
      setOpen(false);
      await onSuccess();
    } catch {
      toast.error("Something went wrong");
    }
  };

  // Pros/Cons Remove Function
  const removePros = (index: number) => {
    const updated = getValues("pros").filter((_, i) => i !== index);
    setValue("pros", updated);
  };

  const removeCons = (index: number) => {
    const updated = getValues("cons").filter((_, i) => i !== index);
    setValue("cons", updated);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Salary Story</DialogTitle>
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
            <div>
              <Label>Department</Label>
              <Input {...register("department", { required: true })} />
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Experience (Years)</Label>
              <Input
                type="number"
                {...register("experience", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label>Experience Level</Label>
              <Select
                onValueChange={(v) => setValue("experienceLevel", v as any)}
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

            <div>
              <Label>Salary Year</Label>
              <Input
                type="number"
                {...register("whichYearsSalary", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>
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
                {...register("minimumIncrement", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>

          {/* Employment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Employment Type</Label>
              <Select
                onValueChange={(v) => setValue("employmentType", v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Gender</Label>
              <Select onValueChange={(v) => setValue("gender", v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Story */}
          <div>
            <Label>Story Title</Label>
            <Input {...register("storyTitle")} />
          </div>

          <div>
            <Label>Story Description</Label>
            <Textarea rows={4} {...register("storyDescription")} />
          </div>

          {/* Pros / Cons */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pros</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={prosInput}
                  onChange={(e) => setProsInput(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (!prosInput) return;
                    setValue("pros", [...getValues("pros"), prosInput]);
                    setProsInput("");
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watch("pros").map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded"
                  >
                    <span>{item}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removePros(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Cons</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={consInput}
                  onChange={(e) => setConsInput(e.target.value)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (!consInput) return;
                    setValue("cons", [...getValues("cons"), consInput]);
                    setConsInput("");
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watch("cons").map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded"
                  >
                    <span>{item}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCons(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>
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
              {isSubmitting ? "Submitting..." : "Submit Story"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
