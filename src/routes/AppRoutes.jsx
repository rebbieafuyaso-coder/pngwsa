import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import AppLayout from "../layout/AppLayout";
import ScrollToTop from "../utils/ScrollToTop";

import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import MembersPage from "../pages/MembersPage";
import ContactPage from "../pages/ContactPage";
import ComingSoon from "../pages/ComingSoon";
import NotFound from "../pages/NotFound";

import EventDetailsModal from "../components/EventDetailsModal";
import BlogDetails from "../components/BlogDetails";

import AdminLogin from "../admin/AdminLogin";
import AddMembers from "../auth/AddMembers";
import AuthPage from "../auth/AuthPage";

import { AuthProvider } from "../auth/AuthContext";
import ProtectedRoute from "../routes/ProtectedRoutes";

import AdminLayout from "../admin/AdminLayout";
import Dashboard from "../admin/Dashboard";
import Events from "../admin/Events";
import Blogs from "../admin/Blogs";
import Alumni from "../admin/Alumni";
import Gallery from "../admin/Gallery";
import Members from "../admin/Members";
import Executives from "../admin/Executives";
import GalleryPage from "../pages/GalleryPage";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {/* =========================================
              PUBLIC WEBSITE
          ========================================= */}

          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/events/:link" element={<EventDetailsModal />} />
            <Route path="/blogs" element={<ComingSoon />} />
            <Route path="/blogs/:link" element={<BlogDetails />} />
            <Route path="/gallery" element={<GalleryPage />} />

            <Route path="/members/register" element={<AddMembers />} />
            <Route path="/members/login" element={<AuthPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* =========================================
              ADMIN LOGIN (no public layout wrapper)
          ========================================= */}

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* =========================================
              ADMIN PROTECTED AREA
          ========================================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="alumni" element={<Alumni />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="members" element={<Members />} />
            <Route path="executives" element={<Executives />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}