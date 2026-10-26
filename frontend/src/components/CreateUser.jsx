
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateUser.css';
import { getAuthCsrfToken } from '../services/auth';

export default function CreateUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'developer',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (formData.password !== formData.password_confirmation) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);

      const csrfToken = await getAuthCsrfToken();

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          user: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            role: formData.role,
          },
        }),
      });

      const responseText = await response.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Unexpected server response (${response.status}). The existing endpoint may return HTML instead of JSON.`
        );
      }

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.errors)
            ? data.errors.join(', ')
            : data.error ||
                data.message ||
                `Unable to create user (${response.status}).`
        );
      }

      setMessage(data.message || 'User created successfully.');

      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'developer',
      });

      setTimeout(() => {
        navigate('/admin/users');
      }, 1000);
    } catch (err) {
      console.error('Create user error:', err);
      setError(err.message || 'Unable to create user.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-user-page">
      <div className="create-user-header">
        <div>
          <h1>Create User</h1>
          <p>Add a new user to your task management team.</p>
        </div>

        <button
          type="button"
          className="create-user-back-btn"
          onClick={() => navigate('/admin/users')}
          disabled={loading}
        >
          Back to Users
        </button>
      </div>

      {error && (
        <div className="create-user-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="create-user-success" role="status">
          {message}
        </div>
      )}

      <form className="create-user-form" onSubmit={handleSubmit}>
        <div className="create-user-field">
          <label htmlFor="create-name">Full Name</label>
          <input
            id="create-name"
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
            disabled={loading}
          />
        </div>

        <div className="create-user-field">
          <label htmlFor="create-email">Email Address</label>
          <input
            id="create-email"
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={loading}
          />
        </div>

        <div className="create-user-field">
          <label htmlFor="create-password">Password</label>
          <input
            id="create-password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={loading}
          />
          <small>
            Use at least 8 characters, including uppercase, lowercase,
            a number, and a special character.
          </small>
        </div>

        <div className="create-user-field">
          <label htmlFor="create-password-confirmation">
            Confirm Password
          </label>
          <input
            id="create-password-confirmation"
            type="password"
            name="password_confirmation"
            placeholder="Confirm password"
            value={formData.password_confirmation}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={loading}
          />
        </div>

        <div className="create-user-field">
          <label htmlFor="create-role">Role</label>
          <select
            id="create-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="manager">Manager</option>
            <option value="team_lead">Team Lead</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
          </select>
        </div>

        <div className="create-user-actions">
          <button
            type="button"
            className="create-user-cancel-btn"
            onClick={() => navigate('/admin/users')}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-user-submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}