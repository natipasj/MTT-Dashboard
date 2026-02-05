import React from 'react';

export const MainTable = ({ data, onRowClick, selectedBranches = [] }) => {
    const totalGMV = data.reduce((acc, curr) => acc + curr.gmv, 0);

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>HP</th>
                        <th>Branch</th>
                        <th>GMV (MB)</th>
                        <th>#Customer</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => {
                        // Check if this row is selected (by checking if its name is in selectedBranches)
                        const isSelected = selectedBranches.includes(row.name);
                        return (
                            <tr
                                key={row.id}
                                onClick={() => onRowClick(row.id)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#eff6ff' : undefined,
                                    fontWeight: isSelected ? '700' : 'normal',
                                    color: isSelected ? '#1e40af' : 'inherit'
                                }}
                            >
                                <td>{row.id}</td>
                                <td>{row.name}</td>
                                <td style={{ fontWeight: 600 }}>{row.gmv.toFixed(1)}</td>
                                <td>{row.customers.toLocaleString()}</td>
                            </tr>
                        );
                    })}
                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f1f5f9' }}>
                        <td colSpan="2" style={{ textAlign: 'center' }}>Total</td>
                        <td>{totalGMV.toFixed(1)}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
