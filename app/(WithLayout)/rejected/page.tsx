"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RejectedSalaryPage() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchRejected = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rejected`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const json = await res.json();
    setData(json.data || []);
  };

  const restoreSalary = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}/restore`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setData((prev) => prev.filter((i) => i._id !== id));
    toast.success("Restored & Approved");
  };

  useEffect(() => {
    fetchRejected();
  }, []);

  const filtered = data.filter((item) =>
    `${item.companyName} ${item.designation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Rejected Submissions</h1>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rejected..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item._id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">
                    {item.companyName} – {item.designation}
                  </h3>
                  <Badge variant="destructive">Rejected</Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  Reason: {item.rejectionReason || "N/A"}
                </p>

                <Separator />

                <Button size="sm" onClick={() => restoreSalary(item._id)}>
                  Restore & Approve
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
