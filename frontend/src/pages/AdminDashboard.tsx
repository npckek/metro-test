import React from 'react';
import { Card } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Панель Управления Станциями</h1>
      <Card className="p-6">
        <p>Здесь будет интерфейс для создания, редактирования и удаления станций.</p>
      </Card>
    </div>
  );
};

export default AdminDashboard;