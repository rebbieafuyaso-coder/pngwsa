import { Route, Routes } from 'react-router-dom'
import AppLayout from '../layout/AppLayout';
/*
  All pages goes under here
*/
import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';
import AboutPage from '../pages/AboutPage';
import MembersPage from '../pages/MembersPage';
import CommingSoon from '../pages/CommingSoon';
import ContactPage from '../pages/ContactPage';
import EventDetailsModal from '../components/EventDetailsModal';
import BlogDetails from '../components/BlogDetails';


export default function AppRoutes() {
  return(
    <>
      <Routes>
        <Route path='/' element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        } />
        <Route path='/about' element={
          <AppLayout>
            <AboutPage />
          </AppLayout>
        } />
        <Route path='/members' element={
          <AppLayout>
            <MembersPage />
          </AppLayout>
        }
        />
        <Route path='/contact' element={
          <AppLayout>
            <ContactPage />
          </AppLayout>
        }
        />
        <Route path='/coming-soon' element={
          <AppLayout>
            <CommingSoon />
          </AppLayout>
        }
        />
        <Route path='*' element={
          <AppLayout>
            <NotFound />
          </AppLayout>
        } />
        <Route path='/events/:link' element={
          <AppLayout>
            <EventDetailsModal />
          </AppLayout>
        } />
        <Route path="/blogs" element={
          <AppLayout>
            <CommingSoon />
          </AppLayout>
        } />
        <Route path='/blogs/:link' element={
          <AppLayout>
            <BlogDetails />
          </AppLayout>
        } />
      </Routes>
    </>
  )
}