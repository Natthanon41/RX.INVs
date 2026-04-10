import { useEffect, useState } from 'react';
import { Search, Plus, Filter, Eye, Printer, FileX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWithFallback, DEMO_DISPENSE } from './demoData';

interface DispenseRecord {
  id: string;
  date: string;
  department: string;
  patient: string;
  items: number;
  status: string;
}

function Dispense() {
  const [records, setRecords] = useState<DispenseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithFallback<DispenseRecord>('/dispense', DEMO_DISPENSE)
      .then(data => {
        setRecords(data);
        setLoading(false);
      });
  }, []);

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
        case 'จ่ายแล้ว':
        case 'อนุมัติจ่าย':
            return { bg: 'var(--primary-light)', color: 'var(--primary-hover)' };
        case 'รอยืนยันรับ':
        case 'รอตรวจสอบ':
            return { bg: '#fef08a', color: '#854d0e' }; // Yellow
        case 'ยกเลิก':
            return { bg: '#fee2e2', color: '#b91c1c' }; // Red
        default:
            return { bg: '#f3f4f6', color: '#4b5563' }; // Gray
    }
  };

  return (
    <div className="dispense-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="welcome-title">ระบบจ่าย (Dispensing)</h1>
          <p className="welcome-subtitle">ประวัติและสถานะการจ่ายเวชภัณฑ์ออกจากระบบคลัง</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/dashboard/dispense/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> เปิดบิลจ่ายเวชภัณฑ์
        </button>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div className="table-toolbar" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="navbar-search" style={{ width: '400px', position: 'relative' }}>
            <Search size={20} className="search-icon" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="ค้นหาเลขที่บิล, ชื่อหน่วยงาน, ผู้ป่วย..." 
              className="input-field" 
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '2rem' }} 
            />
          </div>
          <select className="input-field" style={{ width: 'auto', padding: '0.85rem 1.5rem 0.85rem 1rem', cursor: 'pointer' }}>
            <option value="">ทุกสถานะ</option>
            <option value="รอตรวจสอบ">รอตรวจสอบ</option>
            <option value="อนุมัติจ่าย">อนุมัติจ่าย</option>
            <option value="รอยืนยันรับ">รอยืนยันรับ</option>
            <option value="จ่ายแล้ว">จ่ายแล้ว</option>
            <option value="ยกเลิก">ยกเลิก</option>
          </select>
          <button className="btn outline-btn" style={{ marginLeft: 'auto', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> ตัวกรองขั้นสูง
          </button>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>เลขที่การจ่าย</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>วันที่ประทับ</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>หน่วยงาน/ตึกผู้ป่วยเบิก</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>ผู้ป่วย (ถ้ามี)</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>จำนวน</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>สถานะ</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลดข้อมูลประวัติการจ่าย...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>ไม่พบข้อมูลประวัติ</td>
                </tr>
              ) : (
                records.map(record => {
                  const badge = getStatusBadgeStyle(record.status);
                  return (
                    <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{record.id}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{record.date}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{record.department}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{record.patient}</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>{record.items} รายการ</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '2rem', 
                          fontSize: '0.85rem', 
                          fontWeight: '600',
                          backgroundColor: badge.bg,
                          color: badge.color
                        }}>
                          {record.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button className="icon-btn" style={{ color: 'var(--secondary)' }} title="ตรวจสอบ/ดูรายละเอียด">
                            <Eye size={18} />
                          </button>
                          <button className="icon-btn" style={{ color: '#1e40af' }} title="พิมพ์เอกสาร">
                            <Printer size={18} />
                          </button>
                          <button className="icon-btn" style={{ color: 'var(--error)' }} title="ยกเลิกการจ่าย">
                            <FileX size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dispense;
