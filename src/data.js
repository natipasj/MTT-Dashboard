import { startOfYear, endOfYear, eachDayOfInterval, format, isSameMonth, startOfMonth, endOfMonth, getDay } from 'date-fns';

const BRANCH_LOCATIONS = [
  { id: "1", name: "สำนักงานใหญ่ (รามคำแหง 167)", province: "กรุงเทพมหานคร", lat: 13.7915, lng: 100.7075 },
  { id: "2", name: "รามคำแหง-บางกะปิ", province: "กรุงเทพมหานคร", lat: 13.7705, lng: 100.6619 },
  { id: "3", name: "มีนบุรี-แยกมิสทีน", province: "กรุงเทพมหานคร", lat: 13.7931, lng: 100.7018 },
  { id: "4", name: "ลำลูกกา-สายไหม", province: "ปทุมธานี", lat: 13.9238, lng: 100.6725 },
  { id: "5", name: "ร่มเกล้า-กรุงเทพกรีฑาตัดใหม่", province: "กรุงเทพมหานคร", lat: 13.7495, lng: 100.7437 },
  { id: "6", name: "รามอินทรา-มีนบุรี", province: "กรุงเทพมหานคร", lat: 13.8125, lng: 100.7069 },
  { id: "7", name: "ศรีนครินทร์-บางนา", province: "สมุทรปราการ", lat: 13.6428, lng: 100.6362 },
  { id: "8", name: "เทพารักษ์-บางพลี", province: "สมุทรปราการ", lat: 13.6062, lng: 100.6865 },
  { id: "9", name: "สมุทรปราการ-ศรีนครินทร์", province: "สมุทรปราการ", lat: 13.5936, lng: 100.6148 },
  { id: "10", name: "ปิ่นเกล้า-ราชพฤกษ์", province: "กรุงเทพมหานคร", lat: 13.8076, lng: 100.4501 },
  { id: "11", name: "กาญจนาภิเษก-บางใหญ่", province: "นนทบุรี", lat: 13.8554, lng: 100.4123 },
  { id: "12", name: "รัตนาธิเบศร์-ราชพฤกษ์", province: "นนทบุรี", lat: 13.8732, lng: 100.4536 },
  { id: "13", name: "บางบัวทอง-กาญจนาภิเษก", province: "นนทบุรี", lat: 13.9287, lng: 100.4135 },
  { id: "14", name: "บางแค-กาญจนาภิเษก", province: "กรุงเทพมหานคร", lat: 13.7434, lng: 100.4054 },
  { id: "15", name: "ติวานนท์-ปากเกร็ด", province: "นนทบุรี", lat: 13.9189, lng: 100.5236 },
  { id: "16", name: "กิ่งแก้ว-สุวรรณภูมิ", province: "สมุทรปราการ", lat: 13.6825, lng: 100.7303 },
  { id: "17", name: "รังสิต-นครนายก คลอง 4", province: "ปทุมธานี", lat: 14.0051, lng: 100.6978 },
  { id: "18", name: "บางบอน-กาญจนาภิเษก", province: "กรุงเทพมหานคร", lat: 13.6592, lng: 100.4057 },
  { id: "19", name: "อ้อมน้อย-เพชรเกษม", province: "สมุทรสาคร", lat: 13.7042, lng: 100.3156 }
];

export { BRANCH_LOCATIONS }; // Export for use in Map Component

const ONLINE_BRANCH = { id: "0", name: "รักเหมาสเตชั่นออนไลน์", province: "กรุงเทพมหานคร", lat: 13.75, lng: 100.50 };

const BRANCHES = ["0 รักเหมาสเตชั่นออนไลน์", ...BRANCH_LOCATIONS.map(b => `${b.id} ${b.name}`)];

const CHANNELS = ["Online", "PC"];
const SHIPPING_TYPES = ["FTL", "SML", "Pickup"];

// Thai Mock Data
const PRODUCT_CLASSES = ["ปูนซีเมนต์", "เหล็กเส้น", "อิฐมวลเบา", "กระเบื้องหลังคา", "สุขภัณฑ์", "สีทาบ้าน", "เครื่องมือช่าง"];
const BRANDS = ["เสือ (Tiger)", "ทีพีไอ (TPI)", "เอสซีจี (SCG)", "คิวคอน (Q-Con)", "เพชร", "อินทรี", "ทีโอเอ (TOA)"];

const CUSTOMER_NAMES = [
  "ช่างสมชาย รับเหมา", "ช่างอู๊ด งานปูน", "ช่างศักดิ์ ซ่อมแซม", "ช่างหนุ่ม งานเหล็ก",
  "ช่างเอก ต่อเติม", "ช่างวิทย์ ระบบน้ำ", "ช่างป้อม งานโครงสร้าง", "ช่างนพ ปูกระเบื้อง",
  "ผู้รับเหมาวิชัย", "ช่างตั้ม งานสี", "ช่างบอย รีโนเวท", "ช่างหมู ทั่วไป",
  "ช่างเก่ง งานไม้", "ช่างเล็ก ปากเกร็ด", "ช่างหนึ่ง บางพลี", "ช่างธงชัย",
  "ช่างมานะ การช่าง", "ช่างวีระ รับสร้างบ้าน", "ช่างกิต", "ช่างอำนาจ"
];

const getProduct = (cls, brand) => {
  // Generate realistic Thai product names
  let suffix = "มาตรฐาน";
  if (Math.random() > 0.7) suffix = "พรีเมียม";
  else if (Math.random() > 0.8) suffix = "รุ่นพิเศษ";

  if (cls === "ปูนซีเมนต์") return `[${brand}] ปูนซีเมนต์ผสม ${suffix} 50กก.`;
  if (cls === "เหล็กเส้น") return `[${brand}] เหล็กเส้นกลม SR24 ${suffix} ยาว 10ม.`;
  if (cls === "อิฐมวลเบา") return `[${brand}] อิฐมวลเบา G4 ขนาด 20x60x7.5ซม.`;
  if (cls === "กระเบื้องหลังคา") return `[${brand}] กระเบื้องลอนคู่ สีธรรมชาติ ${suffix}`;
  if (cls === "สุขภัณฑ์") return `[${brand}] ชักโครก 2 ชิ้น รุ่น ${suffix}`;
  if (cls === "สีทาบ้าน") return `[${brand}] สีน้ำอะคริลิค ภายนอก ${suffix} 9 ลิตร`;
  return `[${brand}] ${cls} ${suffix}`;
};



export const generateData = () => {
  const transactions = [];
  const customers = [];

  for (let i = 0; i < 500; i++) {
    customers.push({
      id: `CUST-${1000 + i}`,
      name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)] + " " + (i + 1), // Append number to ensure uniqueness if needed, or just random
      preferredBranch: BRANCHES[Math.floor(Math.random() * BRANCHES.length)]
    });
  }

  const startDate = new Date(2025, 0, 1);
  const endDate = new Date(2027, 11, 31);
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  allDays.forEach(day => {
    if (Math.random() > 0.7) return;

    // Increase volume to make numbers big enough to be realistic
    const dailyOrders = Math.floor(Math.random() * 20) + 5;

    let dailyCount = 0;
    const dateStr = format(day, 'yyMMdd');

    for (let i = 0; i < dailyOrders; i++) {
      dailyCount++;
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const isOnline = Math.random() > 0.4;
      const branch = Math.random() > 0.8 ? BRANCHES[Math.floor(Math.random() * BRANCHES.length)] : customer.preferredBranch;

      const pClass = PRODUCT_CLASSES[Math.floor(Math.random() * PRODUCT_CLASSES.length)];
      const pBrand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
      const pName = getProduct(pClass, pBrand);

      // Location Logic (Cluster around Branch)
      let branchData = BRANCH_LOCATIONS.find(b => branch.includes(b.id));
      if (!branchData) {
        // If Online or fallback, pick a random physical branch location to simulate customer density
        branchData = BRANCH_LOCATIONS[Math.floor(Math.random() * BRANCH_LOCATIONS.length)];
      }

      // Cluster projects around the branch (approx 5-10km radius)
      const latJitter = (Math.random() - 0.5) * 0.08;
      const lngJitter = (Math.random() - 0.5) * 0.08;

      // Delivery Status Logic
      // 95% Delivered, 5% Pending
      const isDelivered = Math.random() > 0.05;

      const slaLimit = 3;

      // Logic: Most orders are 1-3 days (On Time).
      // Delays are rare exceptions.
      let elapsedDays;
      if (Math.random() > 0.998) {
        // Rare Delay (0.2% chance) -> 4 to 10 days
        elapsedDays = Math.floor(Math.random() * 7) + 4;
      } else {
        // Normal Operation -> 1 to 3 days
        elapsedDays = Math.floor(Math.random() * 3) + 1;
      }

      // Occasional "Pending Delay" (Force a few stuck items)
      // Only if not delivered yet, and very rare
      if (!isDelivered && Math.random() > 0.98) {
        elapsedDays = Math.floor(Math.random() * 10) + 4;
      }

      const isDelay = elapsedDays > slaLimit;
      const delayDays = isDelay ? elapsedDays - slaLimit : 0;

      transactions.push({
        id: `RM${dateStr}S${dailyCount.toString().padStart(5, '0')}`,
        date: day,
        year: day.getFullYear(),
        month: format(day, 'MMMM'),
        branch: branch,
        customerId: customer.id,
        customerName: customer.name,
        channel: isOnline ? "Online" : "PC",
        shippingType: SHIPPING_TYPES[Math.floor(Math.random() * SHIPPING_TYPES.length)],
        amount: Math.floor(Math.random() * 50000) + 2000,
        gp: Math.floor(Math.random() * 5000) + 100,
        productClass: pClass,
        brand: pBrand,
        productName: pName,
        // Location Fields
        province: branchData.province,
        lat: branchData.lat + latJitter,
        lng: branchData.lng + lngJitter,
        // SLA Fields
        slaLimit,
        actualDuration: elapsedDays, // For pending, this is "current age"
        isDelivered, // New Field
        isDelay,
        delayDays
      });
    }
  });

  return { transactions, branches: BRANCHES };
};

export const processData = (rawTransactions, filters) => {
  if (!rawTransactions) return null;

  // 1. Filter Transactions
  let filtered = rawTransactions.filter(t => {
    if (filters.year && t.year !== filters.year) return false;
    if (filters.month && filters.month.length > 0 && !filters.month.includes(t.month)) return false;
    if (filters.branch && filters.branch.length > 0 && !filters.branch.includes(t.branch)) return false;
    // New Cross-Filters
    if (filters.productClass && t.productClass !== filters.productClass) return false;
    if (filters.brand && t.brand !== filters.brand) return false;
    return true;
  });

  // 2. Derive Customer Stats (Re-calc based on filter or pre-calc? Better re-calc for filtered view)
  const custStats = {};
  filtered.forEach(t => {
    if (!custStats[t.customerId]) {
      custStats[t.customerId] = { count: 0, channels: new Set(), totalSpend: 0 };
    }
    custStats[t.customerId].count += 1;
    custStats[t.customerId].channels.add(t.channel);
    custStats[t.customerId].totalSpend += t.amount;
  });

  const getCustomerType = (custId) => {
    const stats = custStats[custId];
    if (!stats) return "Unknown";
    return stats.count >= 4 ? "Repeat" : "Long-tail";
  };

  const getCustomerChannelType = (custId) => {
    const stats = custStats[custId];
    if (!stats) return "Unknown";
    if (stats.channels.size > 1) return "Hybrid";
    if (stats.channels.has("Online")) return "Online Only";
    return "Walk In";
  };

  // 3. Adv Filters (Channel)
  if (filters.channel && filters.channel.length > 0) {
    filtered = filtered.filter(t => {
      const type = getCustomerChannelType(t.customerId);
      return filters.channel.includes(type);
    });
  }

  // 4. Metrics calculation
  const totalGMV = filtered.reduce((sum, t) => sum + t.amount, 0);
  const totalGP = filtered.reduce((sum, t) => sum + t.gp, 0);
  const uniqueCustomers = new Set(filtered.map(t => t.customerId)).size;
  const repeatCustomersCount = Object.values(custStats).filter(c => c.count >= 4).length;

  const metrics = {
    completeOrder: filtered.length,
    gmv: totalGMV / 1000000,
    abs: filtered.length ? totalGMV / filtered.length : 0,
    customers: uniqueCustomers,
    repeatCustomers: repeatCustomersCount,
  };

  // 5. Table Data (overview)
  const branchMap = {};
  filtered.forEach(t => {
    if (!branchMap[t.branch]) {
      branchMap[t.branch] = { id: t.branch.split(' ')[0], name: t.branch, gmv: 0, customers: new Set() };
    }
    branchMap[t.branch].gmv += t.amount;
    branchMap[t.branch].customers.add(t.customerId);
  });

  const tableData = Object.values(branchMap)
    .map(b => ({ ...b, gmv: b.gmv / 1000000, customers: b.customers.size }))
    .sort((a, b) => b.gmv - a.gmv);

  // 6. Heatmap Logic
  let rangeStart, rangeEnd;
  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (filters.month && filters.month.length > 0 && filters.year) {
    const sortedMonths = [...filters.month].sort((a, b) => MONTH_NAMES.indexOf(a) - MONTH_NAMES.indexOf(b));
    const firstMonth = sortedMonths[0];
    const monthIdx = MONTH_NAMES.indexOf(firstMonth);
    rangeStart = new Date(filters.year, monthIdx, 1);
    rangeEnd = endOfMonth(rangeStart);
  } else if (filters.year) {
    rangeStart = new Date(filters.year, 0, 1);
    rangeEnd = new Date(filters.year, 0, 31);
  } else {
    rangeStart = new Date(2026, 0, 1);
    rangeEnd = new Date(2026, 0, 31);
  }

  const dailyMap = {};
  filtered.forEach(t => {
    const d = format(t.date, 'yyyy-MM-dd');
    dailyMap[d] = (dailyMap[d] || 0) + t.amount;
  });

  const maxDailyGMV = Math.max(...Object.values(dailyMap), 1);

  const heatmapData = eachDayOfInterval({ start: rangeStart, end: rangeEnd }).map(day => {
    const dStr = format(day, 'yyyy-MM-dd');
    return {
      date: dStr,
      dayOfMonth: day.getDate(),
      dayOfWeek: day.getDay(),
      value: dailyMap[dStr] || 0,
      opacity: (dailyMap[dStr] || 0) / maxDailyGMV
    };
  });

  const startOffset = heatmapData[0].dayOfWeek;
  const paddedHeatmap = [
    ...Array(startOffset).fill({ empty: true }),
    ...heatmapData
  ];

  // 7. Trend
  const monthMap = {};
  filtered.forEach(t => {
    const k = t.month.substring(0, 3);
    monthMap[k] = (monthMap[k] || 0) + t.amount;
  });
  const trendData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => ({
    month: m,
    value: (monthMap[m] || 0) / 1000000
  }));

  // 8. Channel (Filtered)
  const channelMap = {};
  filtered.forEach(t => {
    if (!channelMap[t.branch]) channelMap[t.branch] = { name: t.branch.split(' ')[0], Online: 0, Hybrid: 0, WalkIn: 0 };
    const cType = getCustomerChannelType(t.customerId);
    const key = cType === "Online Only" ? "Online" : cType === "Walk In" ? "WalkIn" : "Hybrid";
    channelMap[t.branch][key] += t.amount / 1000000;
  });
  const byChannel = Object.values(channelMap);

  // 9. Extra Stats
  let longTailGMV = 0, repeatGMV = 0;
  filtered.forEach(t => {
    const type = getCustomerType(t.customerId);
    if (type === "Long-tail") longTailGMV += t.amount;
    else repeatGMV += t.amount;
  });
  const slaMap = {};
  filtered.forEach(t => {
    slaMap[t.shippingType] = (slaMap[t.shippingType] || 0) + t.amount;
  });

  // 10. Page 2 Aggregations & Location Stats
  const classMap = {}, brandMap = {}, itemMap = {}, buyerMap = {};
  // For Province Table
  const provinceMonthMap = {}; // { "Bangkok": { "Jan": 100, "Feb": 200, ... } }
  // For Map
  const locationPoints = [];

  filtered.forEach(t => {
    classMap[t.productClass] = (classMap[t.productClass] || 0) + t.amount;
    brandMap[t.brand] = (brandMap[t.brand] || 0) + t.amount;
    itemMap[t.productName] = (itemMap[t.productName] || 0) + t.amount;

    if (!buyerMap[t.customerId]) {
      buyerMap[t.customerId] = {
        name: t.customerName,
        orders: 0,
        gmv: 0,
        branch: t.branch.split(' ')[0]
      };
    }
    buyerMap[t.customerId].orders += 1;
    buyerMap[t.customerId].gmv += t.amount;

    // Location Agg
    const monthKey = t.month.substring(0, 3); // Jan, Feb...
    if (!provinceMonthMap[t.province]) {
      provinceMonthMap[t.province] = { name: t.province, total: 0 };
    }
    provinceMonthMap[t.province][monthKey] = (provinceMonthMap[t.province][monthKey] || 0) + t.amount;
    provinceMonthMap[t.province].total += t.amount;

    // Map Points (Sample randomly to avoid performance kill if too many)
    if (Math.random() > 0.8) { // Take 20% for map visualization
      locationPoints.push({
        lat: t.lat,
        lng: t.lng,
        amount: t.amount,
        name: t.customerName,
        province: t.province // Add province for filtering
      });
    }
  });

  const sortDesc = (map) => Object.entries(map).map(([k, v]) => ({ name: k, value: v / 1000000 })).sort((a, b) => b.value - a.value);

  const productStats = {
    byClass: sortDesc(classMap),
    byBrand: sortDesc(brandMap),
    byItem: sortDesc(itemMap).slice(0, 15),
    buyerList: Object.values(buyerMap).map(b => ({ ...b, abs: b.gmv / b.orders })).sort((a, b) => b.gmv - a.gmv).slice(0, 50)
  };

  const locationStats = {
    mapPoints: locationPoints,
    provinceTable: Object.values(provinceMonthMap).sort((a, b) => b.total - a.total)
  };

  // 11. SLA Stats
  const totalOrders = filtered.length;

  const deliveredOnTime = filtered.filter(t => t.isDelivered && !t.isDelay).length;
  const deliveredDelay = filtered.filter(t => t.isDelivered && t.isDelay).length;
  const pendingOnTrack = filtered.filter(t => !t.isDelivered && !t.isDelay).length;
  const pendingDelay = filtered.filter(t => !t.isDelivered && t.isDelay).length;

  const slaMetrics = {
    total: totalOrders,
    deliveredOnTime,
    deliveredDelay,
    pendingOnTrack,
    pendingDelay
  };

  const getSLAStatus = (t) => {
    if (t.isDelivered) {
      return t.isDelay ? 'Completed (Late)' : 'Completed (On Time)';
    } else {
      return t.isDelay ? 'Pending (Late)' : 'Pending (On Track)';
    }
  };

  const slaTableData = filtered.map(t => ({
    id: t.id,
    date: format(t.date, 'dd/MM/yyyy'),
    customer: t.customerName,
    branch: t.branch.split(' ')[0],
    amount: t.amount,
    slaLimit: t.slaLimit,
    actualDuration: t.actualDuration,
    status: getSLAStatus(t),
    isDelivered: t.isDelivered,
    isDelay: t.isDelay,
    delayDays: t.delayDays
  })).sort((a, b) => {
    // Sort Priority: Pending Late > Pending On Track > Completed Late > Completed On Time
    const getRank = (row) => {
      // Pending Late
      if (!row.isDelivered && row.isDelay) return 4;
      // Pending On Track
      if (!row.isDelivered && !row.isDelay) return 3;
      // Completed Late
      if (row.isDelivered && row.isDelay) return 2;
      // Completed On Time
      return 1;
    };

    const rankA = getRank(a);
    const rankB = getRank(b);

    if (rankA !== rankB) return rankB - rankA; // Higher rank first

    // Tie breakers
    if (a.isDelay) return b.delayDays - a.delayDays; // Most delayed first
    return 0;
  })
    .slice(0, 1000);

  return {
    metrics,
    tableData,
    heatmapData: paddedHeatmap,
    trendData,
    byChannel,
    extraStats: {
      customerType: { longTail: longTailGMV / 1000000, repeat: repeatGMV / 1000000 },
      sla: slaMap
    },
    productStats,
    locationStats, // New Stats
    slaStats: {
      metrics: slaMetrics,
      table: slaTableData
    }
  };
};
