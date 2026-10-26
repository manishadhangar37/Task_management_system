
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditUser.css';
import './ViewUser.css';



async function getCsrfToken() {
  const response = await fetch('/csrf_token', {

    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`CSRF request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.csrf_token) {
    throw new Error('CSRF token not found in the response.');
  }

  return data.csrf_token;
}

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        const responseText = await response.text();
        let data;

        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Unexpected server response while loading user (${response.status}).`
          );
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
              (Array.isArray(data.errors)
                ? data.errors.join(', ')
                : `Unable to load user (${response.status}).`)
          );
        }

        const user = data.user || data;

        if (!cancelled) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            role: String(user.role ?? 'developer'),
          });
        }
      } catch (err) {
        console.error('Fetch user error:', err);

        if (!cancelled) {
          setError(err.message || 'Unable to load user.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchUser();
    } else {
      setError('User ID was not found.');
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    console.log('Save Changes clicked');
    console.log('User ID:', id);
    console.log('Form data:', formData);

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const csrfToken = await getCsrfToken();

      console.log('CSRF token received:', Boolean(csrfToken));
      console.log('Sending PATCH request...');

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          user: formData,
        }),
      });

      console.log('PATCH status:', response.status);

      const responseText = await response.text();
      console.log('PATCH response:', responseText);

      let data;

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Server returned an unexpected response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.errors)
            ? data.errors.join(', ')
            : data.error ||
                data.message ||
                `Update failed (${response.status}).`
        );
      }

      setMessage(data.message || 'User Updated successfully.');
      navigate('/admin/users');


      if (data.user) {
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          role: String(data.user.role ?? 'developer'),
        });
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Unable to update user.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (error && !formData.name && !formData.email) {
    return (
      <div className="edit-user-page">
        <p className="edit-user-error">{error}</p>
        </div>
    );
  }

  return (
    <div className="edit-user-page">
        <h1>Edit User</h1>
        <p>Update the user's information below.</p>
      

      {error && <p className="edit-user-error">{error}</p>}
      {message && <p className="edit-user-success">{message}</p>}
       


      <form onSubmit={handleSubmit}>
        <div className="edit-user-field">
          <label htmlFor="edit-name">Name</label>
          <input
            id="edit-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className="edit-user-field">
          <label htmlFor="edit-email">Email</label>
          <input
            id="edit-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className="edit-user-field">
          <label htmlFor="edit-role">Role</label>
          <select
            id="edit-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={saving}
          >
            <option value="manager">Manager</option>
            <option value="team_lead">Team Lead</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
          </select>
        </div>

        <div className="edit-user-actions">
          <button
            type="button"
            className="edit-user-cancel"
            onClick={() => navigate('/admin/users')}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="edit-user-save"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
      <button
          className="view-user-back"
          onClick={() => navigate('/admin/users')}
        >
          Back to Users
        </button>
    </div>
  );
}
