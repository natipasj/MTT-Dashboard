import React from 'react';
import clsx from 'clsx';

export const KPICard = ({ title, subTitle, value, type = 'blue', positive, isNegative, isWarning }) => {
    return (
        <div className={clsx('kpi-card', type)}>
            <h3>{title}</h3>
            {subTitle && <small>{subTitle}</small>}
            <div className="value" style={{
                color: isNegative ? '#dc2626' :
                    isWarning ? '#f97316' :
                        positive ? '#16a34a' : undefined
            }}>{value}</div>
        </div>
    );
};

export const SectionKPIs = ({ metrics }) => {
    return (
        <div className="kpi-section" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="kpi-row">
                <KPICard title="Complete Order" subTitle="(#PO)" value={metrics.completeOrder.toLocaleString()} />
                <KPICard title="GMV" subTitle="(MB.)" value={metrics.gmv.toFixed(1)} />
                <KPICard title="ABS" subTitle="(Baht)" value={metrics.abs.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
                <KPICard title="#Customer" subTitle="(ราย)" value={metrics.customers.toLocaleString()} />
                <KPICard title="#Repeat Customer" subTitle="(ราย)" value={metrics.repeatCustomers.toLocaleString()} />
            </div>
            {/* Orange Section Removed as per request */}
        </div>
    );
};
