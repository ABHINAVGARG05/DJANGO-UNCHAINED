import React from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { ZoneCard } from './ZoneCards';

const RightSidebar = () => {
  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-white border-l overflow-y-auto 
      transform transition-transform duration-300 ease-in-out
      lg:translate-x-0 
      translate-x-full">
      {/* Zone Search Header */}
      <div className="sticky top-0 bg-white border-b p-4">
        <div className="flex items-center gap-2 mb-3">
          <ChevronLeft className="h-5 w-5 text-black" />
          <h2 className="font-medium text-black">Zones</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-8 pr-4 py-1 text-sm border rounded-md"
          />
        </div>
      </div>

      {/* Zone Cards */}
      <div className="p-4 space-y-4">
        <ZoneCard 
          zone={{
            number: 1,
            status: 'STABLE',
            powerDemand: 200,
            powerSupply: 200,
            renewablePercentage: 7.5,
            region: 'KT Power Region'
          }}
        />

        <ZoneCard
          zone={{
            number: 2,
            status: 'CRITICAL',
            powerDemand: 180,
            powerSupply: 150,
            renewablePercentage: 5.2,
            region: 'KT Power Region'
          }}
        />
      </div>
    </aside>
  );
};

export default RightSidebar; 