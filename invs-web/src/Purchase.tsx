import { useEffect, useState } from 'react';
import { Search, Plus, Filter, Eye, Printer, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWithFallback, DEMO_PURCHASES } from './demoData';

interface PurchaseOrder {
  id: string;
  date: string;
  supplier: string;
  items: number;
  total: number;
  status: string;
}

function Purchase() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithFallback<PurchaseOrder>('/purchases', DEMO_PURCHASES)
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
        case 'อนุมัติแล้ว':
        case 'รับของแล้ว':
            return { bg: 'var(--primary-light)', color: 'var(--primary-hover)' };
        case 'รออนุมัติ':
        case 'สั่งซื้อแล้ว':
            return { bg: '#dbeafe', color: '#1e40af' }; // Blue
        case 'ยกเลิก':
            return { bg: '#fee2e2', color: '#b91c1c' }; // Red
        default:
            return { bg: '#f3f4f6', color: '#4b5563' }; // Gray
    }
  };

  return (
    <div className="purchase-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="welcome-title">ระบบจัดซื้อ (Purchasing)</h1>
          <p className="welcome-subtitle">จัดการใบสั่งซื้อเวชภัณฑ์และติดตามสถานะการจัดของ</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/dashboard/purchase/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> สร้างใบสั่งซื้อใหม่
        </button>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div className="table-toolbar" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="navbar-search" style={{ width: '400px', position: 'relative' }}>
            <Search size={20} className="search-icon" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="ค้นหาเลขที่บิล, ชื่อบริษัท..." 
              className="input-field" 
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '2rem' }} 
            />
          </div>
          <select className="input-field" style={{ width: 'auto', padding: '0.85rem 1.5rem 0.85rem 1rem', cursor: 'pointer' }}>
            <option value="">ทุกสถานะ</option>
            <option value="รออนุมัติ">รออนุมัติ</option>
            <option value="สั่งซื้อแล้ว">สั่งซื้อแล้ว</option>
            <option value="รับของแล้ว">รับของแล้ว</option>
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
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>เลขที่สั่งซื้อ</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>วันที่</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>บริษัท (Supplier)</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>จำนวนรายการ</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>ยอดสุทธิ (บาท)</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>สถานะ</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลดข้อมูลใบสั่งซื้อ...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>ไม่พบข้อมูลใบสั่งซื้อ</td>
                </tr>
              ) : (
                orders.map(order => {
                  const badge = getStatusBadgeStyle(order.status);
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{order.id}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{order.date}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{order.supplier}</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>{order.items}</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600' }}>
                        {order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '2rem', 
                          fontSize: '0.85rem', 
                          fontWeight: '600',
                          backgroundColor: badge.bg,
                          color: badge.color
                        }}>
                          {order.status}
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
                          <button className="icon-btn" style={{ color: 'var(--error)' }} title="ยกเลิกใบสั่งซื้อ">
                            <Trash2 size={18} />
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

export default Purchase;
