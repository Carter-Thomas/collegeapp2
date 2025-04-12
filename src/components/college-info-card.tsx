"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, BookOpen } from "lucide-react";
import { College } from "@/lib/types";

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    const params = new URLSearchParams({
      data: JSON.stringify(college),
    }).toString();
    router.push(`/college/${encodeURIComponent(college.name)}?${params}`);
  };

  return (
    <Card className="w-full rounded-2xl shadow-md hover:shadow-xl transition">
      <CardHeader className="flex flex-row items-center space-x-4">
        <div>
          <CardTitle className="text-lg">{college.name}</CardTitle>
          <p className="text-sm text-muted-foreground flex items-center">
            <MapPin className="w-4 h-4 mr-1" /> {college.city}, {college.state}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" /> SAT:{" "}
            {college.admissions?.sat?.total ?? "N/A"}
          </div>
          <div className="flex items-center">
            🎯 Acceptance:{" "}
            {college.admissions?.rate
              ? `${(college.admissions.rate * 100).toFixed(1)}%`
              : "N/A"}
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
