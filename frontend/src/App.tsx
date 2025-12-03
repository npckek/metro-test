import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Showcase from "./pages/Showcase";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Showcase />} />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Suspense
                  fallback={
                    <div className="p-10 text-center">
                      Загрузка админ-панели...
                    </div>
                  }
                >
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
