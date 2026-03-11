'use client';

import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  GeoFeature,
  Graticule,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { useTranslation } from '@/context/LanguageContext';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

const VISITED_BY_NAME: Record<string, { displayName: string; cities: string[] }> = {
  'Bosnia and Herz.': { displayName: 'Bosnia and Herzegovina', cities: ['Sarajevo', 'Mostar', 'Trebinje'] },
  'Montenegro': { displayName: 'Montenegro', cities: ['Podgorica', 'Kotor'] },
  'Serbia': { displayName: 'Serbia', cities: ['Belgrade'] },
};

const CITY_MARKERS = [
  { name: 'Sarajevo', coordinates: [18.4131, 43.8563] as [number, number] },
  { name: 'Mostar', coordinates: [17.8077, 43.3438] as [number, number] },
  { name: 'Trebinje', coordinates: [18.3437, 42.7104] as [number, number] },
  { name: 'Podgorica', coordinates: [19.2636, 42.4304] as [number, number] },
  { name: 'Kotor', coordinates: [18.7712, 42.4247] as [number, number] },
  { name: 'Belgrade', coordinates: [20.4651, 44.8048] as [number, number] },
];

interface TooltipState {
  name: string;
  cities?: string[];
  x: number;
  y: number;
}

const TravelMap: React.FC = () => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [19, 44],
    zoom: 1,
  });
  const { t } = useTranslation('common');

  const handleMoveEnd = (pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-slate-900">
      <ComposableMap
        projectionConfig={{
          rotate: [-15, -52, 0],
          scale: 700,
        }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          onMoveEnd={handleMoveEnd}
          minZoom={0.5}
          maxZoom={8}
        >
        <Graticule stroke="#334155" strokeWidth={0.4} />
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: GeoFeature[] }) =>
            geographies.map((geo: GeoFeature) => {
              const geoName: string = (geo.properties as Record<string, string>).name ?? '';
              const visited = VISITED_BY_NAME[geoName];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(e: React.MouseEvent) => {
                    setTooltip({
                      name: visited ? visited.displayName : geoName,
                      cities: visited?.cities,
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }}
                  onMouseMove={(e: React.MouseEvent) => {
                    setTooltip((prev) =>
                      prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                    );
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: {
                      fill: visited ? '#818cf8' : '#1e293b',
                      stroke: '#334155',
                      strokeWidth: 0.3,
                      outline: 'none',
                    },
                    hover: {
                      fill: visited ? '#6366f1' : '#334155',
                      stroke: '#475569',
                      strokeWidth: 0.3,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    pressed: {
                      fill: visited ? '#4f46e5' : '#334155',
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {CITY_MARKERS.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle
              r={1}
              fill="#f59e0b"
              stroke="#fff"
              strokeWidth={0.5}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e: React.MouseEvent) => {
                setTooltip({ name, x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e: React.MouseEvent) => {
                setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          </Marker>
        ))}
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg px-3 py-2 pointer-events-none text-sm"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <p className="font-semibold text-gray-800 dark:text-gray-200">{tooltip.name}</p>
          {tooltip.cities && (
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              {tooltip.cities.join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 px-4 py-2 bg-white/80 dark:bg-gray-900/80 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-indigo-500" />
          {t('journey.travel_map_visited_country')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
          {t('journey.travel_map_visited_city')}
        </span>
      </div>
    </div>
  );
};

export default TravelMap;
