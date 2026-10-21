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
  const priority = (task.priority || 'medium').toLowerCase()

  return (
    <article className="dashboard-task-card">
      <div className="task-card-main">
        <div className="task-card-title-row">
          <h3>{task.title}</h3>
          <span className={`task-status status-${status}`}>{statusLabels[status] || status}</span>
        </div>
        <p className="dashboard-task-description">{task.description || 'No description provided.'}</p>
        <div className="task-card-meta">
          <span><span className="meta-symbol">◎</span> {task.Assignee || 'Unassigned'}</span>
          <span className={isOverdue(task) ? 'due-date overdue' : 'due-date'}>
            <span className="meta-symbol">◷</span> {isOverdue(task) ? 'Overdue · ' : ''}{formatDate(task.due_date)}
          </span>
        </div>
      </div>
      <div className={`task-priority priority-${priority}`}>
        <span /> {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
      </div>
       <div>
        <button onClick={() => navigate(`/tasks/${task.id}`)}>
        View Task
      </button>
    </div>
    </article>
  )
}

export default function UserDashboard() {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
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
    done: tasks.filter((task) => task.status === 'done').length,
  }), [tasks])

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesSearch = !query || [task.title, task.description, task.Assignee]
        .some((value) => value?.toLowerCase().includes(query))
      return matchesStatus && matchesSearch
    })
  }, [tasks, search, statusFilter])

  return (
    <div className="dashboard-wrap">
      <section className="dashboard-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR WORKSPACE</div>
          <h1>My tasks</h1>
          <p>See what’s on your plate and keep your work moving.</p>
        </div>
        <Link className="dashboard-create-button" to="/tasks/new"><span aria-hidden="true">＋</span> New task</Link>
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
        <article className="summary-card summary-done">
          <span className="summary-icon">✓</span>
          <div><span className="summary-label">Completed</span><strong>{loading ? '—' : counts.done}</strong></div>
        </article>
      </section>

      <section className="dashboard-list-section" aria-labelledby="task-list-title">
        <div className="dashboard-list-heading">
          <div>
            <h2 id="task-list-title">Your work</h2>
            <p>{loading ? 'Loading your tasks…' : `${visibleTasks.length} ${visibleTasks.length === 1 ? 'task' : 'tasks'}`}</p>
          </div>
          <div className="task-filters">
            <label className="task-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" />
            </label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter tasks by status">
              <option value="all">All statuses</option>
              <option value="todo">To do</option>
              <option value="inProgress">In progress</option>
              <option value="inReview">In review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {error && <div className="dashboard-error" role="alert">{error}</div>}
        {loading && (
          <div className="dashboard-loading" role="status" aria-label="Loading tasks">
            <span /><span /><span />
          </div>
        )}
        {!loading && !error && visibleTasks.length > 0 && (
          <div className="dashboard-task-list">
            {visibleTasks.map((task) => <TaskCard key={task.id} task={task} />)}
          </div>
        )}
        {!loading && !error && visibleTasks.length === 0 && (
          <div className="dashboard-empty">
            <span className="empty-icon">✦</span>
            <h3>{tasks.length === 0 ? 'A fresh start' : 'No matching tasks'}</h3>
            <p>{tasks.length === 0 ? 'You don’t have any tasks yet. Create one to get started.' : 'Try a different search or status filter.'}</p>
            {tasks.length === 0 && <Link to="/tasks/new">Create your first task <span aria-hidden="true">→</span></Link>}
          </div>
        )}
      </section>
    </div>
  )
}
