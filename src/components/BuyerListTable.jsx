import React from 'react';

export const BuyerListTable = ({ data }) => {
    return (
        <div className="table-container" style={{ height: '100%', overflow: 'auto' }}>
            <table style={{ width: '100%', minWidth: '600px' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Buyer Name</th>
                        <th style={{ textAlign: 'center' }}>Branch</th>
                        <th style={{ textAlign: 'right' }}>#Order</th>
                        <th style={{ textAlign: 'right' }}>GMV (Baht)</th>
                        <th style={{ textAlign: 'right' }}>ABS (Baht)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((buyer, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: '500', color: '#334155' }}>{buyer.name}</td>
                            <td style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem' }}>{buyer.branch}</td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{buyer.orders}</td>
                            <td style={{ textAlign: 'right', color: '#2563eb', fontWeight: '600' }}>{buyer.gmv.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                            <td style={{ textAlign: 'right', color: '#64748b' }}>{buyer.abs.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
