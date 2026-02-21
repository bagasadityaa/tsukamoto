"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

export const description = "A simple area chart";

export function ChartAreaDefault({ data }) {
  // Normalisasi tanggal
  const normalizeDate = (item) => {
    if (!item.createdAt) return null;

    const d =
      typeof item.createdAt?.toDate === "function"
        ? item.createdAt.toDate()
        : new Date(item.createdAt);

    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // Kelompokkan per hari
  const grouped = {};

  data.forEach((item) => {
    const date = normalizeDate(item);
    if (!date) return;

    if (!grouped[date]) {
      grouped[date] = 0;
    }

    grouped[date] += Number(item.hasil);
  });

  // Ubah ke format chart
  const chartData = Object.entries(grouped).map(([date, total]) => ({
    date,
    total,
  }));
  const chartConfig = {
    total: {
      label: "Total (ml)",
      color: "hsl(var(--chart-1))",
    },
    average: {
      label: "Rata-rata (ml)",
      color: "hsl(var(--chart-2))",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)}
              // hanya tampilkan MM-DD
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Area
              dataKey="total"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
