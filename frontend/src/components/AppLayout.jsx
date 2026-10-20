import { Link, NavLink, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/" aria-label="Taskflow home">
          <span className="brand-mark">T</span>
          <span>taskflow</span>
        </Link>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="navigation" aria-label="Main navigation">
          <NavLink to="/tasks" end><span className="nav-icon">▦</span> All tasks</NavLink>
          <NavLink to="/tasks/new"><span className="nav-icon">＋</span> Create task</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="avatar">TM</div>
          <div><strong>Task manager</strong><span>Workspace</span></div>
          <span className="more">···</span>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Tasks</span><span className="slash">/</span><strong>New task</strong></div>
          <button className="help-button" type="button" aria-label="Help">?</button>
        </header>
        <Outlet />
      </section>
    </main>
  )
}
