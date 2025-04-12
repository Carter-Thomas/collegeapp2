"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { MapPin, BookOpen, Users, Award, Calendar } from "lucide-react";
import { College } from "@/lib/types";

export default function CollegeDetailsPage() {
  const searchParams = useSearchParams();
  const collegeData = searchParams.get("data");
  const [scoreType, setScoreType] = useState("SAT");

  if (!collegeData) return <div>Invalid College Data</div>;
  const college: College = JSON.parse(decodeURIComponent(collegeData));

  const acceptanceRate = college.admissions?.rate ?? 0;

  const sat = college.admissions?.sat;
  const act = college.admissions?.act;

  const scoreData =
    scoreType === "SAT"
      ? sat
        ? [
            { name: "Math", value: sat.math },
            { name: "Reading", value: sat.reading },
            { name: "Writing", value: sat.writing },
          ].filter((d) => d.value)
        : []
      : act
        ? [
            { name: "English", value: act.english },
            { name: "Math", value: act.math },
            { name: "Total", value: act.total },
          ].filter((d) => d.value)
        : [];

  const acceptanceData = [
    { name: "Accepted", value: acceptanceRate * 100 },
    { name: "Not Accepted", value: 100 - acceptanceRate * 100 },
  ];
  const OWNERSHIP_COLORS = ["#10b981", "#3b82f6", "#ef4444"]; 
  const ownership = college.ownership;
  const ownershipData =
    ownership === "public"
      ? [{ name: "Public", value: 1 }]
      : ownership === "private non-profit"
      ? [{ name: "Private Non-Profit", value: 1 }]
      : ownership === "private for-profit"
      ? [{ name: "Private For-Profit", value: 1 }]
      : [];

  const ACCEPTANCE_COLORS = ["#45ba75", "#940126"];
  const SAT_COLORS = ["#6366f1", "#a5b4fc", "#818cf8"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="p-8 max-w mx-auto bg-slate-50 min-h-screen">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl shadow-xl overflow-hidden border-0 mb-8">
            <CardHeader className="-mt-6 bg-white rounded-t-3xl relative pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl md:text-4xl font-bold text-slate-800">
                    {college.name}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-2 text-md text-slate-500">
                    <MapPin size={18} className="mr-1" /> {college.city},{" "}
                    {college.state}
                  </CardDescription>
                </div>
                {acceptanceRate > 0 && (
                  <div
                    className={`rounded-lg p-4 text-sm font-semibold text-white ${
                      acceptanceRate > 0.5
                        ? "bg-green-600"
                        : acceptanceRate < 0.8
                          ? "bg-red-600"
                          : acceptanceRate < 0.15
                            ? "bg-orange-500"
                            : "bg-teal-600"
                    }`}
                  >
                    Acceptance: {(acceptanceRate * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="bg-white pt-2 pb-6 space-y-8">
              <div className="bg-slate-50 rounded-xl p-5 leading-relaxed text-slate-700">
                Address: {college.address}, {college.city}, {college.state}{" "}
                {college.zip}
              </div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                
{college.ownership && (
  <Card className="border-0 shadow-md rounded-xl">
    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
      <Award className="text-indigo-500 mb-2 mt-2" size={24} />
      <p className="text-sm text-slate-500">Ownership</p>
      <div
        className={`mt-1 px-3 py-1 rounded-full text-white text-sm font-medium ${
          college.ownership === "public"
            ? "bg-emerald-500"
            : college.ownership === "private non-profit"
            ? "bg-blue-500"
            : "bg-rose-500"
        }`}
      >
        {college.ownership
          .replace("private ", "")
          .replace("-", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())}
      </div>
    </CardContent>
  </Card>
)}
                {college.student_count && (
                  <Card className="border-0 shadow-md rounded-xl">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Users className="text-indigo-500 mb-2 mt-2" size={24} />
                      <p className="text-sm text-slate-500">Student Count</p>
                      <p className="font-bold text-slate-800">
                        {college.student_count.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                )}
                {college.costs?.tuition?.in_state && (
                  <Card className="border-0 shadow-md rounded-xl">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Award className="text-indigo-500 mb-2 mt-2" size={24} />
                      <p className="text-sm text-slate-500">
                        Tuition (In-State)
                      </p>
                      <p className="font-bold text-slate-800">
                        ${college.costs.tuition.in_state.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                )}
                {college.state && (
                  <Card className="border-0 shadow-md rounded-xl">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Calendar
                        className="text-indigo-500 mb-2 mt-2"
                        size={24}
                      />
                      <p className="text-sm text-slate-500">State</p>
                      <p className="font-bold text-slate-800">
                        {college.state}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>

              <Separator />

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {scoreData.length > 0 && (
                  <Card className="border-0 shadow-md rounded-xl">
                    <div className="flex items-center justify-between px-4 pt-4">
                      <h2 className="text-xl font-semibold text-slate-800">
                        Average Test Scores
                      </h2>
                      <Select value={scoreType} onValueChange={setScoreType}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAT" disabled={!sat}>
                            SAT
                          </SelectItem>
                          <SelectItem value="ACT" disabled={!act}>
                            ACT
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                          data={scoreData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [`${value} points`, "Score"]}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {scoreData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={SAT_COLORS[index % SAT_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                )}

                {acceptanceRate > 0 && (
                  <Card className="border-0 shadow-md rounded-xl">
                    <h2 className="text-xl font-semibold text-slate-800 pl-4">
                      Acceptance Rate
                    </h2>
                    <div className="bg-white rounded-xl p-4">
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={acceptanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {acceptanceData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  ACCEPTANCE_COLORS[
                                    index % ACCEPTANCE_COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Rate"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
