'use client'
import { useState, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineProps, Label
} from 'recharts';
import DatePicker from 'react-datepicker';
import { Popover } from '@/app/components/Popover';
import { Download, Settings, AlertCircle, BarChart3, Table2, Filter, Share2 } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

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

  const [generationData] = useState<GenerationData[]>([
    {
      timestamp: '2024-03-15 14:00',
      totalGeneration: 2800,
      solarGeneration: 800,
      windGeneration: 600,
      conventionalGeneration: 1400,
      renewableContribution: 50,
      efficiencyScore: 92,
      hasAnomaly: false
    },
    // Add more sample data here
  ]);

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
      description: "Total power generated across all sources"
    },
    {
      label: "Renewable Share",
      value: "18.5%",
      change: "2.1% from last period",
      trend: "up" as const,
      description: "Percentage of power from renewable sources"
    },
    {
      label: "Efficiency",
      value: "92.4%",
      change: "0.5% from last period",
      trend: "up" as const,
      description: "Overall generation efficiency"
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

  const handleExport = async (format: string) => {
    // Implementation for export functionality
  };

  const energySources = [
    { label: 'Solar', value: 'solar' },
    { label: 'Wind', value: 'wind' },
    { label: 'Conventional', value: 'conventional' }
  ];

  const handlePieClick = useCallback((data: any) => {
    setSelectedPieSection(selectedPieSection === data.name ? null : data.name);
  }, [selectedPieSection]);

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
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2C645B] rounded-lg hover:bg-[#2C645B]/90"
            >
              <Download size={16} />
              Export
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
                  Visual Analysis
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
                  Data Tables
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'visual' ? (
              <div className="space-y-6">
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Time Series Chart */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Generation Trends</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generationData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="solarGeneration" stroke="#8884d8" name="Solar" />
                          <Line type="monotone" dataKey="windGeneration" stroke="#82ca9d" name="Wind" />
                          <Line type="monotone" dataKey="conventionalGeneration" stroke="#ffc658" name="Conventional" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Enhanced Donut Chart */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Energy Distribution</h3>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Share View">
                          <Share2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Download Data">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            onClick={handlePieClick}
                            cursor="pointer"
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name] || '#000000'}
                                opacity={selectedPieSection && selectedPieSection !== entry.name ? 0.5 : 1}
                              />
                            ))}
                            <Label content={<CustomizedLabel />} position="center" />
                          </Pie>
                          <RechartsTooltip content={<CustomPieTooltip />} />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            content={({ payload }) => (
                              <div className="flex justify-center gap-6 mt-4">
                                {payload?.map((entry: any) => (
                                  <div
                                    key={entry.value}
                                    className={`flex items-center gap-2 cursor-pointer
                                      ${selectedPieSection && selectedPieSection !== entry.value ? 'opacity-50' : ''}`}
                                    onClick={() => handlePieClick({ name: entry.value })}
                                  >
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm">{entry.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Enhanced Table View */}
                <div className="bg-white rounded-lg shadow-sm mt-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Detailed Generation Data</h3>
                      <div className="flex items-center gap-4">
                        <select 
                          className="text-sm border rounded-lg px-2 py-1"
                          value={rowsPerPage}
                          onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        >
                          <option value={10}>10 rows</option>
                          <option value={25}>25 rows</option>
                          <option value={50}>50 rows</option>
                        </select>
                        <button
                          onClick={() => handleExport('csv')}
                          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <Download size={16} />
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Time', 'Total (MW)', 'Solar (MW)', 'Wind (MW)', 'Conventional (MW)', 'Renewable %', 'Efficiency'].map((header) => (
                            <th
                              key={header}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {generationData
                          .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                          .map((data, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(new Date(data.timestamp), 'MMM dd, HH:mm')}
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
                  </div>
                  {/* Pagination */}
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={(page + 1) * rowsPerPage >= generationData.length}
                        className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{' '}
                          <span className="font-medium">{page * rowsPerPage + 1}</span>
                          {' '}-{' '}
                          <span className="font-medium">
                            {Math.min((page + 1) * rowsPerPage, generationData.length)}
                          </span>
                          {' '}of{' '}
                          <span className="font-medium">{generationData.length}</span>
                          {' '}results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {/* Add pagination buttons here */}
                        </nav>
                      </div>
                    </div>
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