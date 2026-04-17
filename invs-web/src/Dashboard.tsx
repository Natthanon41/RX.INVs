import { Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard,
  ShoppingCart, 
  Package, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileBarChart, 
  Briefcase, 
  Settings,
  LogOut,
  Bell,
  Search,
  UserCircle
} from 'lucide-react';

function Dashboard() {
  const menus = [
    { name: 'หน้าแรก', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'ระบบจัดซื้อ', icon: <ShoppingCart size={20} />, path: '/dashboard/purchase' },
    { name: 'ระบบคลัง', icon: <Package size={20} />, path: '/dashboard/inventory' },
    { name: 'ระบบจ่าย', icon: <ArrowUpRight size={20} />, path: '/dashboard/dispense' },
    { name: 'ระบบเบิก', icon: <ArrowDownLeft size={20} />, path: '/dashboard/requisition' },
    { name: 'รายงานสรุป', icon: <FileBarChart size={20} />, path: '/dashboard/reports' },
    { name: 'รายงานบริหาร', icon: <Briefcase size={20} />, path: '/dashboard/management-reports' },
    { name: 'ตั้งค่าข้อมูล', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">Rx</div>
          <div className="sidebar-brand-text">
            <strong>INVS</strong> Community
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-title">เมนูหลัก</div>
          {menus.map((menu, index) => (
            <Link key={index} to={menu.path} className="nav-item">
              <span className="nav-icon">{menu.icon}</span>
              <span className="nav-text">{menu.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <Link to="/" className="nav-item logout-btn">
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-text">ออกจากระบบ</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="navbar">
          <div className="navbar-search" style={{ position: 'relative' }}>
            <Search size={20} className="search-icon" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="ค้นหาข้อมูล..." 
              className="input-field navbar-input" 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '2rem' }}
            />
          </div>
          
          <div className="navbar-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="user-profile">
              <UserCircle size={32} className="user-avatar" />
              <div className="user-info">
                <span className="user-name">ผู้ดูแลระบบ</span>
                <span className="user-role">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="content-wrapper" style={{ padding: '2rem' }}>
          <Outlet /> {/* Renders sub-routes */}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
