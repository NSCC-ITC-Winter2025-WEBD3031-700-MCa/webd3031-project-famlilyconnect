"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users } from "lucide-react";

const engagementData = [
  { day: "Mon", users: 100 },
  { day: "Tue", users: 150 },
  { day: "Wed", users: 200 },
  { day: "Thu", users: 250 },
  { day: "Fri", users: 180 },
  { day: "Sat", users: 220 },
  { day: "Sun", users: 300 },
];

export function UserEngagementCard() {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
        <Users className="w-6 h-6 text-blue-500" />
      </CardHeader>
      <CardContent className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={engagementData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
