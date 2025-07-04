import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { feedback_type } from "~/lib/types/feedback";
interface Props {
  feedbacks: feedback_type[];
}
type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: {
    name: string;
    value: number;
    color: string;
  }[];
};

const processFeedbacksForChart = ({ feedbacks }: Props) => {
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const weeklyData = Array.from({ length: 7 }, (_, i) => ({
    key: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
    currentWeek: 0,
    previousWeek: 0,
  }));

  feedbacks?.forEach((fb) => {
    const d = new Date(fb.createdAt);
    const idx = d.getDay();

    if (d >= currentWeekStart) {
      weeklyData[idx].currentWeek += 1;
    } else if (d >= previousWeekStart) {
      weeklyData[idx].previousWeek += 1;
    }
  });

  return weeklyData;
};

/* ===== chart component ===== */
const WeeklyFeedbackChart = ({ feedbacks }: Props) => {
  const chartData = processFeedbacksForChart({ feedbacks });

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) =>
    active && payload?.length ? (
      <div className="bg-grey p-2 border text-xs ">
        <p className="font-semibold dark:text-white">{label}</p>
        {payload.map((e) => (
          <p key={e.name} style={{ color: e.color }}>
            {e.name}: {e.value}
          </p>
        ))}
      </div>
    ) : null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 24, right: 42, left: 12, bottom: 14 }}
      >
        <CartesianGrid
          horizontal
          vertical={false}
          strokeDasharray="0"
          stroke="#748791"
        />
        <XAxis
          dataKey="key"
          tick={{ fontSize: 12, fill: "#748791" }}
          tickLine={true}
          axisLine={{ stroke: "#0000" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#748791" }}
          tickLine={false}
          axisLine={{ stroke: "#0000" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="currentWeek"
          stroke="#0AA0EA"
          dot={false}
          name="Current Week"
        />
        <Line
          type="monotone"
          dataKey="previousWeek"
          stroke="#00AD8E"
          dot={false}
          name="Previous Week"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeeklyFeedbackChart;
