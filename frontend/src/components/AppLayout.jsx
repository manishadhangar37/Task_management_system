import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react'
import { signOut } from '../services/auth'
import { getUser } from '../services/auth'

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const pageLabel = location.pathname === '/users_dashboard'
  ? 'My tasks'
  : location.pathname === '/tasks/new'
  ? 'New task'
  : 'Task details'
  
  async function handleLogout() {
    try {
      await signOut()
    } finally {
      navigate('/users/sign_in', { replace: true })
    }
  }
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser()
        setUser(data.user ?? data)
        console.log('Current user:', user)
        console.log('Current role:', user?.role)
      } catch (error) {
        console.error('Unable to fetch user:', error)
      }
    }

    fetchUser()
  }, [])

  
  return (
    <main className="app-shell">
    <aside className="sidebar">
    <Link className="brand" to="/users_dashboard" aria-label="Taskflow home">
    <span className="brand-mark">T</span>
    <span>taskflow</span>
    </Link>
    <div className="workspace-label">WORKSPACE</div>
    <nav className="navigation" aria-label="Main navigation">
    <NavLink to="/users_dashboard"><span className="nav-icon">▦</span> My tasks</NavLink>
    
    {user?.role !== 'developer' && (
  <NavLink to="/tasks/new">
    <span className="nav-icon">＋</span> Create task
  </NavLink>
)}
             
     <NavLink to="/tasks/assigned">Assigned Task</NavLink>
    </nav>
    <div className="sidebar-bottom">
    <div className="avatar">TM</div>
    <div><strong>Task manager</strong><span>Workspace</span></div>
    <span className="more">···</span>
    </div>
    </aside>
    
    <section className="main-area">
    <header className="topbar">
    <div className="breadcrumb"><span>Tasks</span><span className="slash">/</span><strong>{pageLabel}</strong></div>
    <div className="topbar-actions">
    <button className="help-button" type="button" aria-label="Help">?</button>
    <button className="logout-button" type="button" onClick={handleLogout}>Log out</button>
    </div>
    </header>
    <Outlet />
    </section>
    </main>
  )
}
