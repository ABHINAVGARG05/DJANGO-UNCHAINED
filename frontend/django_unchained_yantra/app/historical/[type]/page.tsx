'use client'
import React, { useState } from 'react';
import Sidebar from '../../components/sideba';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const DateRangeSelector = () => {
  const ranges = ['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Last Year'];
  const [selectedRange, setSelectedRange] = useState(ranges[0]);

  return (
    <div className="flex flex-wrap gap-3">
      {ranges.map((range) => (
        <button 
          key={range}
          onClick={() => setSelectedRange(range)}
          className={`px-4 py-2 text-sm rounded-lg font-mono transition-colors ${
            selectedRange === range
              ? 'bg-[#2C645B] text-white'
              : 'border border-[#2C645B]/20 text-[#2C645B] hover:bg-[#F0F7F5]'
          }`}
        >
          {range}
        </button>
      ))}
      <button className="px-4 py-2 text-sm rounded-lg bg-[#F0F7F5] text-[#2C645B] font-mono font-medium">
        Custom Range
      </button>
    </div>
  );
};

const ReportContent = ({ type }: { type: string }) => {
  switch(type) {
    case 'consumption':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-mono text-[#2C645B]/70 mb-1">Total Consumption</h4>
              <p className="text-2xl font-mono font-semibold text-[#2C645B]">2,450 MW</p>
              <span className="text-xs text-[#5CA688]">↑ 2.4% from last period</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-mono text-[#2C645B]/70 mb-1">Peak Demand</h4>
              <p className="text-2xl font-mono font-semibold text-[#2C645B]">3,200 MW</p>
              <span className="text-xs text-[#FC7854]">↑ 5.1% from last period</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-mono text-[#2C645B]/70 mb-1">Average Load</h4>
              <p className="text-2xl font-mono font-semibold text-[#2C645B]">2,100 MW</p>
              <span className="text-xs text-[#5CA688]">↓ 1.2% from last period</span>
            </div>
          </div>
        </>
      );
    case 'generation':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-mono text-[#2C645B]/70 mb-1">Total Generation</h4>
              <p className="text-2xl font-mono font-semibold text-[#2C645B]">2,800 MW</p>
              <span className="text-xs text-[#5CA688]">↑ 3.2% from last period</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-mono text-[#2C645B]/70 mb-1">Renewable Share</h4>
              <p className="text-2xl font-mono font-semibold text-[#2C645B]">18.5%</p>
              <span className="text-xs text-[#5CA688]">↑ 2.1% from last period</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-mono text-[#2C645B]/70 mb-1">Efficiency</h4>
              <p className="text-2xl font-mono font-semibold text-[#2C645B]">92.4%</p>
              <span className="text-xs text-[#5CA688]">↑ 0.5% from last period</span>
            </div>
          </div>
        </>
      );
    case 'maintenance':
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="font-mono font-medium text-[#2C645B] mb-4">Recent Maintenance Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead className="bg-[#F0F7F5] text-[#2C645B]">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Equipment</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="text-[#2C645B]/80">
                  <td className="px-4 py-3">2024-03-01</td>
                  <td className="px-4 py-3">Transformer T1</td>
                  <td className="px-4 py-3">Routine</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-[#5CA688]/10 text-[#5CA688]">
                      Completed
                    </span>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const HistoricalReport = ({ params }: { params: { type: string } }) => {
  const router = useRouter();
  const titles = {
    consumption: 'Power Consumption Report',
    generation: 'Power Generation Report',
    maintenance: 'Maintenance Records',
    incidents: 'Incident Reports'
  };

  const chartOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'mono'
    },
    colors: ['#2C645B', '#5CA688', '#FFB125'],
    theme: { mode: 'light' }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar />
      <div className="flex-1 p-6 w-full md:ml-64">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#2C645B] font-mono mb-6 hover:opacity-80"
          >
            <ArrowLeft size={20} />
            Back to Reports
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-mono font-semibold text-[#2C645B] mb-4">
              {titles[params.type as keyof typeof titles]}
            </h2>
            <DateRangeSelector />
          </div>

          <ReportContent type={params.type} />

          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-mono font-medium text-[#2C645B] mb-4">Trend Analysis</h3>
              <Chart 
                type="line"
                height={350}
                options={chartOptions}
                series={[
                  {
                    name: 'Zone 1',
                    data: [30, 40, 35, 50, 49, 60, 70]
                  },
                  {
                    name: 'Zone 2',
                    data: [20, 35, 40, 45, 39, 55, 65]
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalReport; 