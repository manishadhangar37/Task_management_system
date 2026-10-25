import { useNavigate } from 'react-router-dom'
import './HomePage.css'
export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
     <main className="home-page">
        <div className="home-container">
          <div className="brand">Task Management System</div>

          <h1>Welcome to Your Workspace</h1>

          <p className="home-description">
            Manage tasks, collaborate with your team, and keep your
            projects moving forward. Choose how you want to sign in.
          </p>

          <div className="login-options">
            <section className="login-card">
              <div className="option-icon">🛡️</div>
              <h2>Admin Portal</h2>
              <p>
                Manage the system, oversee users, and access
                administrative controls.
              </p>
              <button
                className="login-button"
                onClick={() => navigate('/admin/login')}
              >
                Continue as Admin →
              </button>
            </section>

            <section className="login-card user-card">
              <div className="option-icon">👥</div>
              <h2>User Portal</h2>
              <p>
                Access your tasks, update progress, and collaborate
                with your team.
              </p>
              <button
                className="login-button"
                onClick={() => navigate('/login')}
              >
                Continue as User →
              </button>
            </section>
          </div>

          <div className="home-footer">
            © Task Management System · All rights reserved
          </div>
        </div>
      </main>
    </>
  )
}
