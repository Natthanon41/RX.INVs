import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import DashboardOverview from './DashboardOverview';
import Inventory from './Inventory';
import Purchase from './Purchase';
import PurchaseCreate from './PurchaseCreate';
import Dispense from './Dispense';
import DispenseCreate from './DispenseCreate';
import Requisition from './Requisition';
import RequisitionCreate from './RequisitionCreate';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardOverview />} />
            {/* Child routes that render inside Outlet of Dashboard */}
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchase" element={<Purchase />} />
            <Route path="purchase/new" element={<PurchaseCreate />} />
            <Route path="dispense" element={<Dispense />} />
            <Route path="dispense/new" element={<DispenseCreate />} />
            <Route path="requisition" element={<Requisition />} />
            <Route path="requisition/new" element={<RequisitionCreate />} />
            {/* other routes will go here as they are built */}
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
