import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
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
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWithFallback<InventoryItem>('/inventory', DEMO_INVENTORY)
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('คุณต้องการลบรายการเวชภัณฑ์นี้ใช่หรือไม่?')) {
      try {
        const result = await fetchWithFallback('/inventory/' + id, [], { 
          method: 'DELETE' 
        });
        
        if (result.status === 'success') {
          setItems(prev => prev.filter(item => item.id !== id));
          alert('ลบรายการสำเร็จ');
        } else {
          throw new Error(result.message || 'Delete failed');
        }
      } catch (err: any) {
        alert('เกิดข้อผิดพลาด: ' + err.message);
      }
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem({ ...item });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    try {
      const result = await fetchWithFallback('/inventory/' + editingItem.id, [], {
        method: 'PUT',
        body: JSON.stringify({
          name: editingItem.name,
          category: editingItem.category,
          quantity: editingItem.quantity,
          unit: editingItem.unit
        })
      });

      if (result.status === 'success') {
        setItems(prev => prev.map(item => 
          item.id === editingItem.id ? { ...editingItem, status: editingItem.quantity > 100 ? 'ปกติ' : 'ใกล้หมด' } : item
        ));
        setEditingItem(null);
        alert('แก้ไขรายการสำเร็จ');
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (err: any) {
      alert('เกิดข้อผิดพลาด: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inventory-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="welcome-title">ระบบบริหารคลังเวชภัณฑ์</h1>
          <p className="welcome-subtitle">จัดการรายการยาและเวชภัณฑ์ทั้งหมดในคลัง</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('ฟีเจอร์ "เพิ่มรายการใหม่" กำลังพัฒนาใน Phase ถัดไป')}>
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
                        <button className="icon-btn" style={{ color: 'var(--secondary)' }} title="แก้ไข" onClick={() => handleEdit(item)}>
                          <Edit size={18} />
                        </button>
                        <button 
                          className="icon-btn" 
                          style={{ color: 'var(--error)' }} 
                          title="ลบ"
                          onClick={() => handleDelete(item.id)}
                        >
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

      {/* Edit Modal */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ width: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setEditingItem(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>แก้ไขรายการเวชภัณฑ์</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">ชื่อเวชภัณฑ์</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editingItem.name} 
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">หมวดหมู่</label>
                <select 
                  className="input-field" 
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  required
                >
                  <option value="ยาสามัญ">ยาสามัญ</option>
                  <option value="ยาปฏิชีวนะ">ยาปฏิชีวนะ</option>
                  <option value="เวชภัณฑ์ทางการแพทย์">เวชภัณฑ์ทางการแพทย์</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">จำนวนคงเหลือ</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
                    required 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">หน่วย</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={editingItem.unit}
                    onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn outline-btn" onClick={() => setEditingItem(null)}>ยกเลิก</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
