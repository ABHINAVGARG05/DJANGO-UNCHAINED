'use client'
import React, { useState } from 'react';
import Sidebar from '../components/sideBar';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Chart = dynamic(
  () => import('react-apexcharts'),
  { 
    ssr: false,
    loading: () => <div>Loading chart...</div>
  }
);

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
    </div>
  );
};

interface ChartPageProps {
  type: string;
  metrics: {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    description?: string;
  }[];
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const ChartComponent = () => {
  const chartOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'mono'
    },
    colors: ['#2C645B', '#5CA688', '#FFB125'],
    theme: { mode: 'light' as const }
  };

  return (
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
  );
};

const ChartPage = ({ type, metrics, title, description, children }: ChartPageProps) => {
  const router = useRouter();

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
              {title}
            </h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <DateRangeSelector />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-mono text-[#2C645B]/70 mb-1">{metric.label}</h4>
                <p className="text-2xl font-mono font-semibold text-[#2C645B]">{metric.value}</p>
                <span className={`text-xs ${metric.trend === 'up' ? 'text-[#5CA688]' : 'text-[#FC7854]'}`}>
                  {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
                </span>
              </div>
            ))}
          </div>

          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-mono font-medium text-[#2C645B] mb-4">Trend Analysis</h3>
              <ChartComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPage; 