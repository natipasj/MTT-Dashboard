import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

// Horizontal Bar Chart for Products
export const ProductBarChart = ({ data, title, onBarClick, activeKey }) => {
    return (
        <div className="chart-container">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#64748b' }}>{title}</h4>
                {activeKey && <span style={{ fontSize: '0.7rem', color: '#f59e0b', cursor: 'pointer' }} onClick={() => onBarClick(null)}>(Clear)</span>}
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                    barSize={18}
                    onClick={(e) => {
                        if (e && e.activePayload && e.activePayload.length) {
                            onBarClick(e.activePayload[0].payload.name);
                        }
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" fontSize={10} tickFormatter={(val) => `${val.toFixed(0)}M`} stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 9, fill: '#475569' }} /> // Create more space for labels
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                        formatter={(value) => [`${value.toFixed(2)} MB`, 'GMV']}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="value" position="right" formatter={(val) => val.toFixed(1) + 'M'} style={{ fontSize: '10px', fill: '#64748b' }} />
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={activeKey && activeKey === entry.name ? '#2563eb' : '#facc15'} /* Highlight active */
                                cursor="pointer"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
