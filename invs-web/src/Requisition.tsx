import { useEffect, useState } from 'react';
import { Search, Plus, Filter, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RequisitionRecord {
  id: string;
  date: string;
  department: string;
  priority: string;
  items: number;
  status: string;
}

function Requisition() {
  const [records, setRecords] = useState<RequisitionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/requisition')
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching requisition records:', err);
        setLoading(false);
      });
  }, []);

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
        case 'จัดเตรียมเสร็จสิ้น':
            return { bg: 'var(--primary-light)', color: 'var(--primary-hover)' };
        case 'รอจัดของ':
            return { bg: '#dbeafe', color: '#1e40af' }; // Blue
        case 'รออนุมัติ':
            return { bg: '#fef08a', color: '#854d0e' }; // Yellow
        case 'ยกเลิกคำขอ':
            return { bg: '#fee2e2', color: '#b91c1c' }; // Red
        default:
            return { bg: '#f3f4f6', color: '#4b5563' }; // Gray
    }
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch(priority) {
      case 'ด่วนมาก':
        return { color: '#b91c1c', fontWeight: 'bold' };
      case 'ด่วน':
        return { color: '#c2410c', fontWeight: '600' };
      default:
        return { color: 'var(--text-muted)' };
    }
  };

  return (
    <div className="requisition-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="welcome-title">ระบบเบิก (Requisition)</h1>
          <p className="welcome-subtitle">รายการร้องขอเบิกเวชภัณฑ์จากตึกผู้ป่วยและคลินิกต่างๆ</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/dashboard/requisition/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> สร้างใบขอเบิก
        </button>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div className="table-toolbar" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="navbar-search" style={{ width: '400px', position: 'relative' }}>
            <Search size={20} className="search-icon" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="ค้นหาเลขที่ใบเบิก, ชื่อหน่วยงานเบิก..." 
              className="input-field" 
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '2rem' }} 
            />
          </div>
          <select className="input-field" style={{ width: 'auto', padding: '0.85rem 1.5rem 0.85rem 1rem', cursor: 'pointer' }}>
            <option value="">ทุกสถานะ</option>
            <option value="รออนุมัติ">รออนุมัติ (Pending)</option>
            <option value="รอจัดของ">รอจัดของ (Approved)</option>
            <option value="จัดเตรียมเสร็จสิ้น">จัดเตรียมเสร็จสิ้น (Ready)</option>
          </select>
          <button className="btn outline-btn" style={{ marginLeft: 'auto', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> ตัวกรอง
          </button>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>เลขที่ใบเบิก</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>วันที่ส่งคำขอ</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>หน่วยงานขอเบิก</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>ความเร่งด่วน</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>รายการเบิก</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>สถานะคลัง</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>จัดการ (คลัง)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลดคำขอเบิกจากระบบ...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>ไม่มีรายการขอเบิกที่ค้างอยู่</td>
                </tr>
              ) : (
                records.map(record => {
                  const badge = getStatusBadgeStyle(record.status);
                  const priorityStyle = getPriorityBadgeStyle(record.priority);
                  return (
                    <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{record.id}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{record.date}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{record.department}</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center', ...priorityStyle }}>
                        {record.priority}
                      </td>
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
                          <button className="icon-btn" style={{ color: 'var(--secondary)' }} title="ดูรายละเอียดใบเบิก">
                            <FileText size={18} />
                          </button>
                          {record.status === 'รออนุมัติ' && (
                            <>
                              <button className="icon-btn" style={{ color: 'var(--primary-hover)' }} title="อนุมัติให้จัดของ">
                                <CheckCircle size={18} />
                              </button>
                              <button className="icon-btn" style={{ color: 'var(--error)' }} title="ไม่อนุมัติ (ตีกลับ)">
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          {record.status === 'รอจัดของ' && (
                            <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }} onClick={() => navigate('/dashboard/dispense/new')}>
                              ตัดจ่ายของ
                            </button>
                          )}
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

export default Requisition;
