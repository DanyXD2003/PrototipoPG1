import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'
import StudentLayout from '../components/layout/StudentLayout'
import LearningLayout from '../components/layout/LearningLayout'
import { useAuth } from '../context/auth'
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
import StudentDashboardPage from '../pages/student/StudentDashboardPage'
import MyCoursesPage from '../pages/student/MyCoursesPage'
import MyCertificatesPage from '../pages/student/MyCertificatesPage'
import CourseBlockMapPage from '../pages/student/CourseBlockMapPage'
import BlockViewPage from '../pages/student/BlockViewPage'
import UnitPlayerPage from '../pages/student/UnitPlayerPage'
import BlockExamPage from '../pages/student/BlockExamPage'
import BlockResultsPage from '../pages/student/BlockResultsPage'
import BlockRetryPage from '../pages/student/BlockRetryPage'
import BlockLockedPage from '../pages/student/BlockLockedPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function Router() {
  return (
    <Routes>
      {/* Rutas públicas — Navbar flotante + Footer */}
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

      {/* Rutas del estudiante — StudentLayout gestiona su propio Navbar (sin Footer) */}
      <Route path="/dashboard" element={<StudentLayout><StudentDashboardPage /></StudentLayout>} />
      <Route path="/mis-cursos" element={<StudentLayout><MyCoursesPage /></StudentLayout>} />
      <Route path="/mis-certificados" element={<StudentLayout><MyCertificatesPage /></StudentLayout>} />

      {/* Rutas de aprendizaje — LearningLayout (pantalla completa, sin Navbar flotante) */}
      <Route element={<LearningLayout />}>
        <Route path="/aprendizaje/:cursoSlug" element={<CourseBlockMapPage />} />
        <Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId" element={<BlockViewPage />} />
        <Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/unidad/:unidadId" element={<UnitPlayerPage />} />
        <Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/examen" element={<BlockExamPage />} />
        <Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/resultados" element={<BlockResultsPage />} />
        <Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/reintentar" element={<BlockRetryPage />} />
        <Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/bloqueado" element={<BlockLockedPage />} />
      </Route>

      {/* Rutas de autenticación — AuthLayout (dos paneles, sin Footer) */}
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