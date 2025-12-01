import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense } from "react";
import StationShowcase from './components/StationList';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Ленивая загрузка админ-панели
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<StationShowcase />} />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-10 text-center">Загрузка админ-панели...</div>}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
