'use client'
import ChartPage from '../ChartPage';

export default function ConsumptionPage() {
  const metrics = [
    {
      label: "Total Consumption",
      value: "2,450 MW",
      change: "2.4% from last period",
      trend: "up" as const
    },
    {
      label: "Peak Demand",
      value: "3,200 MW",
      change: "5.1% from last period",
      trend: "up" as const
    },
    {
      label: "Average Load",
      value: "2,100 MW",
      change: "1.2% from last period",
      trend: "down" as const
    }
  ];

  return <ChartPage type="consumption" metrics={metrics} />;
} 