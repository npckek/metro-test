import React from 'react';
import AdminStationList from '@/components/AdminStationList';

const AdminDashboardPage: React.FC = () => {
  return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Панель Администратора</h1>
        <AdminStationList />
      </div>
  );
};

export default AdminDashboardPage;