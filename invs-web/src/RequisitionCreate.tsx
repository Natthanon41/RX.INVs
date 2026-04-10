import React, { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Send, Activity, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RequisitionItem {
  id: string; 
  productCode: string;
  productName: string;
  requestQuantity: number;
}

function RequisitionCreate() {
  const navigate = useNavigate();
  const [items, setItems] = useState<RequisitionItem[]>([]);
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState('ปกติ');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Mock product catalog for selection (simplified for wards)
  const catalog = [
    { code: '00001', name: 'Paracetamol 500mg' },
    { code: '00002', name: 'Amoxicillin 250mg' },
    { code: '00003', name: 'Vitamin C 1000mg' },
    { code: '00004', name: 'NSS 0.9% 1000ml' },
    { code: '00005', name: 'Syringe 5ml' },
    { code: '00006', name: 'Surgical Mask 3-Ply' }
  ];

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        productCode: '',
        productName: '',
        requestQuantity: 1
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof RequisitionItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Auto-fill product data when code changes
        if (field === 'productCode') {
          const selectedPrd = catalog.find(p => p.code === value);
          if (selectedPrd) {
            updated.productName = selectedPrd.name;
          } else {
            updated.productName = '';
          }
        }
        
        if (field === 'requestQuantity') {
            const qty = Number(value);
            if (qty < 1) {
                updated.requestQuantity = 1;
            }
        }

        return updated;
      }
      return item;
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) {
      alert("กรุณาเลือกหรือกรอกชื่อหน่วยงานที่ขอเบิก");
      return;
    }
    if (items.length === 0) {
      alert("กรุณาเพิ่มรายการเวชภัณฑ์ที่ต้องการเบิกอย่างน้อย 1 รายการ");
      return;
    }
    const hasInvalid = items.some(i => i.productCode === '' || i.requestQuantity <= 0);
    if(hasInvalid) {
        alert("กรุณาเลือกเวชภัณฑ์ให้ครบในทุกแถวที่เพิ่มมา");
        return;
    }
    
    // Simulate API Save
    alert('ส่งคำขอเบิกไปยังคลังสำเร็จ! เจ้าหน้าที่จะพิจารณาและจัดของให้เร็วที่สุด');
    navigate('/dashboard/requisition');
  };

  return (
    <div className="requisition-create-page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="icon-btn" onClick={() => navigate('/dashboard/requisition')} style={{ padding: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="welcome-title">สร้างใบขอเบิกเวชภัณฑ์</h1>
          <p className="welcome-subtitle">สำหรับหน่วยงาน/ตึกผู้ป่วยใช้คีย์ขอเบิกเพื่อส่งให้คลังกลาง</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Header Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>ข้อมูลคำขอใบเบิก</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>หน่วยงานผู้เบิก <span style={{color: 'red'}}>*</span></label>
              <select className="input-field" style={{ width: '100%' }} value={department} onChange={(e) => setDepartment(e.target.value)} required>
                <option value="">-- เลือกหน่วยงานของคุณ --</option>
                <option value="ตึกผู้ป่วยใน (IPD)">ตึกผู้ป่วยใน (IPD)</option>
                <option value="ห้องฉุกเฉิน (ER)">ห้องฉุกเฉิน (ER)</option>
                <option value="คลินิกเบาหวาน">คลินิกเบาหวาน</option>
                <option value="ตึกศัลยกรรม">ตึกศัลยกรรม</option>
                <option value="ศูนย์บริการสาธารณสุข">ศูนย์บริการสาธารณสุข</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>ความเร่งด่วน <span style={{color: 'red'}}>*</span></label>
              <select className="input-field" style={{ width: '100%', borderColor: priority === 'ด่วนมาก' ? 'var(--error)' : priority === 'ด่วน' ? '#c2410c' : 'var(--border)' }} value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="ปกติ">ปกติ (Normal)</option>
                <option value="ด่วน">ด่วน (Urgent)</option>
                <option value="ด่วนมาก">ด่วนมาก (Emergency/STAT)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>วันที่ต้องการใช้</label>
              <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%' }} required />
            </div>
          </div>
        </div>

        {/* Item Selection Section */}
        <div className="card" style={{ marginBottom: '2rem', padding: '0' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-dark)' }}>รายการเวชภัณฑ์ต้องการเบิก</h2>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ระบุรายการสิ่งของที่ตึก/คลินิกต้องการขอสแนเพิ่มเติม</span>
            </div>
            <button type="button" className="btn outline-btn" onClick={handleAddItem} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem' }}>
              <Plus size={18} /> เพิ่มรายการเบิก
            </button>
          </div>
          
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>รายการเวชภัณฑ์ที่จะเบิกจากส่วนกลาง</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', width: '200px', textAlign: 'center' }}>จำนวนที่ขอเบิก <span style={{color: 'red'}}>*</span></th>
                  <th style={{ padding: '1rem', width: '60px', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Activity size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                      <p>ยังไม่มีรายการใดๆ กดปุ่ม <b>"เพิ่มรายการเบิก"</b> ด้านบนขวาเพื่อเลือกเวชภัณฑ์</p>
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
                          <option key={cat.code} value={cat.code}>
                            [{cat.code}] {cat.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <input 
                        type="number" min="1"
                        className="input-field" 
                        style={{ width: '120px', textAlign: 'center' }} 
                        placeholder="จำนวน"
                        value={item.requestQuantity}
                        onChange={(e) => updateItem(item.id, 'requestQuantity', e.target.value)}
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
          
          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border)' }}>
             <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <Info size={16} /> เมื่อทำคำสั่งเบิกเสร็จสิ้น ใบเบิกจะถูกส่งเข้าไปที่คิวง่วนของหน้าคลัง (Requisition Pool) เพื่อพิจารณาและจัดการ 
             </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingBottom: '2rem' }}>
          <button type="button" className="btn outline-btn" onClick={() => navigate('/dashboard/requisition')} style={{ borderRadius: '0.5rem' }}>
            ยกเลิกแก้ไข
          </button>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#3b82f6' }}>
            <Send size={20} /> ยืนยันและส่งคำขอไปยังคลัง
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequisitionCreate;
