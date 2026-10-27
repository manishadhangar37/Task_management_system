
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminSignIn } from '../services/admin_auth'
import './AdminLogin.css'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);


  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await adminSignIn(form)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Admin Login</h2>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            className="admin-login-input"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            placeholder="Admin email"
            required
          />
          <div className="password-field">
          <input
            className="admin-login-input"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            placeholder="Password"
            required
          />
          <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
          </button>
          </div>

          <button
            className="admin-login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login as Admin'}
          </button>
        </form>

        {error && (
          <p className="admin-login-error">{error}</p>
        )}
      </div>
    </div>
  )
}
