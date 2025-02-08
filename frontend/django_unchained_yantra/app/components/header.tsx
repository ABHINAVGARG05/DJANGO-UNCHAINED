import React from 'react';
import { RefreshCcw } from 'lucide-react';


const Header = () => {

  return (
    <header className="bg-[#F0F7F5] rounded-lg shadow-sm mb-6">
      <div className="px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">Chennai Map</h1>
            <p className="text-sm text-gray-500">Real-time power distribution monitoring</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-mono font-medium text-white bg-[#2C645B] rounded-lg hover:bg-[#2C645B]/90 transition-colors">
            <RefreshCcw size={16}  />
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;