"use client";

import { DashboardLayout } from "@/components/dashboard-layout";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Plus,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddSalaryStoryDialog from "./components/AddSalaryStoryDialog";
import SalaryStoryDetailsDialog from "./components/SalaryStoryDetailsDialog";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/salaries`;

export interface SalaryStory {
  _id: string;
  companyName: string;
  designation: string;
  location: string;
  experienceLevel: string;
  experience: number;
  totalMonthly: number;
  whichYearsSalary: number;
  minimumIncrement: number;
  employmentType: string;
  department: string;
  isAnonymous: boolean;
}

export default function SalaryStoryPage() {
  const [stories, setStories] = useState<SalaryStory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getCTC = (item: SalaryStory) =>
    ((Number(item.totalMonthly) * 12) / 100000).toFixed(2);

  const fetchStories = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        const onlyStories = data.data.filter(
          (item: any) => item.type === "story"
        );
        setStories(onlyStories);
      } else {
        toast.error("Failed to load salary stories");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const filteredStories = stories.filter(
    (s) =>
      s.designation.toLowerCase().includes(search.toLowerCase()) ||
      s.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Salary Stories</h2>
            <p className="text-muted-foreground">
              Anonymous salary experiences shared by professionals
            </p>
          </div>

          {/* Add Story Button */}
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Story
          </Button>
        </div>

        {/* Add Story Dialog */}
        <AddSalaryStoryDialog
          open={open}
          setOpen={setOpen}
          onSuccess={fetchStories}
        />

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by role or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Stories */}
        {loading ? (
          <p>Loading stories...</p>
        ) : filteredStories.length === 0 ? (
          <p>No salary stories found</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <Card
                key={story._id}
                onClick={() => {
                  setSelectedId(story._id);
                  setDetailsOpen(true);
                }}
                className="border hover:shadow-md transition cursor-pointer"
              >
                <CardHeader className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {story.designation}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {story.companyName}
                      </p>
                    </div>

                    {/* ✅ Anonymous Logic */}
                    {story.isAnonymous && (
                      <Badge variant="secondary">Anonymous</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {story.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {story.experience} yrs
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {story.experienceLevel}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {story.whichYearsSalary}
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="rounded-lg bg-primary/5 p-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      Monthly Salary
                    </p>
                    <p className="text-xl font-bold text-primary">
                      ৳ {story.totalMonthly}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CTC: {getCTC(story)} LPA
                    </p>
                  </div>

                  {/* Increment */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Increment
                    </span>
                    <span className="font-semibold">
                      {story.minimumIncrement}%
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{story.employmentType}</span>
                    <span>{story.department}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <SalaryStoryDetailsDialog
        open={detailsOpen}
        setOpen={setDetailsOpen}
        storyId={selectedId}
        onRefresh={fetchStories}
      />
    </DashboardLayout>
  );
}
