import React, { useState, useEffect, useMemo } from 'react';
import './index.css';
import { generateData, processData } from './data';
import { FilterBar } from './components/FilterBar';
import { SectionKPIs } from './components/KPICards';
import { MainTable } from './components/MainTable';
import { TrendChart, CalendarHeatmap, ChannelChart, CustomPieChart } from './components/Charts';
import { ProductBarChart } from './components/ProductCharts';
import { BuyerListTable } from './components/BuyerListTable';
import { SLAKpiSection, SLATable } from './components/SLAComponents';
import { LocationMap, ProvinceMonthlyTable } from './components/LocationComponents';
import 'leaflet/dist/leaflet.css';

function App() {
  const [dataCache, setDataCache] = useState(null);
  const [currentPage, setCurrentPage] = useState('overview'); // 'overview' | 'product' | 'sla'

  const [year, setYear] = useState(2026);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  // Cross-filtering states for Page 2
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // SLA Filter
  const [slaFilter, setSlaFilter] = useState(null);

  // Location Filter
  const [selectedProvince, setSelectedProvince] = useState(null);

  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const CHANNEL_OPTS = ["Online Only", "Walk In", "Hybrid"];

  useEffect(() => {
    const raw = generateData();
    setDataCache(raw);
  }, []);

  const dashboardData = useMemo(() => {
    if (!dataCache) return null;
    const filters = {
      year,
      month: selectedMonths.length > 0 ? selectedMonths : null,
      branch: selectedBranches.length > 0 ? selectedBranches : null,
      channel: selectedChannels.length > 0 ? selectedChannels : null,
      // Add new cross-filters
      productClass: selectedClass,
      brand: selectedBrand
    };
    return processData(dataCache.transactions, filters);
  }, [dataCache, year, selectedMonths, selectedBranches, selectedChannels, selectedClass, selectedBrand]);

  const handleBranchSelect = (branchId) => {
    if (!branchId) return;
    const fullBranch = dataCache.branches.find(b => b.includes(branchId));
    if (!fullBranch) return;
    if (selectedBranches.includes(fullBranch)) {
      setSelectedBranches(prev => prev.filter(b => b !== fullBranch));
    } else {
      setSelectedBranches(prev => [...prev, fullBranch]);
    }
  };

  if (!dashboardData) return <div style={{ padding: 20 }}>Loading Data...</div>;

  const renderContent = () => {
    // Header for all pages
    const header = (
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2>{currentPage === 'overview' ? 'MTT Data Dashboard' : currentPage === 'product' ? 'Product & Buyer Insights' : 'SLA Tracking'}</h2>
          <div style={{ display: 'flex', gap: '4px', background: '#e2e8f0', padding: '2px', borderRadius: '6px' }}>
            <button onClick={() => setCurrentPage('overview')} className={currentPage === 'overview' ? 'nav-btn active' : 'nav-btn'}>Overview</button>
            <button onClick={() => setCurrentPage('product')} className={currentPage === 'product' ? 'nav-btn active' : 'nav-btn'}>Product & Customer</button>
            <button onClick={() => setCurrentPage('sla')} className={currentPage === 'sla' ? 'nav-btn active' : 'nav-btn'}>SLA Tracking</button>
            <button onClick={() => setCurrentPage('location')} className={currentPage === 'location' ? 'nav-btn active' : 'nav-btn'}>Project Location</button>
          </div>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#666' }}>
          {(selectedClass || selectedBrand) && currentPage === 'product' && <span style={{ marginRight: 10, color: '#2563eb' }}>Filters: {[selectedClass, selectedBrand].filter(Boolean).join(' > ')}</span>}
          {year} {selectedMonths.length > 0 ? `(${selectedMonths.length} mo)` : '(Full Year)'}
        </span>
      </div>
    );

    if (currentPage === 'overview') {
      // Prepare Pie Data
      const custTypeData = [
        { name: 'Long-tail', value: dashboardData.extraStats.customerType.longTail },
        { name: 'Repeat', value: dashboardData.extraStats.customerType.repeat }
      ];

      const slaData = Object.entries(dashboardData.extraStats.sla).map(([key, val]) => ({
        name: key,
        value: val / 1000000
      }));

      return (
        <div className="main-content">
          {header}
          <SectionKPIs metrics={dashboardData.metrics} />

          <div className="data-section-upper">
            <MainTable data={dashboardData.tableData} onRowClick={handleBranchSelect} selectedBranches={selectedBranches} />
            <CalendarHeatmap data={dashboardData.heatmapData} />
          </div>

          <div className="data-section-lower">
            <TrendChart data={dashboardData.trendData} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', minHeight: '0' }}>
              <ChannelChart data={dashboardData.byChannel} />
              <CustomPieChart
                title="GMV BY TYPE"
                data={custTypeData}
                colors={['#8b5cf6', '#06b6d4']}
              />
              <CustomPieChart
                title="GMV BY SLA"
                data={slaData}
                colors={['#10b981', '#f43f5e', '#f59e0b']}
              />
            </div>
          </div>
        </div>
      );
    } else if (currentPage === 'product') {
      return (
        <div className="main-content" style={{ gridTemplateRows: 'auto 1fr 1fr' }}>
          {header}
          {/* Interactable Product Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', minHeight: '0', overflow: 'hidden' }}>
            <ProductBarChart
              title="GMV by Class"
              data={dashboardData.productStats.byClass}
              onBarClick={(val) => setSelectedClass(selectedClass === val ? null : val)}
              activeKey={selectedClass}
            />
            <ProductBarChart
              title="GMV by Brand"
              data={dashboardData.productStats.byBrand}
              onBarClick={(val) => setSelectedBrand(selectedBrand === val ? null : val)}
              activeKey={selectedBrand}
            />
            <ProductBarChart
              title="GMV by Item"
              data={dashboardData.productStats.byItem}
              onBarClick={() => { }} // No filtering deeper than item yet
            />
          </div>

          <div style={{ minHeight: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#334155' }}>Top Buyer List {(selectedClass || selectedBrand) ? '(Filtered)' : ''}</h4>
            <BuyerListTable data={dashboardData.productStats.buyerList} />
          </div>
        </div>
      )
    } else if (currentPage === 'location') {
      return (
        <div className="main-content" style={{ gridTemplateRows: 'auto 1fr', overflow: 'hidden' }}>
          {header}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minHeight: '0', overflow: 'hidden', paddingBottom: '16px' }}>
            <LocationMap
              points={dashboardData.locationStats.mapPoints}
              activeProvince={selectedProvince}
            />
            <ProvinceMonthlyTable
              data={dashboardData.locationStats.provinceTable}
              onRowClick={(prov) => setSelectedProvince(prev => prev === prov ? null : prov)}
              activeProvince={selectedProvince}
            />
          </div>
        </div>
      )
    } else {
      // Page 3: SLA Tracking
      return (
        <div className="main-content" style={{ gridTemplateRows: 'auto auto 1fr' }}>
          {header}

          {/* SLA KPI Cards */}
          <SLAKpiSection
            metrics={dashboardData.slaStats.metrics}
            onCardClick={(val) => setSlaFilter(prev => prev === val ? null : val)}
            activeFilter={slaFilter}
          />

          {/* SLA Detail Table */}
          <div style={{ minHeight: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', marginTop: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#334155' }}>
              Order Breakdown (Detail) {slaFilter && <span style={{ color: '#2563eb' }}>- Showing {slaFilter}</span>}
            </h4>
            <SLATable data={
              slaFilter
                ? dashboardData.slaStats.table.filter(r => r.status === slaFilter)
                : dashboardData.slaStats.table
            } />
          </div>
        </div>
      )
    }
  };

  return (
    <div className="dashboard-container">
      <FilterBar
        years={[2025, 2026, 2027]}
        selectedYear={year}
        onYearChange={setYear}
        months={MONTH_NAMES}
        selectedMonths={selectedMonths}
        onMonthsChange={setSelectedMonths}
        branches={dataCache.branches}
        selectedBranches={selectedBranches}
        onBranchesChange={setSelectedBranches}
        channels={CHANNEL_OPTS}
        selectedChannels={selectedChannels}
        onChannelsChange={setSelectedChannels}
      />
      {renderContent()}
    </div>
  );
}

export default App;
