import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import AuthLayout from '../components/layout/AuthLayout'
import StudentLayout from '../components/layout/StudentLayout'
import LearningLayout from '../components/layout/LearningLayout'
import CreatorLayout from '../components/layout/CreatorLayout'
import TalentLayout from '../components/layout/TalentLayout'
import CreatorRoute from '../components/auth/CreatorRoute'
import TalentRoute from '../components/auth/TalentRoute'
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
import CreatorDashboardPage from '../pages/creator/CreatorDashboardPage'
import CreatorCoursesPage from '../pages/creator/CreatorCoursesPage'
import CreateCoursePage from '../pages/creator/CreateCoursePage'
import CourseBlocksPage from '../pages/creator/CourseBlocksPage'
import EditBlockPage from '../pages/creator/EditBlockPage'
import CourseUnitsPage from '../pages/creator/CourseUnitsPage'
import EditUnitPage from '../pages/creator/EditUnitPage'
import CourseEnrolledPage from '../pages/creator/CourseEnrolledPage'
import CourseCompletersPage from '../pages/creator/CourseCompletersPage'
import CourseAnalyticsPage from '../pages/creator/CourseAnalyticsPage'
import TalentSearchPage from '../pages/talent/TalentSearchPage'
import CandidateProfileRecruiterPage from '../pages/talent/CandidateProfileRecruiterPage'
import SavedCandidatesPage from '../pages/talent/SavedCandidatesPage'
import SavedSearchesPage from '../pages/talent/SavedSearchesPage'
import StudentPublicProfilePage from '../pages/public/StudentPublicProfilePage'
import NotificationsPage from '../pages/notifications/NotificationsPage'
import SettingsAccountPage from '../pages/settings/SettingsAccountPage'
import SettingsSecurityPage from '../pages/settings/SettingsSecurityPage'
import SettingsNotificationsPage from '../pages/settings/SettingsNotificationsPage'
import AdminLayout from '../components/layout/AdminLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminOrgsPage from '../pages/admin/AdminOrgsPage'
import AdminCoursesPage from '../pages/admin/AdminCoursesPage'
import AdminReportsPage from '../pages/admin/AdminReportsPage'

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
        <Route path="/perfil/:username" element={<StudentPublicProfilePage />} />
        <Route path="/org/configuracion" element={<ProtectedRoute><EditOrgPage /></ProtectedRoute>} />
        <Route path="/notificaciones" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><SettingsAccountPage /></ProtectedRoute>} />
        <Route path="/configuracion/seguridad" element={<ProtectedRoute><SettingsSecurityPage /></ProtectedRoute>} />
        <Route path="/configuracion/notificaciones" element={<ProtectedRoute><SettingsNotificationsPage /></ProtectedRoute>} />
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

      {/* Rutas del creador — CreatorLayout gestiona su propio Navbar */}
      <Route path="/creator/dashboard" element={<CreatorRoute><CreatorLayout><CreatorDashboardPage /></CreatorLayout></CreatorRoute>} />
      <Route path="/creator/cursos" element={<CreatorRoute><CreatorLayout><CreatorCoursesPage /></CreatorLayout></CreatorRoute>} />
      <Route path="/creator/cursos/nuevo" element={<CreatorRoute><CreatorLayout><CreateCoursePage /></CreatorLayout></CreatorRoute>} />
      <Route path="/creator/cursos/:courseSlug/bloques" element={<CreatorRoute><CreatorLayout><CourseBlocksPage /></CreatorLayout></CreatorRoute>} />
      <Route path="/creator/cursos/:courseSlug/bloques/:bloqueId/editar" element={<CreatorRoute><CreatorLayout><EditBlockPage /></CreatorLayout></CreatorRoute>} />
      <Route path="/creator/cursos/:courseSlug/bloques/:bloqueId/unidades" element={<CreatorRoute><CreatorLayout><CourseUnitsPage /></CreatorLayout></CreatorRoute>} />
      <Route path="/creator/cursos/:courseSlug/bloques/:bloqueId/unidades/:unidadId" element={<CreatorRoute><CreatorLayout><EditUnitPage /></CreatorLayout></CreatorRoute>} />
      <Route path="/creator/cursos/:courseSlug/inscritos" element={<CreatorRoute><CreatorLayout><CourseEnrolledPage /></CreatorLayout></CreatorRoute>} />
      <Route path="/creator/cursos/:courseSlug/completadores" element={<CreatorRoute><CreatorLayout><CourseCompletersPage /></CreatorLayout></CreatorRoute>} />
      <Route path="/creator/cursos/:courseSlug/analiticas" element={<CreatorRoute><CreatorLayout><CourseAnalyticsPage /></CreatorLayout></CreatorRoute>} />

      {/* Rutas de talento — TalentLayout (solo org) */}
      <Route path="/talent/buscar" element={<TalentRoute><TalentLayout><TalentSearchPage /></TalentLayout></TalentRoute>} />
      <Route path="/talent/candidato/:username" element={<TalentRoute><TalentLayout><CandidateProfileRecruiterPage /></TalentLayout></TalentRoute>} />
      <Route path="/talent/guardados" element={<TalentRoute><TalentLayout><SavedCandidatesPage /></TalentLayout></TalentRoute>} />
      <Route path="/talent/mis-busquedas" element={<TalentRoute><TalentLayout><SavedSearchesPage /></TalentLayout></TalentRoute>} />

      {/* Rutas de administración — AdminLayout */}
      <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
      <Route path="/admin/usuarios" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
      <Route path="/admin/organizaciones" element={<AdminLayout><AdminOrgsPage /></AdminLayout>} />
      <Route path="/admin/cursos" element={<AdminLayout><AdminCoursesPage /></AdminLayout>} />
      <Route path="/admin/reportes" element={<AdminLayout><AdminReportsPage /></AdminLayout>} />
    </Routes>
  )
}