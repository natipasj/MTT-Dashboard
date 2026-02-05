import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import clsx from 'clsx';
import { BRANCH_LOCATIONS } from '../data';
// Leaflet CSS is imported in App.jsx

const branchIcon = new Icon({
    iconUrl: '/homepaint-logo.png', // in public folder
    iconSize: [40, 24], // Smaller size as requested
    iconAnchor: [20, 12],
    popupAnchor: [0, -12]
});

export const LocationMap = ({ points, activeProvince }) => {
    const center = [13.7563, 100.5018]; // Bangkok

    // Filter points if province selected
    const displayPoints = activeProvince
        ? points.filter(p => p.province === activeProvince)
        : points;

    return (
        <div className="card" style={{ height: '500px', padding: '0', overflow: 'hidden', borderRadius: '12px' }}>
            <MapContainer center={center} zoom={10} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Branch Pins */}
                {BRANCH_LOCATIONS.map((b) => (
                    <Marker
                        key={b.id}
                        position={[b.lat, b.lng]}
                        icon={branchIcon}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                            <span style={{ fontWeight: 'bold', color: '#b91c1c' }}>{b.name}</span>
                        </Tooltip>
                    </Marker>
                ))}

                {/* Project Clusters */}
                {displayPoints.map((pt, idx) => (
                    <CircleMarker
                        key={idx}
                        center={[pt.lat, pt.lng]}
                        pathOptions={{
                            color: activeProvince ? '#2563eb' : '#ef4444',
                            fillColor: activeProvince ? '#3b82f6' : '#ef4444',
                            fillOpacity: 0.6,
                            weight: 0
                        }}
                        radius={Math.min(10, Math.max(3, pt.amount / 5000))}
                    >
                        <Tooltip direction="top" offset={[0, -5]} opacity={1}>
                            <span>{pt.name}: ฿{(pt.amount / 1000).toFixed(1)}k</span>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export const ProvinceMonthlyTable = ({ data, onRowClick, activeProvince }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="card" style={{ overflow: 'auto' }}>
            <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>
                Project Location Breakdown (MB)
                {activeProvince && <span style={{ color: '#2563eb', fontSize: '0.9em', marginLeft: '10px' }}>- Showing {activeProvince}</span>}
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>Province</th>
                        {months.map(m => (
                            <th key={m} style={{ padding: '12px', textAlign: 'right', color: '#64748b' }}>{m}</th>
                        ))}
                        <th style={{ padding: '12px', textAlign: 'right', color: '#0f172a', fontWeight: 'bold' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr
                            key={idx}
                            onClick={() => onRowClick(row.name)}
                            style={{
                                borderBottom: '1px solid #f1f5f9',
                                cursor: 'pointer',
                                backgroundColor: activeProvince === row.name ? '#eff6ff' : 'transparent',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            <td style={{
                                padding: '12px',
                                fontWeight: '500',
                                color: activeProvince === row.name ? '#2563eb' : '#334155'
                            }}>{row.name}</td>
                            {months.map(m => (
                                <td key={m} style={{ padding: '12px', textAlign: 'right', color: '#64748b' }}>
                                    {row[m] ? (row[m] / 1000000).toFixed(2) : '-'}
                                </td>
                            ))}
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                                {(row.total / 1000000).toFixed(2)}M
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
