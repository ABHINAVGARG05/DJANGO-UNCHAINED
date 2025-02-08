'use client'
import { useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineProps, Label, BarChart, Bar
} from 'recharts';
import DatePicker from 'react-datepicker';
import { Popover } from '@/app/components/Popover';
import { Download, Settings, AlertCircle, BarChart3, Table2, Filter, Share2, Search, Calendar, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { format, addHours, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface GenerationData {
  timestamp: string;
  totalGeneration: number;
  solarGeneration: number;
  windGeneration: number;
  conventionalGeneration: number;
  renewableContribution: number;
  efficiencyScore: number;
  hasAnomaly: boolean;
}

interface SummaryMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  description: string;
  unit: string;
}

interface Alert {
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

const COLORS: Record<string, string> = {
  'Solar': '#FDB913',
  'Wind': '#00A0DC',
  'Conventional': '#6E7681'
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.payload.fill }} />
          <span className="font-medium">{data.name}</span>
        </div>
        <div className="mt-1">
          <div className="text-gray-600">{data.value} MW</div>
          <div className="text-sm text-gray-500">{((data.value / 2800) * 100).toFixed(1)}% of total</div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomizedLabel = ({ cx, cy }: any) => {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-0.5em" className="text-xl font-semibold">2,800</tspan>
      <tspan x={cx} dy="1.5em" className="text-sm text-gray-500">Total MW</tspan>
    </text>
  );
};

export default function GenerationPage() {
  const [activeTab, setActiveTab] = useState<'visual' | 'table'>('visual');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null
  });
  const [selectedSources, setSelectedSources] = useState(['solar', 'wind', 'conventional']);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedPieSection, setSelectedPieSection] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Generate 50 dummy records
  const generateDummyData = (): GenerationData[] => {
    const data: GenerationData[] = [];
    const startDate = new Date('2024-03-15 00:00');
    
    for (let i = 0; i < 50; i++) {
      const timestamp = addHours(startDate, i);
      const baseGeneration = 2000 + Math.random() * 1500;
      const solarGen = Math.random() * 1200;
      const windGen = Math.random() * 1000;
      const conventionalGen = baseGeneration - (solarGen + windGen);
      const renewable = ((solarGen + windGen) / baseGeneration) * 100;
      
      data.push({
        timestamp: format(timestamp, "yyyy-MM-dd HH:mm"),
        totalGeneration: Math.round(baseGeneration),
        solarGeneration: Math.round(solarGen),
        windGeneration: Math.round(windGen),
        conventionalGeneration: Math.round(conventionalGen),
        renewableContribution: Math.round(renewable * 10) / 10,
        efficiencyScore: Math.round(85 + Math.random() * 10),
        hasAnomaly: Math.random() > 0.9 // 10% chance of anomaly
      });
    }
    return data;
  };

  const [generationData] = useState<GenerationData[]>(generateDummyData());

  const pieData = [
    { name: 'Solar', value: 800 },
    { name: 'Wind', value: 600 },
    { name: 'Conventional', value: 1400 },
  ];

  const metrics = [
    {
      label: "Total Generation",
      value: "2,800 MW",
      change: "3.2% from last period",
      trend: "up" as const,
      description: "Total power generated across all sources",
      unit: "MW"
    },
    {
      label: "Renewable Share",
      value: "18.5%",
      change: "2.1% from last period",
      trend: "up" as const,
      description: "Percentage of power from renewable sources",
      unit: "%"
    },
    {
      label: "Efficiency",
      value: "92.4%",
      change: "0.5% from last period",
      trend: "up" as const,
      description: "Overall generation efficiency",
      unit: "%"
    }
  ];

  const predefinedRanges = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last Quarter', days: 90 }
  ];

  const handleRangeSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange({ startDate: start, endDate: end });
  };

  const handleExport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Power Generation Report', 14, 15);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    // Add table
    const tableData = generationData.map(data => [
      new Date(data.timestamp).toLocaleString(),
      data.totalGeneration.toString(),
      data.solarGeneration.toString(),
      data.windGeneration.toString(),
      data.conventionalGeneration.toString(),
      `${data.renewableContribution}%`,
      `${data.efficiencyScore}%`
    ]);

    (doc as any).autoTable({
      startY: 40,
      head: [['Time', 'Total (MW)', 'Solar (MW)', 'Wind (MW)', 'Conv. (MW)', 'Renewable %', 'Efficiency']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [44, 100, 91] }
    });

    doc.save('power-generation-report.pdf');
  };

  const energySources = [
    { label: 'Solar', value: 'solar' },
    { label: 'Wind', value: 'wind' },
    { label: 'Conventional', value: 'conventional' }
  ];

  const handlePieClick = useCallback((data: any) => {
    setSelectedPieSection(selectedPieSection === data.name ? null : data.name);
  }, [selectedPieSection]);

  // Enhanced search function
  const filteredData = generationData.filter(data => {
    const searchStr = searchQuery.toLowerCase();
    const date = parseISO(data.timestamp);
    const formattedDate = format(date, 'MMMM dd, yyyy'); // March 15, 2024
    const dayOfWeek = format(date, 'EEEE'); // Monday, Tuesday, etc.
    const timeStr = format(date, 'HH:mm'); // 14:00

    return (
      formattedDate.toLowerCase().includes(searchStr) ||
      dayOfWeek.toLowerCase().includes(searchStr) ||
      timeStr.includes(searchStr) ||
      data.totalGeneration.toString().includes(searchStr) ||
      data.solarGeneration.toString().includes(searchStr) ||
      data.windGeneration.toString().includes(searchStr) ||
      data.conventionalGeneration.toString().includes(searchStr) ||
      data.renewableContribution.toString().includes(searchStr) ||
      data.efficiencyScore.toString().includes(searchStr)
    );
  });

  // Pagination controls
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  // Sample data
  const generationTrendData = [
    { time: '00:00', actual: 2100, forecast: 2000 },
    { time: '04:00', actual: 2400, forecast: 2200 },
    { time: '08:00', actual: 2800, forecast: 2600 },
    { time: '12:00', actual: 3200, forecast: 3000 },
    { time: '16:00', actual: 2900, forecast: 2800 },
    { time: '20:00', actual: 2600, forecast: 2400 },
  ];

  const sourceDistributionData = [
    { name: 'Solar', value: 45, color: '#FDB913' },
    { name: 'Wind', value: 30, color: '#00A0DC' },
    { name: 'Conventional', value: 25, color: '#6E7681' },
  ];

  const efficiencyData = [
    { name: 'Solar', efficiency: 92 },
    { name: 'Wind', efficiency: 88 },
    { name: 'Conventional', efficiency: 85 },
  ];

  const recentEvents = [
    {
      type: 'warning',
      title: 'Solar Output Drop',
      description: 'Solar generation 15% below forecast due to unexpected cloud cover',
      time: '2 hours ago'
    },
    {
      type: 'success',
      title: 'Wind Generation Peak',
      description: 'Wind turbines achieving 95% efficiency due to optimal conditions',
      time: '4 hours ago'
    },
    {
      type: 'error',
      title: 'Maintenance Required',
      description: 'Transformer A1 showing signs of reduced efficiency',
      time: '6 hours ago'
    }
  ];

  const alerts: Alert[] = [
    {
      type: 'warning',
      title: 'Solar Output Drop',
      message: 'Solar generation 15% below forecast due to unexpected cloud cover',
      timestamp: '2 hours ago'
    },
    {
      type: 'error',
      title: 'Wind Turbine Maintenance',
      message: 'Turbine W3 requires immediate maintenance - efficiency dropped by 25%',
      timestamp: '3 hours ago'
    },
    {
      type: 'info',
      title: 'Peak Generation',
      message: 'Achieved 98% efficiency in conventional generation',
      timestamp: '4 hours ago'
    }
  ];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Add data refresh logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Power Generation</h1>
            <p className="text-gray-500">Track and analyze power generation metrics</p>
          </div>
          <div className="flex gap-4">
            <Popover
              trigger={
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={16} />
                  Filters
                </button>
              }
              content={
                <div className="p-4 w-64">
                  <h3 className="font-medium mb-3">Energy Sources</h3>
                  {energySources.map(source => (
                    <label key={source.value} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSources([...selectedSources, source.value]);
                          } else {
                            setSelectedSources(selectedSources.filter(s => s !== source.value));
                          }
                        }}
                      />
                      {source.label}
                    </label>
                  ))}
                </div>
              }
            />
            <button
              onClick={() => handleExport()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2C645B] rounded-lg hover:bg-[#2C645B]/90"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex gap-4 px-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('visual')}
                className={`py-4 px-2 text-sm font-medium border-b-2 ${
                  activeTab === 'visual'
                    ? 'border-[#2C645B] text-[#2C645B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`py-4 px-2 text-sm font-medium border-b-2 ${
                  activeTab === 'table'
                    ? 'border-[#2C645B] text-[#2C645B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Table2 size={16} />
                  Detailed Logs
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'visual' ? (
              <div className="space-y-6">
                {/* Summary Metrics */}
                <div className="grid grid-cols-4 gap-6">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-500">{metric.label}</p>
                        <div className={`flex items-center gap-1 text-sm ${
                          metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                          {Math.abs(Number(metric.change))}%
                        </div>
                      </div>
                      <p className="text-2xl font-semibold mt-2">
                        {metric.value}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          {metric.unit}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Generation Trend */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Generation Trend</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generationTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="actual" stroke="#2C645B" name="Actual" />
                          <Line type="monotone" dataKey="forecast" stroke="#94A3B8" name="Forecast" strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Source Distribution */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Source Distribution</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sourceDistributionData}
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {sourceDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend />
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Efficiency Comparison */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Efficiency by Source</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={efficiencyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="efficiency" fill="#2C645B" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Alerts and Annotations */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Recent Events</h3>
                    <div className="space-y-4">
                      {alerts.map((alert, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <AlertCircle size={20} className={
                            alert.type === 'warning' ? 'text-yellow-500' : 
                            alert.type === 'error' ? 'text-red-500' : 
                            'text-blue-500'
                          } />
                          <div>
                            <p className="text-sm font-medium">{alert.title}</p>
                            <p className="text-sm text-gray-500">{alert.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{alert.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (MW)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solar (MW)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind (MW)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conventional (MW)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewable %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData
                      .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                      .map((data, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(data.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {data.totalGeneration.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.solarGeneration.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.windGeneration.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.conventionalGeneration.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.renewableContribution}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `${data.efficiencyScore}%` }}
                                />
                              </div>
                              <span className="ml-2 text-sm text-gray-900">
                                {data.efficiencyScore}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={(page + 1) * rowsPerPage >= filteredData.length}
                      className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 