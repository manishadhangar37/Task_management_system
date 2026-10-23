import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminSignIn } from '../services/admin_auth'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'password' })
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
    <div style={{ maxWidth: 420, margin: '80px auto', padding: 24 }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="adminemail"
          required
        />
        <br /><br />
        <input
          type="password"
          
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          required
        />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login as Admin'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
    </div>
  )
}