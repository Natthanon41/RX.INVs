import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { fetchWithFallback, DEMO_INVENTORY } from './demoData';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
}

function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithFallback<InventoryItem>('/inventory', DEMO_INVENTORY)
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="inventory-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="welcome-title">ระบบบริหารคลังเวชภัณฑ์</h1>
          <p className="welcome-subtitle">จัดการรายการยาและเวชภัณฑ์ทั้งหมดในคลัง</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} /> เพิ่มรายการใหม่
        </button>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div className="table-toolbar" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="navbar-search" style={{ width: '400px', position: 'relative' }}>
            <Search size={20} className="search-icon" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="ค้นหารหัส, ชื่อยา, หมวดหมู่..." 
              className="input-field" 
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: '2rem' }} 
            />
          </div>
          <select className="input-field" style={{ width: 'auto', padding: '0.85rem 1.5rem 0.85rem 1rem', cursor: 'pointer' }}>
            <option value="">ทุกหมวดหมู่</option>
            <option value="ยาสามัญ">ยาสามัญ</option>
            <option value="ยาปฏิชีวนะ">ยาปฏิชีวนะ</option>
            <option value="เวชภัณฑ์ทางการแพทย์">เวชภัณฑ์ทางการแพทย์</option>
          </select>
        </div>

        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>รหัส</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>ชื่อเวชภัณฑ์</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>หมวดหมู่</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>คงเหลือ</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>สถานะ</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>กำลังโหลดข้อมูล...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>ไม่พบข้อมูลรายการเวชภัณฑ์</td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>{String(item.id).padStart(5, '0')}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{item.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{item.category}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ fontWeight: '600' }}>{item.quantity.toLocaleString()}</span> <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '2rem', 
                        fontSize: '0.85rem', 
                        fontWeight: '500',
                        backgroundColor: item.status === 'ปกติ' ? 'var(--primary-light)' : '#fef08a',
                        color: item.status === 'ปกติ' ? 'var(--primary-hover)' : '#854d0e'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="icon-btn" style={{ color: 'var(--secondary)' }} title="แก้ไข">
                          <Edit size={18} />
                        </button>
                        <button className="icon-btn" style={{ color: 'var(--error)' }} title="ลบ">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
