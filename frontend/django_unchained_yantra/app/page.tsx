'use client'
import { useState } from 'react';
import Sidebar from './components/sideBar';
import Header from './components/header';
import Navigation from './components/navigation';
import RightSidebar from './components/rightSideBar';
import WardModal from './components/WardModal';
import PowerStationMap from './components/PowerStationMap';
import { PowerLocation, Ward } from './components/PowerStationMap';

const powerLocations: PowerLocation[] = [
  {
    id: 'north',
    name: 'North Zone Station',
    coordinates: [80.2800, 13.1200],
    status: 'operational',
    capacity: '1200 MW',
    type: 'Zone Hub',
    powerDemand: 1100,
    powerSupply: 1200,
    renewablePercentage: 30,
    wards: [
      {
        id: 'north-ward-1',
        name: 'Residential District',
        status: 'operational',
        powerDemand: 250,
        powerSupply: 300,
        renewablePercentage: 35
      },
      {
        id: 'north-ward-2',
        name: 'Industrial Park',
        status: 'warning',
        powerDemand: 450,
        powerSupply: 400,
        renewablePercentage: 15
      },
      {
        id: 'north-ward-3',
        name: 'Tech Hub',
        status: 'operational',
        powerDemand: 350,
        powerSupply: 380,
        renewablePercentage: 40
      }
    ]
  },
  {
    id: 'south',
    name: 'South Zone Station',
    coordinates: [80.2700, 13.0500],
    status: 'warning',
    capacity: '800 MW',
    type: 'Zone Hub',
    powerDemand: 750,
    powerSupply: 800,
    renewablePercentage: 45,
    wards: [
      {
        id: 'south-ward-1',
        name: 'Commercial Center',
        status: 'operational',
        powerDemand: 200,
        powerSupply: 220,
        renewablePercentage: 50
      },
      {
        id: 'south-ward-2',
        name: 'Green Zone',
        status: 'operational',
        powerDemand: 150,
        powerSupply: 200,
        renewablePercentage: 80
      },
      {
        id: 'south-ward-3',
        name: 'Smart City',
        status: 'warning',
        powerDemand: 300,
        powerSupply: 280,
        renewablePercentage: 60
      }
    ]
  },
  {
    id: 'east',
    name: 'East Zone Station',
    coordinates: [80.3200, 13.1000],
    status: 'critical',
    capacity: '1000 MW',
    type: 'Zone Hub',
    powerDemand: 1100,
    powerSupply: 850,
    renewablePercentage: 20,
    wards: [
      {
        id: 'east-ward-1',
        name: 'Manufacturing Hub',
        status: 'critical',
        powerDemand: 400,
        powerSupply: 300,
        renewablePercentage: 10
      },
      {
        id: 'east-ward-2',
        name: 'Port Area',
        status: 'warning',
        powerDemand: 350,
        powerSupply: 320,
        renewablePercentage: 25
      },
      {
        id: 'east-ward-3',
        name: 'Logistics Park',
        status: 'operational',
        powerDemand: 250,
        powerSupply: 230,
        renewablePercentage: 30
      }
    ]
  },
  {
    id: 'west',
    name: 'West Zone Station',
    coordinates: [80.2300, 13.1100],
    status: 'operational',
    capacity: '900 MW',
    type: 'Zone Hub',
    powerDemand: 800,
    powerSupply: 900,
    renewablePercentage: 55,
    wards: [
      {
        id: 'west-ward-1',
        name: 'Education District',
        status: 'operational',
        powerDemand: 180,
        powerSupply: 200,
        renewablePercentage: 70
      },
      {
        id: 'west-ward-2',
        name: 'Healthcare Zone',
        status: 'operational',
        powerDemand: 220,
        powerSupply: 250,
        renewablePercentage: 45
      },
      {
        id: 'west-ward-3',
        name: 'Research Park',
        status: 'warning',
        powerDemand: 300,
        powerSupply: 280,
        renewablePercentage: 65
      }
    ]
  }
];

export default function ZoneDashboard() {
  const [selectedZone, setSelectedZone] = useState<PowerLocation | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [showWardModal, setShowWardModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar />
      <div className="flex-1 p-6 w-full md:ml-64 lg:mr-80 flex flex-col">
        <Navigation />
        <Header />
        
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6 relative">
          <PowerStationMap 
            powerLocations={powerLocations} 
            onZoneSelect={(zone) => setSelectedZone(zone)}
          />
        </div>
      </div>

      {showWardModal && selectedWard && (
        <WardModal
          wardId={selectedWard.id}
          wardName={selectedWard.name}
          onCloseAction={() => setShowWardModal(false)}
          availableWards={selectedZone?.wards || []}
        />
      )}

      <RightSidebar
        selectedZone={selectedZone}
        onZoneSelectAction={setSelectedZone}
        selectedWard={selectedWard}
        onWardSelectAction={(ward: Ward) => {
          setSelectedWard(ward);
          setShowWardModal(true);
        }}
        zones={powerLocations}
      />
    </div>
  );
}
