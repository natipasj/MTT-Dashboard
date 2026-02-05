import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, Legend, PieChart, Pie } from 'recharts';

export const TrendChart = ({ data }) => {
    return (
        <div className="chart-container">
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#64748b' }}>GMV TREND (Monthly)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 15, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" fill="#facc15" radius={[3, 3, 0, 0]}>
                        <LabelList dataKey="value" position="top" formatter={(val) => val.toFixed(1)} style={{ fontSize: '9px', fill: '#64748b' }} />
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={'#facc15'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const CalendarHeatmap = ({ data }) => {
    const formatValue = (val) => {
        if (!val || val === 0) return '';
        if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
        if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
        return val;
    };

    return (
        <div className="chart-container" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexShrink: 0 }}>
                <h4 style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Daily Intensity (GMV)</h4>

                <div style={{ display: 'flex', gap: '2px', alignItems: 'center', fontSize: '9px', color: '#64748b' }}>
                    <span>Low</span>
                    {[0.2, 0.4, 0.6, 0.8, 1].map(op => (
                        <div key={op} style={{ width: '8px', height: '8px', backgroundColor: `rgba(37, 99, 235, ${op})`, borderRadius: '1px' }}></div>
                    ))}
                    <span>High</span>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '3px',
                fontSize: '11px',
                overflowY: 'hidden',
                flex: 1,
                alignContent: 'start',
                minHeight: 0
            }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} style={{ textAlign: 'center', color: '#94a3b8', paddingBottom: '0px', fontWeight: 'bold', fontSize: '0.65rem' }}>{d}</div>
                ))}

                {data.map((day, i) => {
                    if (day.empty) {
                        return <div key={`empty-${i}`} />;
                    }

                    const val = day.value || 0;
                    const opacity = Math.max(day.opacity, 0.1);

                    return (
                        <div key={i} style={{
                            aspectRatio: '1.4',
                            borderRadius: '4px',
                            backgroundColor: val > 0 ? `rgba(37, 99, 235, ${opacity})` : '#f8fafc',
                            border: val > 0 ? 'none' : '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: opacity > 0.6 ? 'white' : '#1e293b',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            cursor: 'default',
                            transition: 'transform 0.1s',
                            padding: '0px',
                            overflow: 'hidden'
                        }}
                            title={`${day.date}: ${(val).toLocaleString()} Baht`}
                        >
                            <span style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0px', lineHeight: '1', fontWeight: 'bold' }}>{day.dayOfMonth}</span>
                            {val > 0 && <span style={{ fontSize: '0.75rem', lineHeight: '1', fontWeight: '500' }}>{formatValue(val)}</span>}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export const ChannelChart = ({ data }) => {
    return (
        <div className="chart-container">
            <h4 style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>GMV BY CHANNEL</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data} barSize={12} margin={{ top: 0, right: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={35} tick={{ fontSize: 8, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                    />
                    <Legend iconSize={6} wrapperStyle={{ fontSize: '9px' }} />
                    <Bar name="Online Only" dataKey="Online" stackId="a" fill="#facc15" radius={[0, 0, 0, 0]}>
                        <LabelList dataKey="Online" position="top" formatter={(val) => val > 0 ? val.toFixed(1) : ''} style={{ fontSize: '10px', fill: '#1e293b', fontWeight: 'bold' }} />
                    </Bar>
                    <Bar name="Hybrid" dataKey="Hybrid" stackId="a" fill="#fb923c" radius={[0, 0, 0, 0]}>
                        <LabelList dataKey="Hybrid" position="top" formatter={(val) => val > 0 ? val.toFixed(1) : ''} style={{ fontSize: '10px', fill: '#1e293b', fontWeight: 'bold' }} />
                    </Bar>
                    <Bar name="Walk-In (PC)" dataKey="WalkIn" stackId="a" fill="#ea580c" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="WalkIn" position="top" formatter={(val) => val > 0 ? val.toFixed(1) : ''} style={{ fontSize: '10px', fill: '#1e293b', fontWeight: 'bold' }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export const CustomPieChart = ({ data, title, colors }) => {
    return (
        <div className="chart-container">
            <h4 style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#64748b' }}>{title}</h4>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, bottom: 0 }}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                        itemStyle={{ padding: 0 }}
                    />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '9px', right: 0 }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
