import React from "react";
import AdminStationList from "@/components/AdminStationList";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Панель Администратора</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto" variant="secondary">
              Перейти на витрину
            </Button>
          </Link>

          <Button
            className="w-full sm:w-auto"
            variant="destructive"
            onClick={logout}
          >
            Выйти
          </Button>
        </div>
      </div>

      <AdminStationList />
    </div>
  );
};

export default AdminDashboardPage;
