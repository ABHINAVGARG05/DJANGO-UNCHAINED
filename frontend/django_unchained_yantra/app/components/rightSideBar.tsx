'use client';

import { Dispatch, SetStateAction } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { PowerLocation, Ward } from './PowerStationMap';

interface Zone {
  name: string;
  coordinates: [number, number];
  status: 'operational' | 'warning' | 'critical';
  capacity: string;
  type: string;
  wards: Ward[];
  powerDemand?: number;
  powerSupply?: number;
  renewablePercentage?: number;
}

interface RightSidebarProps {
  selectedZone: PowerLocation | null;
  onZoneSelectAction: (zone: PowerLocation | null) => void;
  selectedWard: Ward | null;
  onWardSelectAction: (ward: Ward) => void;
  zones: PowerLocation[];
}

export default function RightSidebar(props: RightSidebarProps) {
  const { selectedZone, onZoneSelectAction, selectedWard, onWardSelectAction, zones } = props;
  
  if (!zones) return null;

  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-white border-l overflow-y-auto">
      {selectedZone ? (
        // Ward View
        <div>
          <div className="sticky top-0 bg-white border-b p-4">
            <button 
              onClick={() => onZoneSelectAction(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Zones</span>
            </button>
          </div>
          <div className="p-4 space-y-4">
            <h2 className="font-medium">{selectedZone.name} Wards</h2>
            {selectedZone.wards.map((ward) => (
              <div
                key={ward.id}
                onClick={() => onWardSelectAction(ward)}
                className="card cursor-pointer hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold mb-2">{ward.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-[var(--background)] rounded-lg">
                    <p className="text-xs text-gray-500">Demand</p>
                    <p className="font-medium text-sm">{ward.powerDemand} KW</p>
                  </div>
                  <div className="p-2 bg-[var(--background)] rounded-lg">
                    <p className="text-xs text-gray-500">Supply</p>
                    <p className="font-medium text-sm">{ward.powerSupply} KW</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Renewable</span>
                    <span className="text-xs font-medium">{ward.renewablePercentage}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--primary-main)] rounded-full"
                      style={{ width: `${ward.renewablePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Zones View
        <div>
          <div className="sticky top-0 bg-white border-b p-4">
            <h2 className="font-medium mb-3">Zones Overview</h2>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search zones..."
                className="w-full pl-8 pr-4 py-1 text-sm border rounded-md"
              />
            </div>
          </div>
          <div className="p-4 space-y-4">
            {(zones as PowerLocation[]).map((zone: PowerLocation) => (
              <div
                key={zone?.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedZone && selectedZone?.id === zone?.id
                    ? 'bg-[var(--primary-light)] text-[var(--primary-dark)]'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onZoneSelectAction(zone)}
              >
                <h3 className="text-lg font-semibold mb-2">{zone.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-[var(--background)] rounded-lg">
                    <p className="text-xs text-gray-500">Demand</p>
                    <p className="font-medium text-sm">{zone.powerDemand} KW</p>
                  </div>
                  <div className="p-2 bg-[var(--background)] rounded-lg">
                    <p className="text-xs text-gray-500">Supply</p>
                    <p className="font-medium text-sm">{zone.powerSupply} KW</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Renewable</span>
                    <span className="text-xs font-medium">{zone.renewablePercentage}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--primary-main)] rounded-full"
                      style={{ width: `${zone.renewablePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
} 