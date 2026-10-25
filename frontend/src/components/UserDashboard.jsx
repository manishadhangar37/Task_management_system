import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTasks } from '../services/tasks'
import './UserDashboard.css'

const statusLabels = {
  todo: 'To do',
  inProgress: 'In progress',
  inReview: 'In review',
  done: 'Done',
}

const boardColumns = [
  { key: 'todo', label: 'To Do' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'inReview', label: 'In Review' },
  { key: 'done', label: 'Done' },
]

function formatDate(value) {
  if (!value) return 'No due date'
  const datePart = value.slice(0, 10)
  const date = new Date(`${datePart}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? 'No due date'
    : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function isOverdue(task) {
  if (!task.due_date || task.status === 'done') return false
  const dueDay = task.due_date.slice(0, 10)
  const today = new Date()
  const todayDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return dueDay < todayDay
}

function TaskCard({ task }) {
  const navigate = useNavigate()
  const status = task.status || 'todo'
  const priority = (task.priority || 'high').toLowerCase()

  return (
    <article className="jira-card">
      <div className="jira-card-header">
        <span className={`jira-priority dot-${priority}`} aria-label={`${priority} priority`} />
        <span className={`jira-badge badge-${status}`}>{statusLabels[status] || status}</span>
      </div>

      <h3 className="jira-card-title">{task.title}</h3>


      <div className="jira-card-meta">
       
<div className="jira-card-meta">
  <span className="assignee-info">
    <strong>Assignee:</strong>

    {task.Assignee ? (
      <span className="assignee-avatar-wrapper">
        <span className="assignee-avatar">
          {task.Assignee.split('@')[0].slice(0, 2).toUpperCase()}
        </span>

        <span className="assignee-email">
          {task.Assignee}
        </span>
      </span>
    ) : (
      'Unassigned'
    )}
  </span>
</div>


      <span className={isOverdue(task) ? 'overdue' : ''}>
          <strong>Due:</strong> {isOverdue(task) ? 'Overdue · ' : ''}{formatDate(task.due_date)}
        </span>
      </div>

     <button type="button" className="jira-view-button" onClick={() => navigate(`/tasks/${task.id}`)}>
        View task
      </button>
    </article>
  )
}

export default function UserDashboard() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getTasks()
      .then((data) => {
        if (active) setTasks(Array.isArray(data) ? data : [])
      })
      .catch((loadError) => {
        if (active) setError(loadError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const counts = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    inProgress: tasks.filter((task) => task.status === 'inProgress').length,
    inReview: tasks.filter((task) => task.status === 'inReview').length,
    done: tasks.filter((task) => task.status === 'done').length,
  }), [tasks])

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      if (!query) return true
      return [task.title, task.description, task.Assignee]
        .some((value) => value?.toLowerCase().includes(query))
    })
  }, [tasks, search])

  const columns = useMemo(
    () => boardColumns.map((column) => ({
      ...column,
      tasks: filteredTasks.filter((task) => (task.status || 'todo') === column.key),
    })),
    [filteredTasks],
  )

  return (
    <div className="dashboard-wrap">
      <section className="dashboard-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR WORKSPACE</div>
          <h1>My tasks</h1>
          <p>See what’s on your plate and keep your work moving.</p>
        </div>
      </section>

      <section className="task-summary" aria-label="Task summary">
        <article className="summary-card summary-total">
          <span className="summary-icon">▦</span>
          <div><span className="summary-label">All tasks</span><strong>{loading ? '—' : counts.total}</strong></div>
        </article>
        <article className="summary-card summary-todo">
          <span className="summary-icon">◌</span>
          <div><span className="summary-label">To do</span><strong>{loading ? '—' : counts.todo}</strong></div>
        </article>
        <article className="summary-card summary-progress">
          <span className="summary-icon">◷</span>
          <div><span className="summary-label">In progress</span><strong>{loading ? '—' : counts.inProgress}</strong></div>
        </article>
        <article className="summary-card summary-review">
          <span className="summary-icon">◎</span>
          <div><span className="summary-label">In review</span><strong>{loading ? '—' : counts.inReview}</strong></div>
        </article>
        <article className="summary-card summary-done">
          <span className="summary-icon">✓</span>
          <div><span className="summary-label">Done</span><strong>{loading ? '—' : counts.done}</strong></div>
        </article>
      </section>

      <section className="dashboard-list-section" aria-labelledby="task-list-title">
        <div className="dashboard-list-heading">
          <div>
            <h2 id="task-list-title">Board</h2>
            <p>{loading ? 'Loading your tasks…' : `${filteredTasks.length} ${filteredTasks.length === 1 ? 'task' : 'tasks'}`}</p>
          </div>

          <label className="task-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" />
          </label>
        </div>

        {error && <div className="dashboard-error" role="alert">{error}</div>}
        {loading && (
          <div className="dashboard-loading" role="status" aria-label="Loading tasks">
            <span /><span /><span />
          </div>
        )}

        {!loading && !error && (
          <div className="jira-board" aria-label="Task board">
            {columns.map((column) => (
              <div key={column.key} className="jira-column">
                <div className="jira-column-header">
                  <h3>{column.label}</h3>
                  <span>{column.tasks.length}</span>
                </div>

                <div className="jira-column-body">
                  {column.tasks.length === 0 ? (
                    <div className="jira-empty-column">No tasks</div>
                  ) : (
                    column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
