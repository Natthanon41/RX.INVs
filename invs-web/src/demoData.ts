// Demo/mock data for GitHub Pages deployment (when backend is unavailable)

export const DEMO_INVENTORY = [
  { id: 1, name: 'Paracetamol 500mg', category: 'ยาสามัญ', quantity: 5000, unit: 'เม็ด', status: 'ปกติ' },
  { id: 2, name: 'Amoxicillin 500mg', category: 'ยาปฏิชีวนะ', quantity: 3200, unit: 'แคปซูล', status: 'ปกติ' },
  { id: 3, name: 'Metformin 500mg', category: 'ยาสามัญ', quantity: 1800, unit: 'เม็ด', status: 'ปกติ' },
  { id: 4, name: 'Omeprazole 20mg', category: 'ยาสามัญ', quantity: 85, unit: 'แคปซูล', status: 'ใกล้หมด' },
  { id: 5, name: 'Losartan 50mg', category: 'ยาสามัญ', quantity: 2400, unit: 'เม็ด', status: 'ปกติ' },
  { id: 6, name: 'Atorvastatin 20mg', category: 'ยาสามัญ', quantity: 60, unit: 'เม็ด', status: 'ใกล้หมด' },
  { id: 7, name: 'Ciprofloxacin 500mg', category: 'ยาปฏิชีวนะ', quantity: 1500, unit: 'เม็ด', status: 'ปกติ' },
  { id: 8, name: 'Diclofenac Sodium 25mg', category: 'ยาสามัญ', quantity: 4200, unit: 'เม็ด', status: 'ปกติ' },
  { id: 9, name: 'Insulin Mixtard 30/70', category: 'เวชภัณฑ์ทางการแพทย์', quantity: 45, unit: 'ขวด', status: 'ใกล้หมด' },
  { id: 10, name: 'Normal Saline 0.9% 1000ml', category: 'เวชภัณฑ์ทางการแพทย์', quantity: 800, unit: 'ขวด', status: 'ปกติ' },
];

export const DEMO_PURCHASES = [
  { id: 'PO-2026-0001', date: '2026-04-01', supplier: 'บ.สยามฟาร์มาซูติคอล จำกัด', items: 15, total: 125000.00, status: 'อนุมัติแล้ว' },
  { id: 'PO-2026-0002', date: '2026-04-02', supplier: 'บ.เบอร์ลิน ฟาร์มาซูติคอล จำกัด', items: 8, total: 85400.50, status: 'สั่งซื้อแล้ว' },
  { id: 'PO-2026-0003', date: '2026-04-03', supplier: 'บ.ไบโอฟาร์ม จำกัด', items: 22, total: 256780.00, status: 'รับของแล้ว' },
  { id: 'PO-2026-0004', date: '2026-04-05', supplier: 'บ.องค์การเภสัชกรรม', items: 10, total: 198500.00, status: 'รออนุมัติ' },
  { id: 'PO-2026-0005', date: '2026-04-07', supplier: 'บ.แอ๊บบอต ลาบอแรตอรีส จำกัด', items: 5, total: 45200.00, status: 'อนุมัติแล้ว' },
  { id: 'PO-2026-0006', date: '2026-04-08', supplier: 'บ.ซาโนฟี่-อเวนตีส จำกัด', items: 12, total: 312000.00, status: 'ยกเลิก' },
];

export const DEMO_DISPENSE = [
  { id: 'DIS-2026-001', date: '2026-04-10', department: 'ER ฉุกเฉิน', patient: 'นายสมชาย ใจดี', items: 3, status: 'จ่ายแล้ว' },
  { id: 'DIS-2026-002', date: '2026-04-10', department: 'OPD ผู้ป่วยนอก', patient: 'นางสมศรี รักสุข', items: 5, status: 'จ่ายแล้ว' },
  { id: 'DIS-2026-003', date: '2026-04-09', department: 'IPD ผู้ป่วยใน', patient: 'น.ส.วิภาดา สุขใจ', items: 8, status: 'รอจ่าย' },
  { id: 'DIS-2026-004', date: '2026-04-09', department: 'OR ห้องผ่าตัด', patient: 'นายวิชัย มั่นคง', items: 12, status: 'จ่ายแล้ว' },
  { id: 'DIS-2026-005', date: '2026-04-08', department: 'OPD ผู้ป่วยนอก', patient: 'นางอรุณ แสงทอง', items: 2, status: 'จ่ายแล้ว' },
];

export const DEMO_REQUISITION = [
  { id: 'REQ-2026-001', date: '2026-04-10', department: 'ER ฉุกเฉิน', priority: 'ด่วน', items: 10, status: 'อนุมัติแล้ว' },
  { id: 'REQ-2026-002', date: '2026-04-09', department: 'OPD ผู้ป่วยนอก', priority: 'ปกติ', items: 25, status: 'รออนุมัติ' },
  { id: 'REQ-2026-003', date: '2026-04-08', department: 'IPD ผู้ป่วยใน', priority: 'ปกติ', items: 15, status: 'จ่ายแล้ว' },
  { id: 'REQ-2026-004', date: '2026-04-07', department: 'OR ห้องผ่าตัด', priority: 'ด่วนมาก', items: 8, status: 'อนุมัติแล้ว' },
  { id: 'REQ-2026-005', date: '2026-04-06', department: 'ทันตกรรม', priority: 'ปกติ', items: 5, status: 'รออนุมัติ' },
];

export const DEMO_CHART_PURCHASE = [
  { month: 'ม.ค.', amount: 450000 },
  { month: 'ก.พ.', amount: 520000 },
  { month: 'มี.ค.', amount: 480000 },
  { month: 'เม.ย.', amount: 610000 },
  { month: 'พ.ค.', amount: 590000 },
  { month: 'มิ.ย.', amount: 650000 },
];

export const DEMO_CHART_CATEGORIES = [
  { name: 'ยาสามัญ', value: 45 },
  { name: 'ยาปฏิชีวนะ', value: 25 },
  { name: 'เวชภัณฑ์', value: 20 },
  { name: 'ยาเสพติด', value: 5 },
  { name: 'อื่นๆ', value: 5 },
];

// Helper: try to fetch from backend, fall back to demo data  
const API_BASE = 'http://localhost:3000/api';

export async function fetchWithFallback<T>(endpoint: string, demoData: T[]): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    console.log(`⚡ Demo Mode: Using sample data for ${endpoint}`);
    return demoData;
  }
}
