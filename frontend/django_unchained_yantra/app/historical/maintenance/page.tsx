'use client'
import ChartPage from '../ChartPage';

export default function MaintenancePage() {
  const metrics = [
    {
      label: "Total Maintenance Events",
      value: "24",
      change: "4% from last period",
      trend: "down" as const,
      description: "Total maintenance activities recorded"
    },
    {
      label: "Scheduled Maintenance",
      value: "18",
      change: "2% from last period",
      trend: "up" as const,
      description: "75% of total maintenance"
    },
    {
      label: "Average Downtime",
      value: "2.5h",
      change: "12% from last period",
      trend: "down" as const,
      description: "Per maintenance event"
    },
    {
      label: "Emergency Events",
      value: "6",
      change: "5% from last period",
      trend: "up" as const,
      description: "25% of total maintenance"
    }
  ];

  return <ChartPage 
    type="maintenance" 
    metrics={metrics}
    title="Maintenance Records"
    description="Track historical maintenance activities and equipment performance"
  />;
} 