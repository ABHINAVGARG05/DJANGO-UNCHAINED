'use client';

import { useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';

export interface Ward {
  id: string;
  name: string;
  status: string;
  powerDemand: number;
  powerSupply: number;
  renewablePercentage: number;
}

export interface PowerLocation {
  name: string;
  coordinates: [number, number];
  status: 'operational' | 'warning' | 'critical';
  capacity: string;
  type: string;
  wards: Ward[];
  powerDemand: number;
  powerSupply: number;
  renewablePercentage: number;
}

interface PowerStationMapProps {
  powerLocations: PowerLocation[];
  onZoneSelect: (zone: PowerLocation) => void;
}

const PowerStationMap = ({ powerLocations, onZoneSelect }: PowerStationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([80.2707, 13.0827]),
        zoom: 12,
        minZoom: 10,
        maxZoom: 15,
      }),
    });

    const vectorSource = new VectorSource();

    powerLocations.forEach((loc) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(loc.coordinates)),
        ...loc, // Spread all location properties
      });

      const markerColor = loc.status === 'operational' ? '#10B981' :
                         loc.status === 'warning' ? '#F59E0B' : '#EF4444';

      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: markerColor }),
            stroke: new Stroke({ color: '#ffffff', width: 2 }),
          }),
        })
      );

      vectorSource.addFeature(feature);
    });

    const markerLayer = new VectorLayer({
      source: vectorSource,
      zIndex: 1,
    });
    map.addLayer(markerLayer);

    const popupOverlay = new Overlay({
      element: popupRef.current,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10],
    });
    map.addOverlay(popupOverlay);
    overlayRef.current = popupOverlay;

    // Pointer cursor on hover
    map.on('pointermove', (event) => {
      const pixel = map.getEventPixel(event.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      if (map.getTarget() && typeof map.getTarget() === 'object') {
        (map.getTarget() as HTMLElement).style.cursor = hit ? 'pointer' : '';
      }
    });

    map.on('click', (event) => {
      const clickedFeature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (clickedFeature) {
        const coordinates = (clickedFeature.getGeometry() as Point).getCoordinates();
        const properties = clickedFeature.getProperties();

        const clickedZone = powerLocations.find(loc => loc.name === properties.name);
        if (clickedZone) {
          onZoneSelect(clickedZone);
        }

        const popupContent = `
          <div class='p-3'>
            <h3 class='font-medium text-gray-900 mb-2'>${properties.name}</h3>
            <div class='space-y-1.5'>
              <p class='text-sm'>
                <span class='text-gray-500'>Status:</span> 
                <span class='font-medium ${
                  properties.status === 'operational' ? 'text-green-600' :
                  properties.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }'>${properties.status}</span>
              </p>
              <p class='text-sm'>
                <span class='text-gray-500'>Capacity:</span> 
                <span class='font-medium'>${properties.capacity}</span>
              </p>
              <p class='text-sm'>
                <span class='text-gray-500'>Type:</span> 
                <span class='font-medium'>${properties.type}</span>
              </p>
            </div>
          </div>
        `;

        if (popupRef.current) {
          popupRef.current.innerHTML = popupContent;
          popupRef.current.style.display = 'block';
          popupOverlay.setPosition(coordinates);
        }
      } else if (popupRef.current) {
        popupRef.current.style.display = 'none';
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [powerLocations, onZoneSelect]);

  return (
    <div className='relative w-full h-full'>
      <div ref={mapRef} className='w-full h-full rounded-lg' />
      <div 
        ref={popupRef} 
        className='absolute bg-white rounded-lg shadow-lg text-sm hidden transform -translate-x-1/2'
        style={{ minWidth: '200px' }} 
      />
    </div>
  );
};

export default PowerStationMap;