import { BrowserRouter, Route, Routes } from "react-router-dom";

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

import AdminLogin from "../auth/AdminLogin";
import AddMembers from "../auth/AddMembers";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>

        {/* =========================================
            PUBLIC WEBSITE
        ========================================= */}

        <Route element={<AppLayout />}>

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/about"
            element={<AboutPage />}
          />

          <Route
            path="/members"
            element={<MembersPage />}
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          <Route
            path="/coming-soon"
            element={<ComingSoon />}
          />

          <Route
            path="/events/:link"
            element={<EventDetailsModal />}
          />

          <Route
            path="/blogs"
            element={<ComingSoon />}
          />

          <Route
            path="/blogs/:link"
            element={<BlogDetails />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Route>


        {/* =========================================
            ADMIN / PRIVATE
        ========================================= */}

        <Route
          path="/private/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/members/register"
          element={
            <AppLayout>
              <AddMembers />
            </AppLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}