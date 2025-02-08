'use client'
import React from 'react';
import Sidebar from '../components/sideBar';
import Header from '../components/header';
import Navigation from '../components/navigation';
import { Activity, Battery, Wrench, AlertTriangle } from 'lucide-react';

interface HistoricalCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const HistoricalCard = ({ title, description, icon: Icon }: HistoricalCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-lg bg-[#F0F7F5] group-hover:bg-[#2C645B]/10 transition-colors">
        <Icon className="text-[#2C645B]" size={24} />
      </div>
      <span className="text-xs font-mono text-[#2C645B]/60">View Report →</span>
    </div>
    <h3 className="font-mono font-semibold text-[#2C645B] mb-2">{title}</h3>
    <p className="text-sm font-mono text-[#2C645B]/70">{description}</p>
  </div>
);

const HistoricalData = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar/>
      <div className="flex-1 p-6 w-full md:ml-64">
        <Navigation/>
        <Header/>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Historical Data Analysis</h2>
            <p className="text-gray-500">Select a category to view detailed historical reports and analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HistoricalCard 
              title="Power Consumption"
              description="Analyze historical power consumption patterns across different zones and time periods"
              icon={Activity}
            />
            <HistoricalCard 
              title="Power Generation"
              description="View detailed reports of power generation from various sources over time"
              icon={Battery}
            />
            <HistoricalCard 
              title="Maintenance Records"
              description="Access past maintenance logs, schedules, and equipment history"
              icon={Wrench}
            />
            <HistoricalCard 
              title="Incident Reports"
              description="Review past incidents, outages, and resolution details"
              icon={AlertTriangle}
            />
          </div>

          {/* Date Range Selector */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800 mb-4">Quick Date Range Selection</h3>
            <div className="flex flex-wrap gap-3">
              {['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Last Year'].map((range) => (
                <button 
                  key={range}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                >
                  {range}
                </button>
              ))}
              <button className="px-4 py-2 text-sm rounded-lg bg-[#F0F7F5] text-[#2C645B] font-mono font-medium">
                Custom Range
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalData; 