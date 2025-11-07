// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import SignUp from "@/pages/SignUp";
import Login
 from "@/pages/Login"; 
import CalculatorPage from "@/pages/Calculator";
import StudentDashboard from "./pages/StudentDashboard";
import RequestInstructor from "./pages/RequestInstructor";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import ClassroomsList from "./pages/instructor/ClassroomsList";
import ClassroomDetail from "./pages/instructor/ClassroomDetail";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/instructor/request" element={<RequestInstructor />} />

      {/* Instructor area */}
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/instructor/classrooms" element={<ClassroomsList />} />
        <Route path="/instructor/classrooms/:classId" element={<ClassroomDetail />} />


        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
