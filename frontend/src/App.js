import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing         from './pages/Landing';
import Login           from './pages/Login';
import Register        from './pages/Register';
import ActivateAccount from './pages/ActivateAccount';
import AdminDashboard  from './pages/AdminDashboard';
import UploadStudents  from './pages/UploadStudents';
import AssignStudents  from './pages/AssignStudents';
import ManageCounsellors from './pages/ManageCounsellors';
import StudentDetails  from './pages/StudentDetails';
import CounsellorDashboard from './pages/CounsellorDashboard';

function Guard({ children, role }) {
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) return <Navigate to="/login" replace />;
  if (role && user.role !== role)
    return <Navigate to={user.role === 'admin' ? '/admin' : '/counsellor'} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/activate"  element={<ActivateAccount />} />

        {/* Admin */}
        <Route path="/admin"              element={<Guard role="admin"><AdminDashboard /></Guard>} />
        <Route path="/admin/upload"       element={<Guard role="admin"><UploadStudents /></Guard>} />
        <Route path="/admin/assign"       element={<Guard role="admin"><AssignStudents /></Guard>} />
        <Route path="/admin/counsellors"  element={<Guard role="admin"><ManageCounsellors /></Guard>} />
        <Route path="/admin/students/:id" element={<Guard role="admin"><StudentDetails /></Guard>} />

        {/* Counsellor */}
        <Route path="/counsellor"             element={<Guard role="counsellor"><CounsellorDashboard /></Guard>} />
        <Route path="/counsellor/students/:id" element={<Guard role="counsellor"><StudentDetails /></Guard>} />
      </Routes>
    </BrowserRouter>
  );
}
