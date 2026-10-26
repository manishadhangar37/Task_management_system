
import './AdminDashboard.css';

export default function AdminDashboard() {
  const handleLogout = async () => {
    try {
      const csrfResponse = await fetch('/csrf_token', {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!csrfResponse.ok) {
        throw new Error('Failed to fetch CSRF token');
      }

      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrf_token;

      if (!csrfToken) {
        throw new Error('CSRF token not found in response');
      }

      const response = await fetch('/api/admin/logout', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken,
          Accept: 'application/json',
        },
      });

      if (response.ok || response.redirected) {
        window.location.href = '/';
      } else {
        console.error('Admin logout failed:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          Task Management System
        </div>

        <div className="admin-navbar-links">
          <a href="/admin" className="active">
            Dashboard
          </a>

          <a href="admin/tasks">Tasks</a>
          <a href="admin/users">Users</a>
        </div>

        <div className="admin-navbar-right">
          <span>admin123@example.com</span>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Heading */}
      <header className="admin-dashboard-heading">
        <h1>Dashboard</h1>
      </header>

      {/* Welcome Section */}
      <main className="admin-dashboard-content">
        <div className="admin-welcome-box">
          <strong>Welcome to Task Management System.</strong>
          <p>
            Manage users, tasks, comments, and other administrative
            activities from this dashboard.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-dashboard-footer">
        Task Management System
      </footer>
    </div>
  );
}
