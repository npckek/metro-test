import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StationShowcase from './components/StationList';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Публичная Витрина */}
        <Route path="/" element={<StationShowcase />} /> 

        {/* Страница Входа */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Защищенная Админ-панель */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;