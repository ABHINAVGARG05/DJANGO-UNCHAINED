'use client'
import { useState } from 'react';
import { X, ChevronDown, Search, PlusSquare } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WardModalProps {
  wardId: string;
  wardName: string;
  onCloseAction: () => void;
  availableWards: Array<{ id: string; name: string }>;
}

interface ForecastData {
  timestamp: string;
  forecastedSupply: number;
  forecastedDemand: number;
  renewableEnergy: number;
}

interface Outage {
  id: string;
  startTime: string;
  endTime: string | null;
  status: 'ongoing' | 'resolved' | 'scheduled';
  type: 'emergency' | 'maintenance' | 'equipment-failure';
  affectedArea: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface ComparisonModalProps {
  onClose: () => void;
  availableWards: Array<{ id: string; name: string }>;
  baseWardId: string;
  baseWardName: string;
}

// Move getWardData before ComparisonModal
const getWardData = (wardId: string) => {
  const multiplier = parseInt(wardId.split('-')[1]) || 1;
  
  return {
    powerConsumption: [
      { month: 'January', value: 500 * multiplier },
      { month: 'February', value: 300 * multiplier },
      { month: 'March', value: 200 * multiplier },
      { month: 'April', value: 100 * multiplier },
      { month: 'May', value: 500 * multiplier },
      { month: 'June', value: 200 * multiplier },
      { month: 'July', value: 500 * multiplier }
    ],
    supplyDemand: [
      { date: 'Jan 11', supply: 1000 * multiplier, demand: 200 * multiplier },
      { date: 'Jan 12', supply: 800 * multiplier, demand: 100 * multiplier },
      { date: 'Jan 13', supply: 1000 * multiplier, demand: 800 * multiplier },
      { date: 'Jan 14', supply: 800 * multiplier, demand: 600 * multiplier },
      { date: 'Jan 15', supply: 400 * multiplier, demand: 200 * multiplier },
      { date: 'Jan 16', supply: 200 * multiplier, demand: 100 * multiplier },
      { date: 'Jan 17', supply: 200 * multiplier, demand: 100 * multiplier }
    ],
    powerSources: [
      { date: 'Jan 11', renewable: 500 * multiplier, conventional: 600 * multiplier },
      { date: 'Jan 12', renewable: 400 * multiplier, conventional: 500 * multiplier },
      { date: 'Jan 13', renewable: 300 * multiplier, conventional: 200 * multiplier },
      { date: 'Jan 14', renewable: 200 * multiplier, conventional: 500 * multiplier },
      { date: 'Jan 15', renewable: 600 * multiplier, conventional: 100 * multiplier },
      { date: 'Jan 16', renewable: 500 * multiplier, conventional: 400 * multiplier },
      { date: 'Jan 17', renewable: 200 * multiplier, conventional: 300 * multiplier }
    ]
  };
};

function ComparisonModal({ onClose, availableWards, baseWardId, baseWardName }: ComparisonModalProps) {
  const [comparisonWards, setComparisonWards] = useState<string[]>([]);
  const baseWardData = getWardData(baseWardId);

  const handleAddWard = (wardId: string) => {
    setComparisonWards([...comparisonWards, wardId]);
  };

  const handleRemoveWard = (wardId: string) => {
    setComparisonWards(comparisonWards.filter(id => id !== wardId));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Ward Comparison</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Ward Selection Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">Compare with:</span>
            <div className="flex gap-2">
              {availableWards
                .filter(ward => !comparisonWards.includes(ward.id) && ward.id !== baseWardId)
                .map(ward => (
                  <button
                    key={ward.id}
                    onClick={() => handleAddWard(ward.id)}
                    className="flex items-center gap-2 px-3 py-1 border rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-sm">{ward.name}</span>
                    <PlusSquare className="text-gray-400" size={16} />
                  </button>
                ))}
            </div>
          </div>
          
          {/* Selected Wards Tags */}
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-[var(--primary-light)] text-[var(--primary-dark)] rounded-full">
              <span className="text-sm">{baseWardName} (Current)</span>
            </div>
            {comparisonWards.map(wardId => {
              const ward = availableWards.find(w => w.id === wardId);
              return ward ? (
                <div key={ward.id} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <span className="text-sm">{ward.name}</span>
                  <button
                    onClick={() => handleRemoveWard(ward.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Comparison Charts */}
        <div className="space-y-6">
          {/* Power Consumption Chart */}
          <div className="h-[300px]">
            <h3 className="text-sm font-medium mb-4">POWER CONSUMPTION</h3>
            <ResponsiveContainer>
              <LineChart data={baseWardData.powerConsumption}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name={baseWardName}
                  stroke="var(--primary-main)" 
                />
                {comparisonWards.map((wardId, index) => {
                  const ward = availableWards.find(w => w.id === wardId);
                  const wardData = ward ? getWardData(ward.id) : null;
                  return wardData ? (
                    <Line
                      key={wardId}
                      type="monotone"
                      dataKey="value"
                      name={ward?.name || 'Unknown'}
                      stroke={`var(--comparison-${index + 1})`}
                      data={wardData.powerConsumption}
                    />
                  ) : null;
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Supply vs Demand Chart */}
          <div className="h-[300px]">
            <h3 className="text-sm font-medium mb-4">SUPPLY VS DEMAND</h3>
            <ResponsiveContainer>
              <LineChart data={baseWardData.supplyDemand}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="supply" 
                  name={`${baseWardName} Supply`}
                  stroke="var(--primary-main)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="demand" 
                  name={`${baseWardName} Demand`}
                  stroke="var(--error)" 
                />
                {comparisonWards.map((wardId, index) => {
                  const ward = availableWards.find(w => w.id === wardId);
                  const wardData = ward ? getWardData(ward.id) : null;
                  return ward && wardData ? (
                    <>
                      <Line
                        key={`${wardId}-supply`}
                        type="monotone"
                        dataKey="supply"
                        name={`${ward.name} Supply`}
                        stroke={`var(--comparison-${index + 1})`}
                        data={wardData.supplyDemand}
                      />
                      <Line
                        key={`${wardId}-demand`}
                        type="monotone"
                        dataKey="demand"
                        name={`${ward.name} Demand`}
                        stroke={`var(--comparison-${index + 1})`}
                        strokeDasharray="3 3"
                        data={wardData.supplyDemand}
                      />
                    </>
                  ) : null;
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Power Sources Chart */}
          <div className="h-[300px]">
            <h3 className="text-sm font-medium mb-4">POWER SOURCES</h3>
            <ResponsiveContainer>
              <BarChart data={[
                ...baseWardData.powerSources,
                ...(comparisonWards.flatMap(wardId => {
                  const ward = availableWards.find(w => w.id === wardId);
                  const wardData = ward ? getWardData(ward.id) : null;
                  return wardData ? wardData.powerSources.map(d => ({
                    ...d,
                    [`${ward?.name || 'Unknown'} Renewable`]: d.renewable,
                    [`${ward?.name || 'Unknown'} Conventional`]: d.conventional
                  })) : [];
                }))
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="renewable" 
                  name={`${baseWardName} Renewable`}
                  fill="var(--success)" 
                />
                <Bar 
                  dataKey="conventional" 
                  name={`${baseWardName} Conventional`}
                  fill="var(--primary-main)" 
                />
                {comparisonWards.map((wardId, index) => {
                  const ward = availableWards.find(w => w.id === wardId);
                  return ward ? (
                    <>
                      <Bar
                        key={`${wardId}-renewable`}
                        dataKey={`${ward?.name || 'Unknown'} Renewable`}
                        fill={`var(--comparison-${index + 1})`}
                        opacity={0.8}
                      />
                      <Bar
                        key={`${wardId}-conventional`}
                        dataKey={`${ward?.name || 'Unknown'} Conventional`}
                        fill={`var(--comparison-${index + 1})`}
                        opacity={0.4}
                      />
                    </>
                  ) : null;
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WardModal({ wardId, wardName, onCloseAction, availableWards }: WardModalProps) {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const currentWardData = getWardData(wardId);

  // AI optimized data
  const optimizedConsumptionData = [
    { month: 'January', value: -300, optimized: -100 },
    { month: 'February', value: -300, optimized: -50 },
    { month: 'March', value: 200, optimized: 400 },
    { month: 'April', value: 100, optimized: 300 },
    { month: 'May', value: 500, optimized: 700 },
    { month: 'June', value: -200, optimized: 100 },
    { month: 'July', value: -500, optimized: -200 }
  ];

  const supplyDemandData = [
    { date: 'Jan 11', supply: -1000, demand: -200, optimizedSupply: -500, optimizedDemand: -100 },
    { date: 'Jan 12', supply: -800, demand: -100, optimizedSupply: -400, optimizedDemand: -50 },
    { date: 'Jan 13', supply: 1000, demand: 800, optimizedSupply: 1200, optimizedDemand: 700 },
    { date: 'Jan 14', supply: 800, demand: 600, optimizedSupply: 1000, optimizedDemand: 500 },
    { date: 'Jan 15', supply: -400, demand: 200, optimizedSupply: 200, optimizedDemand: 100 },
    { date: 'Jan 16', supply: 200, demand: 100, optimizedSupply: 400, optimizedDemand: 50 },
    { date: 'Jan 17', supply: -200, demand: -100, optimizedSupply: 100, optimizedDemand: -50 }
  ];

  const powerSourcesData = [
    { date: 'Jan 11', renewable: 500, conventional: 600, optimizedRenewable: 800, optimizedConventional: 300 },
    { date: 'Jan 12', renewable: 400, conventional: 500, optimizedRenewable: 700, optimizedConventional: 200 },
    { date: 'Jan 13', renewable: 300, conventional: 200, optimizedRenewable: 600, optimizedConventional: 100 },
    { date: 'Jan 14', renewable: 200, conventional: 500, optimizedRenewable: 500, optimizedConventional: 200 },
    { date: 'Jan 15', renewable: 600, conventional: 100, optimizedRenewable: 800, optimizedConventional: 50 },
    { date: 'Jan 16', renewable: 500, conventional: 400, optimizedRenewable: 700, optimizedConventional: 200 },
    { date: 'Jan 17', renewable: 200, conventional: 300, optimizedRenewable: 500, optimizedConventional: 100 }
  ];

  const stackedSourcesData = [
    { month: 'January', green: -500, conventional: -1000 },
    { month: 'February', green: 300, conventional: 1500 },
    { month: 'March', green: 200, conventional: 1800 },
    { month: 'April', green: -200, conventional: 1200 },
    { month: 'May', green: 800, conventional: 300 },
    { month: 'June', green: 400, conventional: -800 }
  ];

  // Dummy forecast data
  const forecastData: ForecastData[] = Array.from({ length: 100 }, (_, i) => ({
    timestamp: new Date(Date.now() + i * 86400000).toLocaleString(),
    forecastedSupply: Math.floor(Math.random() * 1000) + 500,
    forecastedDemand: Math.floor(Math.random() * 800) + 400,
    renewableEnergy: Math.floor(Math.random() * 60) + 20,
  }));

  // Filter and search logic
  const filteredData = forecastData.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Dummy outages data
  const outages: Outage[] = [
    {
      id: 'OUT-001',
      startTime: '2024-02-20 08:30:00',
      endTime: null,
      status: 'ongoing',
      type: 'equipment-failure',
      affectedArea: 'Block A',
      description: 'Transformer malfunction causing power fluctuations',
      impact: 'high'
    },
    {
      id: 'OUT-002',
      startTime: '2024-02-19 14:00:00',
      endTime: '2024-02-19 16:30:00',
      status: 'resolved',
      type: 'maintenance',
      affectedArea: 'Block C',
      description: 'Scheduled maintenance of power lines',
      impact: 'medium'
    },
    // Add more dummy data as needed
  ];

  const getStatusColor = (status: Outage['status']) => {
    switch (status) {
      case 'ongoing':
        return 'bg-[var(--error)]/10 text-[var(--error)]';
      case 'resolved':
        return 'bg-[var(--success)]/10 text-[var(--success)]';
      case 'scheduled':
        return 'bg-[var(--warning)]/10 text-[var(--warning)]';
    }
  };

  const getImpactColor = (impact: Outage['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-[var(--error)]';
      case 'medium':
        return 'text-[var(--warning)]';
      case 'low':
        return 'text-[var(--success)]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto relative">
        {/* Header with working close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{wardName}</h2>
          <button 
            onClick={onCloseAction}  // Make sure this is connected
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-8 px-6">
            {['Overview', 'Power Forecasting', 'Outages'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 relative ${
                  activeTab === tab.toLowerCase() ? 'text-[var(--primary-dark)]' : 'text-gray-500'
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-dark)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* AI Toggle */}
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm">
                  <div className="relative inline-block w-10 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={showAIRecommendations}
                      onChange={(e) => setShowAIRecommendations(e.target.checked)}
                    />
                    <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
                      showAIRecommendations ? 'translate-x-4 bg-[var(--primary-dark)]' : 'bg-gray-400'
                    }`} />
                  </div>
                  View AI Recommendations
                </label>
              </div>

              {/* AI Recommendations Box */}
              {showAIRecommendations && (
                <div className="bg-[var(--primary-light)] p-4 rounded-lg text-sm text-[var(--primary-dark)]">
                  <p className="font-medium mb-2">AI Recommendations</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Shift peak load times to 10 AM - 4 PM for optimal solar utilization</li>
                    <li>Increase renewable energy usage by 30% during high demand periods</li>
                    <li>Implement smart grid controls to reduce power wastage by 25%</li>
                    <li>Schedule maintenance during low demand periods</li>
                  </ul>
                </div>
              )}

              {/* Comparison Section */}
              <div className="mb-6 flex items-center gap-2">
                <button
                  onClick={() => setShowComparisonModal(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <PlusSquare size={16} />
                  Add Ward for Comparison
                </button>
              </div>

              {/* Charts */}
              <div className="space-y-6">
                {/* Power Consumption Chart */}
                <div className="h-[300px]">
                  <h3 className="text-sm font-medium mb-4">POWER CONSUMPTION</h3>
                  <ResponsiveContainer>
                    <LineChart data={currentWardData.powerConsumption}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        name={wardName}
                        stroke="var(--primary-main)" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Supply vs Demand Chart */}
                <div className="h-[300px]">
                  <h3 className="text-sm font-medium mb-4">SUPPLY VS DEMAND</h3>
                  <ResponsiveContainer>
                    <LineChart data={currentWardData.supplyDemand}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="supply" 
                        name={`${wardName} Supply`}
                        stroke="var(--primary-main)" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="demand" 
                        name={`${wardName} Demand`}
                        stroke="var(--error)" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Power Sources Chart */}
                <div className="h-[300px]">
                  <h3 className="text-sm font-medium mb-4">POWER SOURCES</h3>
                  <ResponsiveContainer>
                    <BarChart data={[
                      ...currentWardData.powerSources,
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="renewable" 
                        name={`${wardName} Renewable`}
                        fill="var(--success)" 
                      />
                      <Bar 
                        dataKey="conventional" 
                        name={`${wardName} Conventional`}
                        fill="var(--primary-main)" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {activeTab === 'power forecasting' && (
            <div className="space-y-4">
              {/* Filters and Search */}
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2">
                  {['daily', 'weekly', 'monthly'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter as any)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        timeFilter === filter
                          ? 'bg-[var(--primary-dark)] text-white'
                          : 'border border-[var(--primary-dark)]/20 text-[var(--primary-dark)] hover:bg-[var(--primary-light)]'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1 maxw-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search forecasts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-dark)]/20"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Forecasted Supply (KW)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Forecasted Demand (KW)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Renewable Energy (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.forecastedSupply.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.forecastedDemand.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.renewableEnergy}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t">
                  <div className="flex-1 flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of{' '}
                      {filteredData.length} results
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outages' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="card bg-[var(--error)]/5">
                  <h4 className="text-sm font-medium text-[var(--error)]">Active Outages</h4>
                  <p className="text-2xl font-semibold mt-2">
                    {outages.filter(o => o.status === 'ongoing').length}
                  </p>
                </div>
                <div className="card bg-[var(--warning)]/5">
                  <h4 className="text-sm font-medium text-[var(--warning)]">Scheduled Maintenance</h4>
                  <p className="text-2xl font-semibold mt-2">
                    {outages.filter(o => o.status === 'scheduled').length}
                  </p>
                </div>
                <div className="card bg-[var(--success)]/5">
                  <h4 className="text-sm font-medium text-[var(--success)]">Resolved Today</h4>
                  <p className="text-2xl font-semibold mt-2">
                    {outages.filter(o => o.status === 'resolved').length}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="border rounded-lg p-6 space-y-6">
                <h3 className="font-medium">Outage Timeline</h3>
                <div className="space-y-6">
                  {outages.map((outage) => (
                    <div key={outage.id} className="relative pl-6 border-l-2 border-gray-200">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[var(--primary-dark)]" />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {outage.id} - {outage.affectedArea}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(outage.status)}`}>
                            {outage.status.charAt(0).toUpperCase() + outage.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{outage.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Started: {new Date(outage.startTime).toLocaleString()}</span>
                          {outage.endTime && (
                            <span>Ended: {new Date(outage.endTime).toLocaleString()}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className={`font-medium ${getImpactColor(outage.impact)}`}>
                            {outage.impact.charAt(0).toUpperCase() + outage.impact.slice(1)} Impact
                          </span>
                          <span className="text-gray-500">
                            Type: {outage.type.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-4">
                <button className="btn-primary">
                  Report New Outage
                </button>
                <button className="btn-secondary">
                  Schedule Maintenance
                </button>
              </div>
            </div>
          )}
        </div>

        {showComparisonModal && (
          <ComparisonModal
            onClose={() => setShowComparisonModal(false)}
            availableWards={availableWards}
            baseWardId={wardId}
            baseWardName={wardName}
          />
        )}
      </div>
    </div>
  );
} 