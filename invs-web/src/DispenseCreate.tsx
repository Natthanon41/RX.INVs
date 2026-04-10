import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DispenseItem {
  id: string; // unique row id
  productCode: string;
  productName: string;
  quantity: number;
  currentStock: number;
}

function DispenseCreate() {
  const navigate = useNavigate();
  const [items, setItems] = useState<DispenseItem[]>([]);
  const [department, setDepartment] = useState('');
  const [patient, setPatient] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Mock product inventory for selection
  const catalog = [
    { code: '00001', name: 'Paracetamol 500mg', stock: 1500 },
    { code: '00002', name: 'Amoxicillin 250mg', stock: 320 },
    { code: '00003', name: 'Vitamin C 1000mg', stock: 50 },
    { code: '00004', name: 'NSS 0.9% 1000ml', stock: 12 },
  ];

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        productCode: '',
        productName: '',
        quantity: 1,
        currentStock: 0
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof DispenseItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Auto-fill product data when code changes
        if (field === 'productCode') {
          const selectedPrd = catalog.find(p => p.code === value);
          if (selectedPrd) {
            updated.productName = selectedPrd.name;
            updated.currentStock = selectedPrd.stock;
          } else {
            updated.productName = '';
            updated.currentStock = 0;
          }
          // Reset quantity if it exceeds new stock limit
          if (updated.quantity > updated.currentStock) {
              updated.quantity = updated.currentStock;
          }
        }

        // Validate quantity
        if (field === 'quantity') {
            const qty = Number(value);
            if (qty > updated.currentStock) {
                alert(`ระบุจำนวนเกินที่มีในคลัง! (คงเหลือเพียว ${updated.currentStock})`);
                updated.quantity = updated.currentStock;
            } else if (qty < 1) {
                updated.quantity = 1;
            }
        }

        return updated;
      }
      return item;
    }));
  };

  const totalItemsDispensed = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) {
      alert("กรุณาเลือกหน่วยงาน / ตึกผู้ป่วยที่มาเบิก");
      return;
    }
    if (items.length === 0) {
      alert("กรุณาเพิ่มรายการยาอย่างน้อย 1 รายการ");
      return;
    }
    const hasInvalid = items.some(i => i.productCode === '' || i.quantity <= 0);
    if(hasInvalid) {
        alert("กรุณาตรวจสอบรายการให้ครบถ้วน");
        return;
    }
    
    // Simulate API Save
    alert('บันทึกการตัดจ่ายสำเร็จ!');
    navigate('/dashboard/dispense');
  };

  return (
    <div className="dispense-create-page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="icon-btn" onClick={() => navigate('/dashboard/dispense')} style={{ padding: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="welcome-title">แบบฟอร์มบันทึกการจ่ายเวชภัณฑ์</h1>
          <p className="welcome-subtitle">สำหรับตัดสต๊อกและกระจายไปยังแผนกต่างๆ</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Header Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>ข้อมูลเอกสารผู้ขอเบิก</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>หน่วยงานผู้เบิก <span style={{color: 'red'}}>*</span></label>
              <select className="input-field" style={{ width: '100%' }} value={department} onChange={(e) => setDepartment(e.target.value)} required>
                <option value="">-- เลือกภาควิชา/ตึกผู้ป่วย --</option>
                <option value="ตึกผู้ป่วยใน (IPD)">ตึกผู้ป่วยใน (IPD)</option>
                <option value="ห้องฉุกเฉิน (ER)">ห้องฉุกเฉิน (ER)</option>
                <option value="คลินิกเบาหวาน">คลินิกเบาหวาน</option>
                <option value="ตึกศัลยกรรม">ตึกศัลยกรรม</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>ชื่อผู้ป่วย (กรณีสั่งจ่ายเฉพาะราย)</label>
              <input type="text" className="input-field" value={patient} onChange={(e) => setPatient(e.target.value)} placeholder="เช่น นายสมชาย รักดี" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>วันที่จ่าย</label>
              <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%' }} required />
            </div>
          </div>
        </div>

        {/* Item Selection Section */}
        <div className="card" style={{ marginBottom: '2rem', padding: '0' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-dark)' }}>รายการเวชภัณฑ์ที่อนุญาตให้จ่าย</h2>
            <button type="button" className="btn outline-btn" onClick={handleAddItem} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem' }}>
              <Plus size={18} /> เพิ่มแถวรายการ
            </button>
          </div>
          
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>รายการเวชภัณฑ์</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', width: '150px', textAlign: 'center' }}>ยอดคงเหลือในคลัง</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', width: '150px', textAlign: 'center' }}>จำนวนที่จ่าย <span style={{color: 'red'}}>*</span></th>
                  <th style={{ padding: '1rem', width: '60px', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <AlertCircle size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                      <p>ยังไม่มีรายการ กรุณากดปุ่ม <b>"เพิ่มแถวรายการ"</b> ด้านบนขวา</p>
                    </td>
                  </tr>
                ) : items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        className="input-field" style={{ width: '100%' }}
                        value={item.productCode}
                        onChange={(e) => updateItem(item.id, 'productCode', e.target.value)}
                        required
                      >
                        <option value="">-- เลือกเวชภัณฑ์ --</option>
                        {catalog.map(cat => (
                          <option key={cat.code} value={cat.code} disabled={cat.stock <= 0}>
                            [{cat.code}] {cat.name} {cat.stock <= 0 ? '(ของหมด)' : ''}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ 
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '1rem',
                          backgroundColor: item.currentStock > 100 ? '#dcfce7' : (item.currentStock > 0 ? '#fef08a' : '#fee2e2'),
                          color: item.currentStock > 100 ? '#166534' : (item.currentStock > 0 ? '#854d0e' : '#991b1b'),
                          fontWeight: '600'
                      }}>
                          {item.productCode ? item.currentStock.toLocaleString() : '-'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <input 
                        type="number" min="1" max={item.currentStock || 1} 
                        className="input-field" 
                        style={{ width: '100px', textAlign: 'center', border: item.quantity >= item.currentStock ? '1px solid var(--error)' : '1px solid var(--border)' }} 
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        disabled={!item.productCode}
                        required
                      />
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button type="button" className="icon-btn" style={{ color: 'var(--error)' }} onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer Validation Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', backgroundColor: '#fafafa', borderTop: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} /> ระบบจะป้องกันการจ่ายเกินสต๊อกที่มีอยู่
            </div>
            <div style={{ fontSize: '1.1rem' }}>
              รวมจำนวนชิ้นที่จ่ายออก: <span style={{ fontWeight: '700', color: 'var(--primary-hover)', fontSize: '1.5rem', marginLeft: '0.5rem' }}>{totalItemsDispensed.toLocaleString()}</span> ชิ้น
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingBottom: '2rem' }}>
          <button type="button" className="btn outline-btn" onClick={() => navigate('/dashboard/dispense')} style={{ borderRadius: '0.5rem' }}>
            ยกเลิก
          </button>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} /> ยืนยันการตัดจ่าย
          </button>
        </div>
      </form>
    </div>
  );
}

export default DispenseCreate;
