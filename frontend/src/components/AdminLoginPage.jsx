
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

          <input
            className="admin-login-input"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            placeholder="Password"
            required
          />

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
