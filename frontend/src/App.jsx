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
import AdminUser from './components/AdminUser'
import EditUser from './components/EditUser'
import ViewUser from './components/ViewUser'
import CreateUser from './components/CreateUser'
import HomePage from './components/HomePage'
import PreventSignIn from './components/PreventSignIn'
export default function App() {
  return (
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/users/sign_in" element={ <PreventSignIn><SignInPage /></PreventSignIn>  }/>  
    <Route path="/users/sign_up" element={ <PreventSignIn><SignUpPage /></PreventSignIn>  }/>  
    <Route element={<AppLayout />}>
    <Route path="/users_dashboard" element={<UsersDashboard />} />
    <Route path="/tasks/new" element={<NewTaskPage />} />
    <Route path="/tasks/:id" element={<TaskDetail />}/>
    <Route path="/tasks/assigned" element={<TaskAssigned/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/users/sign_in" replace />} />
    <Route path="/admin/login" element={<PreventSignIn><AdminLoginPage /></PreventSignIn>} />
    <Route path="/admin" element={<AdminDashboard/>}/>
    <Route path="/admin/users" element={<AdminUser />} />
    <Route path="/admin/users/:id/edit" element={<EditUser/>}/>
    <Route path="/admin/users/:id" element={<ViewUser/>} />
    <Route path='/admin/users/new'element={<CreateUser/>}/>
    </Routes>
  )
}
