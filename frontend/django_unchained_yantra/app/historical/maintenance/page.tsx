'use client'
import { useState } from 'react';
import { 
  Search, Download, Plus, Calendar, Filter,
  BarChart3, Table2, ChevronDown, AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface MaintenanceRecord {
  id: string;
  date: string;
  equipmentName: string;
  equipmentType: string;
  maintenanceType: 'Routine' | 'Emergency' | 'Upgrade';
  status: 'Completed' | 'Pending' | 'In Progress';
  technician: string;
  issueResolved: boolean;
  description: string;
}

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(25);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Generate dummy data
  const generateDummyData = (): MaintenanceRecord[] => {
    const types = ['Routine', 'Emergency', 'Upgrade'];
    const equipment = ['Transformer A1', 'Solar Panel B2', 'Wind Turbine C3', 'Generator D4'];
    const equipmentTypes = ['Transformer', 'Solar Panel', 'Wind Turbine', 'Generator'];
    const technicians = ['John Smith', 'Emma Wilson', 'Michael Brown'];
    const data: MaintenanceRecord[] = [];

    for (let i = 0; i < 50; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        id: `MAINT-${1000 + i}`,
        date: date.toISOString(),
        equipmentName: equipment[Math.floor(Math.random() * equipment.length)],
        equipmentType: equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)],
        maintenanceType: types[Math.floor(Math.random() * types.length)] as MaintenanceRecord['maintenanceType'],
        status: ['Completed', 'Pending', 'In Progress'][Math.floor(Math.random() * 3)] as MaintenanceRecord['status'],
        technician: technicians[Math.floor(Math.random() * technicians.length)],
        issueResolved: Math.random() > 0.3,
        description: 'Routine maintenance and inspection of equipment.'
      });
    }
    return data;
  };

  const [maintenanceData] = useState<MaintenanceRecord[]>(generateDummyData());

  const handleExport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Maintenance Records Report', 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    const tableData = filteredData.map(record => [
      new Date(record.date).toLocaleDateString(),
      record.equipmentName,
      record.maintenanceType,
      record.status,
      record.technician,
      record.issueResolved ? 'Yes' : 'No'
    ]);

    (doc as any).autoTable({
      startY: 40,
      head: [['Date', 'Equipment', 'Type', 'Status', 'Technician', 'Resolved']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [44, 100, 91] }
    });

    doc.save('maintenance-records.pdf');
  };

  const filteredData = maintenanceData.filter(record => {
    const searchStr = searchQuery.toLowerCase();
    return (
      record.equipmentName.toLowerCase().includes(searchStr) ||
      record.equipmentType.toLowerCase().includes(searchStr) ||
      record.maintenanceType.toLowerCase().includes(searchStr) ||
      record.status.toLowerCase().includes(searchStr) ||
      record.technician.toLowerCase().includes(searchStr) ||
      new Date(record.date).toLocaleDateString().toLowerCase().includes(searchStr)
    );
  });

  const getStatusColor = (status: MaintenanceRecord['status']) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Records</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2C645B] text-white rounded-lg hover:bg-[#235048]"
        >
          <Plus size={16} />
          Schedule Maintenance
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'text-[#2C645B] border-b-2 border-[#2C645B]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'text-[#2C645B] border-b-2 border-[#2C645B]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Table2 size={16} />
              Detailed Logs
            </div>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
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
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            <Download size={16} onClick={handleExport} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((record) => (
                <tr
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.equipmentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.maintenanceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.technician}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.issueResolved ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
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
              disabled={(page + 1) * rowsPerPage >= filteredData.length}
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
                  {Math.min((page + 1) * rowsPerPage, filteredData.length)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{filteredData.length}</span>
                {' '}results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
                Maintenance Details
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Equipment:</strong> {selectedRecord.equipmentName}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Date:</strong> {new Date(selectedRecord.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Type:</strong> {selectedRecord.maintenanceType}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Status:</strong> {selectedRecord.status}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Technician:</strong> {selectedRecord.technician}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Description:</strong> {selectedRecord.description}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 