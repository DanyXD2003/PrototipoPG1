import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'
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
import LoginPage from '../pages/auth/LoginPage'
import RegisterRolePage from '../pages/auth/RegisterRolePage'
import RegisterStudentPage from '../pages/auth/RegisterStudentPage'
import RegisterOrgPage from '../pages/auth/RegisterOrgPage'
import RegisterInstructorPage from '../pages/auth/RegisterInstructorPage'
import RecoverPasswordPage from '../pages/auth/RecoverPasswordPage'
import EditProfilePage from '../pages/auth/EditProfilePage'
import EditOrgPage from '../pages/auth/EditOrgPage'

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
        <Route path="/perfil/editar" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/org/configuracion" element={<ProtectedRoute><EditOrgPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterRolePage />} />
        <Route path="/registro/estudiante" element={<RegisterStudentPage />} />
        <Route path="/registro/organizacion" element={<RegisterOrgPage />} />
        <Route path="/registro/instructor" element={<RegisterInstructorPage />} />
        <Route path="/recuperar-contrasena" element={<RecoverPasswordPage />} />
      </Route>
    </Routes>
  )
}