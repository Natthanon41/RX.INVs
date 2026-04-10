import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      // Simulate successful login and go to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-bg">
      <div className="glass-card">
        {/* Left Side: Brand Section */}
        <div className="card-half brand-section">
          <div className="brand-icon">
            Rx
          </div>
          <h1 className="brand-title">INVS Community</h1>
          <p className="brand-desc">
            สำนักงานสาธารณสุขจังหวัด...<br />
            ศูนย์ข้อมูลข่าวสารงานเภสัชกรรม<br />
            ระบบบริหารเวชภัณฑ์ และจัดการคลังยา
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="card-half">
          <h2 className="login-title">ระบบจัดซื้อและบริหารคลังเวชภัณฑ์</h2>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">ชื่อผู้ใช้งาน</label>
              <input 
                id="username"
                type="text" 
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">รหัสผ่าน</label>
              <input 
                id="password"
                type="password" 
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                เข้าสู่ระบบ
              </button>
            </div>
          </form>

          <div style={{ 
            marginTop: 'auto', 
            paddingTop: '2rem', 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span>IP: 10.188.0.163</span>
            <span>Version: 1.7.2.9 Web</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
