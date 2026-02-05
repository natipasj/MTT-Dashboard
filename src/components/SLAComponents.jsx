import React from 'react';
import { clsx } from 'clsx';
import { KPICard } from './KPICards'; // Re-use generic card style, or make specific ones

export const SLAKpiSection = ({ metrics, onCardClick, activeFilter }) => {
    const getCardStyle = (filterName) => ({
        cursor: 'pointer',
        border: activeFilter === filterName ? '2px solid #2563eb' : '1px solid #e2e8f0',
        backgroundColor: activeFilter && activeFilter !== filterName ? '#f8fafc' : 'white',
        opacity: activeFilter && activeFilter !== filterName ? 0.6 : 1
    });

    return (
        <div className="kpi-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            <div onClick={() => onCardClick(null)} style={getCardStyle(null)}>
                <KPICard
                    title="Total Orders"
                    subTitle="(#PO)"
                    value={metrics.total.toLocaleString()}
                />
            </div>
            <div onClick={() => onCardClick('Pending (On Track)')} style={getCardStyle('Pending (On Track)')}>
                <KPICard
                    title="Pending (On Track)"
                    subTitle=""
                    value={metrics.pendingOnTrack.toLocaleString()}
                    type="blue"
                />
            </div>
            <div onClick={() => onCardClick('Pending (Late)')} style={getCardStyle('Pending (Late)')}>
                <KPICard
                    title="Pending (High Risk)"
                    subTitle="(Delay)"
                    value={metrics.pendingDelay.toLocaleString()}
                    isNegative={true}
                />
            </div>
            <div onClick={() => onCardClick('Completed (On Time)')} style={getCardStyle('Completed (On Time)')}>
                <KPICard
                    title="Completed (On Time)"
                    subTitle=""
                    value={metrics.deliveredOnTime.toLocaleString()}
                    positive={true}
                />
            </div>
            <div onClick={() => onCardClick('Completed (Late)')} style={getCardStyle('Completed (Late)')}>
                <KPICard
                    title="Completed (Late)"
                    subTitle="(Delay)"
                    value={metrics.deliveredDelay.toLocaleString()}
                    isWarning={true}
                />
            </div>
        </div>
    );
};

export const SLATable = ({ data }) => {
    return (
        <div className="table-container" style={{ height: '100%', overflow: 'auto' }}>
            <table style={{ width: '100%', minWidth: '800px' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '10px' }}>PO No.</th>
                        <th style={{ textAlign: 'left' }}>Order Date</th>
                        <th style={{ textAlign: 'left' }}>Customer</th>
                        <th style={{ textAlign: 'center' }}>Branch</th>
                        <th style={{ textAlign: 'center' }}>SLA Limit (Days)</th>
                        <th style={{ textAlign: 'center' }}>Actual (Days)</th>
                        <th style={{ textAlign: 'center' }}>Status</th>
                        <th style={{ textAlign: 'center' }}>Delay (Days)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: '500', color: '#334155' }}>{row.id}</td>
                            <td style={{ color: '#64748b' }}>{row.date}</td>
                            <td style={{ color: '#334155' }}>{row.customer}</td>
                            <td style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem' }}>{row.branch}</td>
                            <td style={{ textAlign: 'center' }}>{row.slaLimit}</td>
                            <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{row.actualDuration}</td>
                            <td style={{ textAlign: 'center' }}>
                                <span style={{
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    fontWeight: '600',
                                    backgroundColor:
                                        row.status === 'Completed (Late)' ? '#ffedd5' :
                                            row.status === 'Pending (Late)' ? '#fecaca' :
                                                row.status === 'Pending (On Track)' ? '#bfdbfe' : '#bbf7d0',
                                    color:
                                        row.status === 'Completed (Late)' ? '#c2410c' :
                                            row.status === 'Pending (Late)' ? '#dc2626' :
                                                row.status.includes('Pending') ? '#1e40af' : '#16a34a',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {row.status}
                                </span>
                            </td>
                            <td style={{ textAlign: 'center', color: row.delayDays > 0 ? '#dc2626' : '#cbd5e1', fontWeight: row.delayDays > 0 ? 'bold' : 'normal' }}>
                                {row.delayDays > 0 ? `+${row.delayDays}` : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
