'use client'
import ChartPage from '../ChartPage';

export default function GenerationPage() {
  const metrics = [
    {
      label: "Total Generation",
      value: "2,800 MW",
      change: "3.2% from last period",
      trend: "up" as const
    },
    {
      label: "Renewable Share",
      value: "18.5%",
      change: "2.1% from last period",
      trend: "up" as const
    },
    {
      label: "Efficiency",
      value: "92.4%",
      change: "0.5% from last period",
      trend: "up" as const
    }
  ];

  return <ChartPage type="generation" metrics={metrics} />;
} 