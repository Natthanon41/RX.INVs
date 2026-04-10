import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PurchaseItem {
  id: string; // unique row id
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

function PurchaseCreate() {
  const navigate = useNavigate();
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [discount, setDiscount] = useState(0);

  // Mock product catalog for selection
  const catalog = [
    { code: '00001', name: 'Paracetamol 500mg', defaultPrice: 0.5 },
    { code: '00002', name: 'Amoxicillin 250mg', defaultPrice: 2.0 },
    { code: '00003', name: 'Vitamin C 1000mg', defaultPrice: 1.5 },
    { code: '00004', name: 'NSS 0.9% 1000ml', defaultPrice: 45.0 },
  ];

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        productCode: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof PurchaseItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Auto-fill product name & price when product code is selected
        if (field === 'productCode') {
          const selectedPrd = catalog.find(p => p.code === value);
          if (selectedPrd) {
            updated.productName = selectedPrd.name;
            updated.unitPrice = selectedPrd.defaultPrice;
          } else {
            updated.productName = '';
            updated.unitPrice = 0;
          }
        }

        // recalculate row total
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalAfterDiscount = subtotal - discount;
  const vat = totalAfterDiscount * 0.07;
  const grandTotal = totalAfterDiscount + vat;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) {
      alert("กรุณาเลือกผู้จัดจำหน่าย");
      return;
    }
    if (items.length === 0) {
      alert("กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ");
      return;
    }
    // Simulate API Save
    alert('บันทึกใบสั่งซื้อสำเร็จ!');
    navigate('/dashboard/purchase');
  };

  return (
    <div className="purchase-create-page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="icon-btn" onClick={() => navigate('/dashboard/purchase')} style={{ padding: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="welcome-title">สร้างใบสั่งซื้อใหม่</h1>
          <p className="welcome-subtitle">แบบฟอร์มเปิดเอกสารจัดซื้อนำเข้าเวชภัณฑ์</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Header Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>ข้อมูลเอกสาร</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>พนักงานจัดซื้อ</label>
              <input type="text" className="input-field" value="Admin (ผู้ดูแลระบบ)" disabled style={{ width: '100%', backgroundColor: '#f3f4f6' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>เลือกบริษัท (Supplier) <span style={{color: 'red'}}>*</span></label>
              <select className="input-field" style={{ width: '100%' }} value={supplier} onChange={(e) => setSupplier(e.target.value)} required>
                <option value="">-- เลือกผู้จัดจำหน่าย --</option>
                <option value="องค์การเภสัชกรรม">องค์การเภสัชกรรม</option>
                <option value="บจ. ซิลลิค ฟาร์มา">บจ. ซิลลิค ฟาร์มา</option>
                <option value="บจ. ไบโอฟาร์ม">บจ. ไบโอฟาร์ม</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-muted)' }}>วันที่สั่งซื้อ</label>
              <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Item Selection Section */}
        <div className="card" style={{ marginBottom: '2rem', padding: '0' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-dark)' }}>รายการเวชภัณฑ์</h2>
            <button type="button" className="btn outline-btn" onClick={handleAddItem} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem' }}>
              <Plus size={18} /> เพิ่มแถวรายการ
            </button>
          </div>
          
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>รหัส/ชื่อสินค้า</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', width: '100px' }}>จำนวน</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', width: '120px' }}>ราคา/หน่วย</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600', width: '150px', textAlign: 'right' }}>จำนวนเงิน</th>
                  <th style={{ padding: '1rem', width: '60px', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>ยังไม่มีรายการสินค้า กรุณากดปุ่มเพิ่มแถวรายการ</td>
                  </tr>
                ) : items.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        className="input-field" style={{ width: '100%' }}
                        value={item.productCode}
                        onChange={(e) => updateItem(item.id, 'productCode', e.target.value)}
                        required
                      >
                        <option value="">-- เลือกรายการ --</option>
                        {catalog.map(cat => (
                          <option key={cat.code} value={cat.code}>[{cat.code}] {cat.name}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <input 
                        type="number" min="1" className="input-field" style={{ width: '100%' }} 
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        required
                      />
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <input 
                        type="number" min="0" step="0.01" className="input-field" style={{ width: '100%' }} 
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                        required
                      />
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>
                      {item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          
          {/* Calculation Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1.5rem', backgroundColor: '#fafafa', borderTop: '1px solid var(--border)' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>รวมเป็นเงิน (Subtotal):</span>
                <span style={{ fontWeight: '500' }}>{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>ส่วนลด (Discount):</span>
                <input 
                  type="number" className="input-field" style={{ width: '100px', textAlign: 'right', padding: '0.25rem 0.5rem' }} 
                  value={discount} onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                <span style={{ fontWeight: '500' }}>{vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--border)', fontSize: '1.25rem' }}>
                <span style={{ fontWeight: '600' }}>ยอดสุทธิรวม:</span>
                <span style={{ fontWeight: '700', color: 'var(--primary-hover)' }}>{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingBottom: '2rem' }}>
          <button type="button" className="btn outline-btn" onClick={() => navigate('/dashboard/purchase')} style={{ borderRadius: '0.5rem' }}>
            ยกเลิก
          </button>
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} /> บันทึกและขออนุมัติ
          </button>
        </div>
      </form>
    </div>
  );
}

export default PurchaseCreate;
