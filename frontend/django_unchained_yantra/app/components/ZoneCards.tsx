import React from 'react';

interface Zone {
  number: number;
  status: 'STABLE' | 'CRITICAL';
  powerDemand?: number;
  powerSupply?: number;
  renewablePercentage?: number;
  region?: string;
}

const ZoneCard = ({ zone }: { zone: Zone }) => {

  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm md:text-base text-gray-800">Zone {zone.number}</h3>
          <p className="text-xs text-gray-500">{zone.region || 'KT Power Region'}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-mono font-medium ${
          status === 'STABLE' 
            ? 'bg-[#5CA688]/10 text-[#5CA688]' 
            : 'bg-[#FC7854]/10 text-[#FC7854]'
        }`}>
          {zone.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Power Demand</p>
            <p className="font-medium text-sm">{zone.powerDemand || 200}MW</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Power Supply</p>
            <p className="font-medium text-sm">{zone.powerSupply || 200}MW</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Renewable Energy</span>
            <span className="font-medium">{zone.renewablePercentage || 7.3}%</span>
          </div>
          <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${zone.renewablePercentage || 7.3}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ZoneList = () => {
  const zones: Zone[] = [
    { number: 1, status: 'STABLE' },
    { number: 2, status: 'CRITICAL' },
    { number: 3, status: 'CRITICAL' },
    { number: 4, status: 'STABLE' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-3 md:p-4 border-b">
        <h2 className="font-medium text-sm md:text-base">Zones</h2>
        <div className="mt-2 relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm border rounded-md"
          />
        </div>
      </div>
      <div>
        {zones.map((zone) => (
          <ZoneCard key={zone.number} zone={zone} />
        ))}
      </div>
    </div>
  );
};

export default ZoneList;

export { ZoneCard };