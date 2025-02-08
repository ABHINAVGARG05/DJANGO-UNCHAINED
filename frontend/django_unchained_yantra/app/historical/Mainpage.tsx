'use client'
import React from 'react';
import Sidebar from '../components/sideBar';
import { Activity, Battery, Wrench, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface HistoricalCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const HistoricalCard = ({ title, description, icon: Icon, href }: HistoricalCardProps) => (
  <Link 
    href={href}
    className="card hover:shadow-md transition-all group"
  >
    <div className="flex items-start justify-between mb-6">
      <div className="p-4 rounded-lg bg-[var(--primary-light)] 
                    group-hover:bg-[var(--primary-dark)]/10 transition-colors">
        <Icon className="text-[var(--primary-dark)]" size={24} />
      </div>
      <span className="text-xs font-medium text-[var(--primary-dark)]/60 
                     group-hover:text-[var(--primary-dark)]">
        View Report →
      </span>
    </div>
    <h3 className="heading-2 text-[var(--primary-dark)] mb-2">{title}</h3>
    <p className="text-body">{description}</p>
  </Link>
);

const HistoricalData = () => {
  const reports = [
    {
      title: "Power Consumption",
      description: "Analyze historical power consumption patterns across different zones and time periods",
      icon: Activity,
      href: "/historical/consumption"
    },
    {
      title: "Power Generation",
      description: "View detailed reports of power generation from various sources over time",
      icon: Battery,
      href: "/historical/generation"
    },
    {
      title: "Maintenance Records",
      description: "Access past maintenance logs, schedules, and equipment history",
      icon: Wrench,
      href: "/historical/maintenance"
    },
    {
      title: "Incident Reports",
      description: "Review past incidents, outages, and resolution details",
      icon: AlertTriangle,
      href: "/historical/incidents"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar/>
      <div className="flex-1 p-6 w-full md:ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-mono font-semibold text-[#2C645B] mb-2">Historical Data Analysis</h2>
            <p className="font-mono text-[#2C645B]/70">Select a category to view detailed historical reports and analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <HistoricalCard 
                key={report.href}
                {...report}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalData; 