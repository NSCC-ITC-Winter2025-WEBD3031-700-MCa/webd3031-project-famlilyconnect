"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart } from "lucide-react";

const trafficData = [
  { day: "Mon", visits: 1200 },
  { day: "Tue", visits: 900 },
  { day: "Wed", visits: 1400 },
  { day: "Thu", visits: 1100 },
  { day: "Fri", visits: 1500 },
  { day: "Sat", visits: 1300 },
  { day: "Sun", visits: 1700 },
];

export function TrafficPatternsCard() {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Weekly Traffic Patterns</CardTitle>
        <LineChart className="w-6 h-6 text-yellow-500" />
      </CardHeader>
      <CardContent className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trafficData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="visits" fill="#FFD300" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
