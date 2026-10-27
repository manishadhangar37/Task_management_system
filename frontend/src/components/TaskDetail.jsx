import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTask, updateTask } from '../services/tasks'
import { fetchAdminUsers } from '../services/tasks'
import './TaskDetail.css'

const statusOptions = [
  { value: 'todo', label: 'To do' },
  { value: 'inProgress', label: 'In progress' },
  { value: 'inReview', label: 'In review' },
  { value: 'done', label: 'Done' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const fieldLabels = {
  title: 'Title',
  description: 'Description',
  assignee: 'Assignee',
  status: 'Status',
  priority: 'Priority',
  due_date: 'Due date',
}

function formatDate(value, includeTime = false) {
  if (!value) return '—'
  
  const date = new Date(value)
  
  if (Number.isNaN(date.getTime())) return '—'
  
  return new Intl.DateTimeFormat(
    undefined,
    includeTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'long' }
  ).format(date)
}

export default function TaskDetail() {
  const { id } = useParams()
  
  const [task, setTask] = useState(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [editedAssignee, setEditedAssignee] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingField, setSavingField] = useState('')
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [adminUsers, setAdminUsers] = useState([])
  
  useEffect(() => {
    async function loadAdminUsers() {
      try {
        const data = await fetchAdminUsers()
        console.log('data:', data)
        
        setAdminUsers(
          Array.isArray(data)
          ? data
          : Array.isArray(data.admin_users)
          ? data.admin_users
          : []
        )
      } catch (error) {
        console.error('Failed to fetch admin users:', error)
      }
    }
    
    loadAdminUsers()
  }, [])
  
  useEffect(() => {
    let active = true
    
    setLoading(true)
    setError('')
    setFeedback('')
    
    getTask(id)
    .then((loadedTask) => {
      if (!active) return
      
      setTask(loadedTask)
      setEditedTitle(loadedTask.title || '')
      setEditedDescription(loadedTask.description || '')
      setEditedAssignee(loadedTask.Assignee || '')
      setSelectedStatus(loadedTask.status)
    })
    .catch((loadError) => {
      if (active) setError(loadError.message)
      })
    .finally(() => {
      if (active) setLoading(false)
      })
    
    return () => {
      active = false
    }
  }, [id])
  
  async function handleInlineSave(field, value) {
    if (!task || savingField) return
    
    const previousValue = task[field]
    
    // Avoid unnecessary requests if the value has not changed.
    if (String(previousValue ?? '') === String(value ?? '')) {
      return
    }
    
    setSavingField(field)
    setError('')
    setFeedback('')
    
    try {
      const updatedTask = await updateTask(task.id, {
        [field]: value,
      })
      
      setTask(updatedTask)
      setEditedTitle(updatedTask.title || '')
      setEditedDescription(updatedTask.description || '')
      setEditedAssignee(updatedTask.Assignee || '')
      setSelectedStatus(updatedTask.status)
      
      setFeedback(`${fieldLabels[field]} updated successfully.`)
    } catch (updateError) {
      // Restore the previous value if the server rejects the update.
      setTask((current) =>
        current ? { ...current, [field]: previousValue } : current
    )
    
    if (field === 'title') {
      setEditedTitle(previousValue || '')
    }
    
    if (field === 'description') {
      setEditedDescription(previousValue || '')
    }
    
    if (field === 'Assignee') {
      setEditedAssignee(previousValue || '')
    }
    
    if (field === 'status') {
      setSelectedStatus(previousValue)
    }
    
    setError(updateError.message)
  } finally {
    setSavingField('')
  }
}

function handleTitleKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleInlineSave('title', editedTitle)
  }
  
  if (event.key === 'Escape') {
    setEditedTitle(task?.title || '')
    event.currentTarget.blur()
  }
}

function handleDescriptionKeyDown(event) {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    handleInlineSave('description', editedDescription)
  }
  
  if (event.key === 'Escape') {
    setEditedDescription(task?.description || '')
    event.currentTarget.blur()
  }
}


function handleAssigneeKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleInlineSave('Assignee', editedAssignee)
  }
  
  if (event.key === 'Escape') {
    setEditedAssignee(task?.Assignee || '')
    event.currentTarget.blur()
  }
}

return (
  <div className="task-detail-wrap">
  <Link className="task-detail-back" to="/users_dashboard">
  <span aria-hidden="true">←</span> Back to my tasks
  </Link>
  
  {loading && (
    <div className="task-detail-loading" role="status">
    <span className="detail-skeleton detail-skeleton-title" />
    <span className="detail-skeleton" />
    <span className="detail-skeleton" />
    </div>
  )}
  
  {!loading && error && !task && (
    <section className="task-detail-message" role="alert">
    <span className="detail-message-icon">!</span>
    <h1>We couldn’t open this task</h1>
    <p>{error}</p>
    <Link to="/users_dashboard">Return to my tasks</Link>
    </section>
  )}
  
  {!loading && task && (
    <>
    {error && (
      <div className="task-detail-error" role="alert">
      {error}
      </div>
    )}
    
    {feedback && (
      <div className="task-detail-success" role="status">
      {feedback}
      </div>
    )}
    
    {savingField && (
      <div className="status-saving" role="status">
      Saving {fieldLabels[savingField]}...
      </div>
    )}
    
    <div className="task-detail-columns">
    <div className="task-detail-left-column">
    <div className="title-description">
    <header className="task-detail-heading">
    <div className="eyebrow">
    <span className="eyebrow-dot" />
    TASK DETAILS <span className="task-id">#{task.id}</span>
    </div>
    
    <h2>Task: {task.title}</h2>
    
    
    </header>
    
    <section
    className="task-detail-card"
    aria-labelledby="detail-description-title"
    >
    <div className="detail-section-heading">
    <div className="detail-heading-icon">▤</div>
    <div>
    <h2 id="detail-description-title">Description</h2>
    <p>More context about this task</p>
    </div>
    </div>
    
    
    <textarea
    className="task-detail-description-input"
    value={editedDescription}
    onChange={(event) => {
      setEditedDescription(event.target.value);
      
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
    }}
    onKeyDown={handleDescriptionKeyDown}
    rows={4}
    aria-label="Task description"
    placeholder="Add a task description"
    disabled={savingField === "description"}
    ref={(element) => {
      if (element) {
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
      }
    }}
    />
    
    
    <small>
    
    </small>
    </section>
    </div>
    </div>
    
    <div className="task-detail-right-column">
    <section
    className="task-status-editor"
    aria-labelledby="task-status-heading"
    >
    <div>
    <h2 id="task-status-heading">Update status</h2>
    <p>Changes save automatically.</p>
    </div>
    
    <div className="status-editor-controls">
    <label className="sr-only" htmlFor="task-status">
    Task status
    </label>
    
    <select
    id="task-status"
    value={selectedStatus}
    onChange={(event) =>
      handleInlineSave('status', event.target.value)
    }
    disabled={savingField === 'status'}
    >
    {statusOptions.map(({ value, label }) => (
      <option key={value} value={value}>
      {label}
      </option>
    ))}
    </select>
    </div>
    </section>
    
    <section
    className="task-detail-card"
    aria-labelledby="detail-info-title"
    >
    <div className="detail-section-heading">
    <div className="detail-heading-icon">⌑</div>
    <div>
    <h2 id="detail-info-title">Task information</h2>
    <p>People, dates, and priority</p>
    </div>
    </div>
    
    <dl className="task-information-grid">
    <div className="editable-field">
    <dt>Assignee</dt>
    <dd>
    
    <select
    className="inline-edit-select"
    value={editedAssignee}
    onChange={(event) => {
      const email = event.target.value
      handleInlineSave('Assignee', email)
    }}
    aria-label="Task assignee"
    disabled={savingField === 'Assignee'}
    >
    {editedAssignee && !adminUsers.some(
      (user) => user.email === editedAssignee
    ) && (
      <option value={editedAssignee}>
      {editedAssignee}
      </option>
    )}
    
    
    {adminUsers.map((user) => (
      <option key={user.id} value={user.email}>
      {user.email}
      </option>
    ))}
    </select>
    
    
    </dd>
    
    <dt>Reporter</dt>
    <dd>{task.reporter || '—'}</dd>
    </div>
    
    <div className="editable-field">
    <dt>Priority</dt>
    <dd>
    <select
    className="inline-edit-select"
    value={task.priority || 'medium'}
    onChange={(event) =>
      handleInlineSave('priority', event.target.value)
    }
    aria-label="Task priority"
    disabled={savingField === 'priority'}
    >
    {priorityOptions.map(({ value, label }) => (
      <option key={value} value={value}>
      {label}
      </option>
    ))}
    </select>
    </dd>
    </div>
    
    <div className="editable-field">
    <dt>Due date</dt>
    <dd>
    <input
    className="inline-edit-input"
    type="date"
    min={new Date().toLocaleDateString('en-CA')}value={
      task.due_date
      ? task.due_date.slice(0, 10)
      : ''
    }
    onChange={(event) =>
      handleInlineSave('due_date', event.target.value)
    }
    aria-label="Task due date"
    disabled={savingField === 'due_date'}
    />
    </dd>
    </div>
    
    <div>
    <dt>Created</dt>
    <dd>{formatDate(task.created_at, true)}</dd>
    </div>
    </dl>
    </section>
    </div>
    </div>
    <button type="button" onClick={()=>handleDelete(task.id)} className="delete-task-button">
    Delete Task
    </button>    </>
  )}
  </div>
)
}
