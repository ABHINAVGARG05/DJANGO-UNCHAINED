'use client'
import Sidebar from './components/sideBar';
import Header from './components/header';
import Navigation from './components/navigation';
import RightSidebar from './components/rightSideBar';

const ZoneDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar />
      <div className="flex-1 p-6 w-full md:ml-64 lg:mr-80 flex flex-col">
        <Navigation />
        <Header />
        {/* Map Container */}
        <div className="flex-1 bg-white rounded-lg shadow-sm relative overflow-hidden">
          {/* Map Component */}
          <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-500">Map idhar lagana hai</span>
          </div>

          {/* Filters*/}
          <div className="absolute top-4 right-4 bg-white/95 p-4 rounded-lg shadow-lg backdrop-blur-sm">
            <h2 className="font-medium mb-4 text-gray-800">Map Filters</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">Sufficient Power</span>
                <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200"></div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">Warning</span>
                <div className="w-4 h-4 rounded bg-orange-100 border border-orange-200"></div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">Critical</span>
                <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Content Grid*/}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"> */}
          {/* Sample Content */}
          {/* <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800">Content 1</h3>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800">Content 2</h3>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800">Content 3</h3>
          </div>
        </div>*/}
      </div> 

      <RightSidebar />
    </div>
  );
};

export default ZoneDashboard;
