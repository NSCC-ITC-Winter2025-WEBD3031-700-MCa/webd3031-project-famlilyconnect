"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts";
import { Users, DollarSign, ShoppingCart, BarChart as BarChartIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  data: { name: string; value: number }[];
  color: string; // Bar color
}

export function AnalyticsCard({ title, value, icon, data, color }: AnalyticsCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* Mini Bar Chart */}
        <div className="h-20 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Tooltip />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
