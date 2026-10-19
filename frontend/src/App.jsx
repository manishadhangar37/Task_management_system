import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import NewTaskPage from './pages/tasks/NewTaskPage'
import SignUpPage from './components/SignUpPage'
import SignInPage from './components/SignInPage'

export default function App() {
  return (
    <Routes>
      <Route path="/users/sign_in" element={<SignInPage />} />
      <Route path="/users/sign_up" element={<SignUpPage />} />
      <Route element={<AppLayout />}>
        <Route path="/tasks/new" element={<NewTaskPage />} />
        <Route path="/tasks" element={<Navigate to="/tasks/new" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/users/sign_in" replace />} />
    </Routes>
  )
}
