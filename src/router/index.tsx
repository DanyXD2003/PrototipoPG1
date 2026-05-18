import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import LandingPage from '../pages/public/LandingPage'
import CourseCatalogPage from '../pages/public/CourseCatalogPage'
import CourseSearchPage from '../pages/public/CourseSearchPage'
import CourseDetailPage from '../pages/public/CourseDetailPage'
import OrgCatalogPage from '../pages/public/OrgCatalogPage'
import OrgProfilePage from '../pages/public/OrgProfilePage'
import OrgCoursesPage from '../pages/public/OrgCoursesPage'
import InstructorsCatalogPage from '../pages/public/InstructorsCatalogPage'
import InstructorProfilePage from '../pages/public/InstructorProfilePage'
import NotFoundPage from '../pages/public/NotFoundPage'

export default function Router() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cursos" element={<CourseCatalogPage />} />
        <Route path="/cursos/buscar" element={<CourseSearchPage />} />
        <Route path="/cursos/:slug" element={<CourseDetailPage />} />
        <Route path="/org" element={<OrgCatalogPage />} />
        <Route path="/org/:slug" element={<OrgProfilePage />} />
        <Route path="/org/:slug/cursos" element={<OrgCoursesPage />} />
        <Route path="/instructores" element={<InstructorsCatalogPage />} />
        <Route path="/instructor/:slug" element={<InstructorProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}