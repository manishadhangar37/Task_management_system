import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import NewTaskPage from './pages/tasks/NewTaskPage'
import SignUpPage from './components/SignUpPage'
import SignInPage from './components/SignInPage'
import UsersDashboard from './components/UserDashboard'
import TaskDetail from './components/TaskDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/users/sign_in" element={<SignInPage />} />
      <Route path="/users/sign_up" element={<SignUpPage />} />
      <Route element={<AppLayout />}>
        <Route path="/users_dashboard" element={<UsersDashboard />} />
        <Route path="/tasks/new" element={<NewTaskPage />} />
        <Route path="/tasks/:id" element={<TaskDetail />}/>
      </Route>
      <Route path="*" element={<Navigate to="/users/sign_in" replace />} />
      
    </Routes>
  )
}
