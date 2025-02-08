'use client'
import ChartPage from '../ChartPage';

export default function MaintenancePage() {
  const metrics = [
    {
      label: "Total Maintenance",
      value: "24",
      change: "4% from last period",
      trend: "down" as const
    },
    {
      label: "Scheduled",
      value: "18",
      change: "2% from last period",
      trend: "up" as const
    },
    {
      label: "Completed",
      value: "15",
      change: "5% from last period",
      trend: "up" as const
    }
  ];

  return <ChartPage type="maintenance" metrics={metrics} />;
} 