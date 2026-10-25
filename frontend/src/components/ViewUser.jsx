import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditUser.css';

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load user details.');
        }

        setUser(data.user || data);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchUser();
    } else {
      setError('User ID is missing.');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="view-user-page">
        <p className="view-user-loading">Loading user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="view-user-page">
        <p className="view-user-error">
          {error || 'User not found.'}
        </p>
        <button
          className="view-user-back"
          onClick={() => navigate('/admin/users')}
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="view-user-page">
      <div className="view-user-header">
        <div>
          <h1>User Details</h1>
          <p>View the details of this user account.</p>
        </div>
         
        <button
          className="view-user-back"
          onClick={() => navigate('/admin/users')}
        >
          Back to Users
        </button>
      </div>

      <div className="view-user-card">
        <div className="view-user-avatar">
          {(user.name || user.email || 'U')
            .charAt(0)
            .toUpperCase()}
        </div>

        <h2>{user.name || 'Name not available'}</h2>
        <p className="view-user-email">
          {user.email || 'Email not available'}
        </p>

        <div className="view-user-details">
          <div className="view-user-detail">
            <span>Account ID</span>
            <strong>{user.id ?? id}</strong>
          </div>

          <div className="view-user-detail">
            <span>Full Name</span>
            <strong>{user.name || 'Not available'}</strong>
          </div>

          <div className="view-user-detail">
            <span>Email Address</span>
            <strong>{user.email || 'Not available'}</strong>
          </div>

          <div className="view-user-detail">
            <span>Role</span>
            <strong className="view-user-role">
              {String(user.role || 'Not assigned')
                .replaceAll('_', ' ')
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}
            </strong>
          </div>
        </div>

        <button
          className="view-user-edit"
          onClick={() => navigate(`/admin/users/${id}/edit`)}
        >
          Edit User
        </button>
      </div>
    </div>
  );
}