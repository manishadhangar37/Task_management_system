import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '../services/auth'
import './SignInPage.css'

export default function SignInPage() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ email: '', password: '', remember: true })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  function updateField(event) {
    const { name, value, checked, type } = event.target
    setCredentials((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }
  
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    
    
    async function handleSubmit(event) {
      event.preventDefault()
      setError('')
      setSubmitting(true)
      
      try {
        const email = credentials.email.trim().toLowerCase()
        
        if (email === 'admin123@example.com' && password ==='password') {
          await adminSignIn(credentials)
          navigate('/admin-dashboard', { replace: true })
        } else {
          await signIn(credentials)
          
          navigate('/users_dashboard', { replace: true })
        }
      } catch (submitError) {
        setError(submitError.message || 'Login failed')
      } finally {
        setSubmitting(false)
      }
    }
    
    return (
      <main className="auth-page">
      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />
      
      <Link className="auth-brand" to="/users/sign_in" aria-label="Taskflow sign in">
      <span className="brand-mark">T</span>
      <span>taskflow</span>
      </Link>
      
      <section className="auth-card" aria-labelledby="sign-in-title">
      <div className="auth-card-main">
      <div className="auth-kicker"><span /> YOUR WORKSPACE, IN FLOW</div>
      <h1 id="sign-in-title">Welcome back</h1>
      <p className="auth-intro">Sign in to pick up where you left off.</p>
      
      {error && <div className="auth-error" role="alert">{error}</div>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="sign-in-email">Email address</label>
      <input
      id="sign-in-email"
      name="email"
      type="email"
      autoComplete="email"
      value={credentials.email}
      onChange={updateField}
      placeholder="you@example.com"
      required
      />
      
      <div className="auth-label-row">
      <label htmlFor="sign-in-password">Password</label>
      </div>
      <div className="password-field">
      <input
      id="sign-in-password"
      name="password"
      type={showPassword ? 'text' : 'password'}
      autoComplete="current-password"
      value={credentials.password}
      onChange={updateField}
      placeholder="Enter your password"
      required
      />
      <button type="button" className="password-toggle" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
      {showPassword ? 'Hide' : 'Show'}
      </button>
      </div>
      
      <label className="remember-option">
      <input name="remember" type="checkbox" checked={credentials.remember} onChange={updateField} />
      <span>Remember me on this device</span>
      </label>
      
      <button className="auth-submit" type="submit" disabled={submitting}>
      {submitting ? 'Signing in…' : 'Sign in'}
      <span aria-hidden="true">→</span>
      </button>
      </form>
      
      <p className="auth-switch">New to Taskflow? <Link to="/users/sign_up">Create an account</Link></p>
      <p className="auth-security"><span aria-hidden="true">⌑</span> Your workspace is private and secure.</p>
      </div>
      
      <aside className="auth-aside" aria-label="Taskflow features">
      <div className="auth-aside-mark">✦</div>
      <p className="auth-aside-overline">MAKE ROOM FOR GOOD WORK</p>
      <h2>One clear place for everything you need to do.</h2>
      <p className="auth-aside-copy">Bring your tasks together, see what matters, and keep moving with your team.</p>
      <div className="auth-mini-card">
      <span className="mini-check">✓</span>
      <span><strong>One step at a time</strong><small>Your next task is ready when you are.</small></span>
      </div>
      <div className="auth-aside-dots" aria-hidden="true"><span /><span /><span /></div>
      </aside>
      </section>
      
      <p className="auth-footer">© {new Date().getFullYear()} Taskflow <span>·</span> Built for thoughtful work</p>
      </main>
    )
  }
}
  