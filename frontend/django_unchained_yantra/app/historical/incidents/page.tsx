'use client'
import { Download, FileDown, AlertTriangle, Clock, Users, Calendar, Filter, Settings } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '../../components/sideBar';
import Header from '../../components/header';
import Navigation from '../../components/navigation';
import RightSidebar from '../../components/rightSideBar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from '@/app/components/Tooltip';
import { Popover } from '@/app/components/Popover';

interface Incident {
  id: string;
  date: string;
  duration: string;
  affectedArea: string;
  cause: string;
  impactedUsers: number;
  status: 'resolved' | 'pending';
  resolutionTime?: string;
}

interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface FilterState {
  zones: string[];
  causes: string[];
  duration: string[];
  status: string[];
}

export default function IncidentsPage() {
  const [incidents] = useState<Incident[]>([
    {
      id: "INC-001",
      date: "2024-03-15",
      duration: "1h 30m",
      affectedArea: "North Zone",
      cause: "Transformer Failure",
      impactedUsers: 2500,
      status: "resolved",
      resolutionTime: "1h 45m"
    },
    {
      id: "INC-002",
      date: "2024-03-14",
      duration: "45m",
      affectedArea: "South Zone",
      cause: "Weather Related",
      impactedUsers: 1200,
      status: "resolved",
      resolutionTime: "50m"
    },
    // Add more incident data as needed
  ]);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: undefined,
    endDate: undefined
  });
  
  const [filters, setFilters] = useState<FilterState>({
    zones: [],
    causes: [],
    duration: [],
    status: []
  });

  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5);

  const handleDownloadReport = async (incidentId?: string) => {
    try {
      const response = await fetch('/api/incidents/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incidentId,
          timeRange: 'monthly',
          format: 'pdf'
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = incidentId 
        ? `incident-report-${incidentId}.pdf`
        : `incident-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const summaryMetrics = [
    {
      title: "Total Incidents",
      value: "47",
      change: "+8% from last month",
      trend: "up",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Average Resolution Time",
      value: "1h 45m",
      change: "-15% from last month",
      trend: "down",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Affected Users",
      value: "12,000",
      change: "+3% from last month",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  const predefinedRanges = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 }
  ];

  const handleRangeSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange({ startDate: start, endDate: end });
  };

  const exportOptions = [
    { label: 'Export as CSV', value: 'csv' },
    { label: 'Export as PDF', value: 'pdf' },
    { label: 'Export as Excel', value: 'excel' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar />
      <div className="flex-1 p-6 w-full md:ml-64 lg:mr-80">
        
        {/* Header with Advanced Controls */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
            <p className="text-gray-500">Review past power outages and system failures</p>
          </div>
          <div className="flex items-center gap-4">
            <Popover
              trigger={
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings size={20} />
                </button>
              }
              content={
                <div className="p-4 w-64">
                  <h3 className="font-medium mb-2">Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                        />
                        Auto-refresh
                      </label>
                    </div>
                    {autoRefresh && (
                      <div>
                        <label className="text-sm text-gray-600">Refresh Interval (minutes)</label>
                        <input
                          type="number"
                          min="1"
                          value={refreshInterval}
                          onChange={(e) => setRefreshInterval(Number(e.target.value))}
                          className="w-full mt-1 rounded-lg border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              }
            />
            <Popover
              trigger={
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2C645B] rounded-lg hover:bg-[#2C645B]/90">
                  <Download size={16} />
                  Export
                </button>
              }
              content={
                <div className="p-2 w-48">
                  {exportOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDownloadReport(option.value)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              }
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {summaryMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.title}</p>
                  <h3 className="text-2xl font-semibold mt-1">{metric.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`${metric.color}`} size={24} />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Date Range Selector */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex gap-2">
                <DatePicker
                  selected={dateRange.startDate}
                  onChange={(date: Date | null) => setDateRange({ ...dateRange, startDate: date || undefined })}
                  selectsStart
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  className="w-full rounded-lg border-gray-300"
                  placeholderText="Start Date"
                />
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={(date: Date | null) => setDateRange({ ...dateRange, endDate: date || undefined })}
                  selectsEnd
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  minDate={dateRange.startDate}
                  className="w-full rounded-lg border-gray-300"
                  placeholderText="End Date"
                />
              </div>
            </div>

            {/* Predefined Ranges */}
            <div className="flex gap-2">
              {predefinedRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handleRangeSelect(range.days)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-4 mt-4">
            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">All Zones</option>
              <option value="north">North Zone</option>
              <option value="south">South Zone</option>
            </select>
            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">All Causes</option>
              <option value="transformer">Transformer Failure</option>
              <option value="weather">Weather Related</option>
              <option value="technical">Technical Issue</option>
            </select>
            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">All Durations</option>
              <option value="short">{'< 30 min'}</option>
              <option value="medium">30 min - 2 hr</option>
              <option value="long">{'> 2 hr'}</option>
            </select>
          </div>
        </div>

        {/* Table with Enhanced Features */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cause</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impacted Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{incident.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.affectedArea}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.cause}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.impactedUsers.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tooltip content={`Resolution time: ${incident.resolutionTime}`}>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        incident.status === 'resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {incident.status}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.resolutionTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDownloadReport(incident.id)}
                      className="text-[#2C645B] hover:text-[#2C645B]/80 transition-colors"
                      title="Download Report"
                    >
                      <FileDown size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 