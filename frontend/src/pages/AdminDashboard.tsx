import React from 'react';
import AdminStationList from '@/components/AdminStationList';
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Панель Администратора</h1>

        <div className="flex gap-3">
          <Link to="/">
            <Button variant="secondary">Перейти на витрину</Button>
          </Link>
          <Button variant="destructive" onClick={logout}>
            Выйти
          </Button>
        </div>
      </div>

      <AdminStationList />
    </div>
  );
};

export default AdminDashboardPage;
