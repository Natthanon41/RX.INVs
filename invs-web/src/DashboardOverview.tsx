import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, Package, ShoppingCart, Users } from 'lucide-react';
import { DEMO_CHART_PURCHASE, DEMO_CHART_CATEGORIES } from './demoData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function DashboardOverview() {
  const stats = [
    { label: 'มูลค่าสต๊อกรวม', value: '2.4M', icon: <Package size={24} />, color: 'var(--primary)' },
    { label: 'ใบสั่งซื้อรอดำเนินการ', value: '12', icon: <ShoppingCart size={24} />, color: '#f59e0b' },
    { label: 'ผู้รับบริการวันนี้', value: '145', icon: <Users size={24} />, color: '#10b981' },
    { label: 'อัตราจ่ายยา', value: '+12%', icon: <TrendingUp size={24} />, color: '#6366f1' },
  ];

  return (
    <div className="dashboard-overview">
      <h1 className="welcome-title">ยินดีต้อนรับสู่ระบบ RX.INVs</h1>
      <p className="welcome-subtitle">สรุปข้อมูลภาพรวมของคลังเวชภัณฑ์วันนี้</p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-dark)' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Bar Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>ยอดการจัดซื้อย้อนหลัง 6 เดือน</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={DEMO_CHART_PURCHASE}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`฿${value.toLocaleString()}`, 'ยอดซื้อ']}
                />
                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>สัดส่วนประเภทเวชภัณฑ์</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={DEMO_CHART_CATEGORIES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DEMO_CHART_CATEGORIES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`, 'สัดส่วน']} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
