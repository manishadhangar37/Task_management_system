export default function AdminDashboard() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 20, marginTop: 24 }}>
        <div style={{ background: '#f3f4f6', borderRadius: 12, padding: 20 }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: 32, fontWeight: 700 }}>120</p>
        </div>
        <div style={{ background: '#eef2ff', borderRadius: 12, padding: 20 }}>
          <h3>Open Tasks</h3>
          <p style={{ fontSize: 32, fontWeight: 700 }}>34</p>
        </div>
        <div style={{ background: '#ecfeff', borderRadius: 12, padding: 20 }}>
          <h3>Resolved</h3>
          <p style={{ fontSize: 32, fontWeight: 700 }}>88</p>
        </div>
      </div>

      <div style={{ marginTop: 32, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2>Recent Members</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 12 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Email</th>
              <th style={{ textAlign: 'left', padding: 12 }}>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 12 }}>Admin</td>
              <td style={{ padding: 12 }}>admin@example.com</td>
              <td style={{ padding: 12 }}>Admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}