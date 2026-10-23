import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import NewTaskPage from './pages/tasks/NewTaskPage'
import SignUpPage from './components/SignUpPage'
import SignInPage from './components/SignInPage'
import UsersDashboard from './components/UserDashboard'
import TaskDetail from './components/TaskDetail'
import TaskAssigned from './components/TaskAssigned'
import AdminDashboard from './components/AdminDashboard'
import AdminLoginPage from './components/AdminLoginPage'
export default function App() {
  return (
    <Routes>
    <Route path="/users/sign_in" element={<SignInPage />} />
    <Route path="/users/sign_up" element={<SignUpPage />} />
    <Route element={<AppLayout />}>
    <Route path="/users_dashboard" element={<UsersDashboard />} />
    <Route path="/tasks/new" element={<NewTaskPage />} />
    <Route path="/tasks/:id" element={<TaskDetail />}/>
    <Route path="/tasks/assigned" element={<TaskAssigned/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/users/sign_in" replace />} />
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin" element={<AdminDashboard/>}/>
    </Routes>
  )
}
