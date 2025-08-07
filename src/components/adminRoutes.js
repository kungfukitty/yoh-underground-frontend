// src/routes/adminRoutes.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes: React.FC = () => {
    const isAdmin = Boolean(localStorage.getItem('isAdmin')); // Replace with real auth logic
    return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoutes;
