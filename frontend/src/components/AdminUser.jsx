
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminUser.css';

export default function AdminUser() {
    const navigate = useNavigate();
    
    const [adminUsers, setAdminUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    
    async function fetchAdminUsers() {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('/api/admin/users', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(
                    `Failed to load admin users (${response.status})`
                );
            }
            
            const data = await response.json();
            
            setAdminUsers(
                Array.isArray(data)
                ? data
                : Array.isArray(data.admin_users)
                ? data.admin_users
                : []
            );
        } catch (err) {
            setError(err.message || 'Unable to load admin users.');
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        fetchAdminUsers();
    }, []);
    
    async function handleDelete(user) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${user.email}?`
        );
        
        if (!confirmed) return;
        
        try {
            setDeletingId(user.id);
            setError('');
            setMessage('');
            
            // Read CSRF token from the HTML meta tag
            const tokenResponse = await fetch('/csrf_token', {
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                },
            })
            
            if (!tokenResponse.ok) {
                throw new Error('Could not fetch CSRF token')
            }
            
            const { csrf_token } = await tokenResponse.json()
            
            console.log('CSRF token:', csrf_token)
            
            
            const response = await fetch(`/api/admin/users/${user.id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-Token': csrf_token,
                    },
                }
            );
            
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                
                throw new Error(
                    data.error ||
                    `Unable to delete admin user (${response.status}).`
                );
            }
            
            setAdminUsers((current) =>
                current.filter((item) => item.id !== user.id)
        );
        
        setMessage('Admin user deleted successfully.');
    } catch (err) {
        console.error('Delete user error:', err);
        setError(err.message || 'Unable to delete admin user.');
    } finally {
        setDeletingId(null);
    }
}

const filteredUsers = adminUsers.filter((user) => {
    const query = search.toLowerCase();
    
    return (
        String(user.email || '').toLowerCase().includes(query) ||
        String(user.name || '').toLowerCase().includes(query) ||
        String(user.id || '').includes(query)
    );
});

return (
    <div className="admin-users-page">
    <div className="admin-users-header">
    <div>
    <h1>Admin Users</h1>
    <p>Manage administrator accounts</p>
    </div>
    
    <button
    type="button"
    className="create-user-btn"
    onClick={() => navigate('/admin/users/new')}
    >
    + Create User
    </button>
    </div>
    
    {message && (
        <div className="admin-users-success" role="status">
        {message}
        </div>
    )}
    
    {error && (
        <div className="admin-users-error" role="alert">
        {error}
        </div>
    )}
    
    <div className="admin-users-toolbar">
    <input
    type="search"
    placeholder="Search by email, name or ID..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    aria-label="Search admin users"
    />
    
    <span>
    {filteredUsers.length} admin user
    {filteredUsers.length !== 1 ? 's' : ''}
    </span>
    </div>
    
    <div className="admin-users-table-wrapper">
    <table className="admin-users-table">
    <thead>
    <tr>
    <th>ID</th>
    <th>Email</th>
    <th>Name</th>
    <th>Role </th>
    <th>Created At</th>
    <th>Actions</th>
    </tr>
    </thead>
    
    <tbody>
    {loading ? (
        <tr>
        <td
        colSpan="5"
        className="admin-users-empty"
        >
        Loading admin users...
        </td>
        </tr>
    ) : filteredUsers.length === 0 ? (
        <tr>
        <td
        colSpan="5"
        className="admin-users-empty"
        >
        {search
            ? 'No matching admin users found.'
            : 'No admin users found.'}
            </td>
            </tr>
        ) : (
            filteredUsers.map((user) => (
                <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email || '—'}</td>
                <td>{user.name || '—'}</td>
                <td>{user.role||'-'}</td>
                
                <td>
                {user.created_at
                    ? new Date(
                        user.created_at
                    ).toLocaleDateString()
                    : '—'}
                    </td>
                    
                    <td className="admin-users-actions">
                    <button
                    type="button"
                    className="admin-users-view"
                    onClick={() =>
                        navigate(
                            `/admin/users/${user.id}`
                        )
                    }
                    >
                    View
                    </button>
                    
                    <button
                    type="button"
                    className="admin-users-edit"
                    onClick={() =>
                        navigate(
                            `/admin/users/${user.id}/edit`
                        )
                    }
                    >
                    Edit
                    </button>
                    
                    <button
                    type="button"
                    className="admin-users-delete"
                    onClick={() => handleDelete(user)}
                    disabled={
                        deletingId === user.id
                    }
                    >
                    {deletingId === user.id
                        ? 'Deleting...'
                        : 'Delete'}
                        </button>
                        </td>
                        </tr>
                    ))
                )}
                </tbody>
                </table>
                </div>
                </div>
            );
        }