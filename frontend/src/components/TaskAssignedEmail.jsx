export default function TaskAssignedEmail({
  developerName,
  taskTitle,
  dueDate,
  taskUrl,
}) {
  const styles = {
    body: {
      margin: 0,
      padding: '30px 12px',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif',
      color: '#1f2937',
    },
    container: {
      maxWidth: '560px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
    },
    heading: {
      color: '#2563eb',
      marginBottom: '24px',
    },
    details: {
      backgroundColor: '#f8fafc',
      padding: '16px',
      borderRadius: '6px',
      marginTop: '20px',
    },
    button: {
      display: 'inline-block',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '12px 20px',
      borderRadius: '6px',
      textDecoration: 'none',
      marginTop: '16px',
    },
    footer: {
      marginTop: '28px',
      fontSize: '12px',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Task Assigned</h1>

        <p>Hello {developerName || 'Developer'},</p>

        <p>A new task has been assigned to you.</p>

        <div style={styles.details}>
          <p>
            <strong>Task:</strong> {taskTitle}
          </p>

          <p>
            <strong>Due date:</strong> {dueDate || 'Not specified'}
          </p>
        </div>

        {taskUrl && (
          <a href={taskUrl} style={styles.button}>
            View Task
          </a>
        )}

        <p style={styles.footer}>
          This is an automated notification from your Task Management System.
        </p>
      </div>
    </div>
  );
}