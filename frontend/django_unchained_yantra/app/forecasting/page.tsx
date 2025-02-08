'use client'
import React from 'react';
import Sidebar from '../components/sideBar';
import Header from '../components/header';
import Navigation from '../components/navigation';
import RightSidebar from '../components/rightSideBar';
import { BarChart3, Wind, Cloud, Factory } from 'lucide-react';

interface ForecastCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
}

const ForecastCard = ({ title, value, icon: Icon, trend }: ForecastCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-semibold mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${
        trend === 'up' ? 'bg-[#FC7854]/10' : 'bg-[#5CA688]/10'
      }`}>
        <Icon className={
          trend === 'up' ? 'text-[#FC7854]' : 'text-[#5CA688]'
        } size={20} />
      </div>
    </div>
    <div className="mt-2">
      <span className={`text-xs font-medium ${trend === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>
        {trend === 'up' ? '↑ 3.5%' : '↓ 2.1%'} from previous day
      </span>
    </div>
  </div>
);

const PowerForecasting = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar/>
      <div className="flex-1 p-6 w-full md:ml-64 lg:mr-80">
        <Navigation/>
        <Header/>

        {/* Forecast Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ForecastCard 
            title="Predicted Demand"
            value="2,450 MW"
            icon={BarChart3}
            trend="up"
          />
          <ForecastCard 
            title="Wind Generation"
            value="320 MW"
            icon={Wind}
            trend="down"
          />
          <ForecastCard 
            title="Solar Generation"
            value="580 MW"
            icon={Cloud}
            trend="up"
          />
          <ForecastCard 
            title="Conventional Source"
            value="1000MW"
            icon={Factory}
            trend="up"
          />
        </div>

        {/* Map with Forecast Overlay */}
        <div className="w-full h-[calc(100vh-18rem)] bg-white rounded-lg shadow-sm relative overflow-hidden">
          <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
            Map with Power Forecast Overlay
          </div>

          {/* Forecast Controls */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-4 rounded-lg shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-800">Forecast Timeline</h3>
                <div className="flex gap-3">
                  <button className="px-3 py-1 text-sm bg-[#2C645B]/10 text-[#2C645B] rounded-full font-mono font-medium">24h</button>
                  <button className="px-3 py-1 text-sm text-gray-500 rounded-full hover:bg-gray-50">48h</button>
                  <button className="px-3 py-1 text-sm text-gray-500 rounded-full hover:bg-gray-50">72h</button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600" />
                  <span className="text-sm text-gray-600">Show Heatmap</span>
                </label>
                <button className="px-4 py-1.5 text-sm font-mono font-medium text-white bg-[#2C645B] rounded-lg hover:bg-[#2C645B]/90">
                  Update Forecast
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RightSidebar />
    </div>
  );
};

export default PowerForecasting; 