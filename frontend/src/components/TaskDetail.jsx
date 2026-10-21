import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTask, updateTaskStatus } from '../services/tasks'
import './TaskDetail.css'

const statusOptions = [
  { value: 'todo', label: 'To do' },
  { value: 'inProgress', label: 'In progress' },
  { value: 'inReview', label: 'In review' },
  { value: 'done', label: 'Done' },
]

const statusLabels = Object.fromEntries(statusOptions.map(({ value, label }) => [value, label]))

function formatDate(value, includeTime = false) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, includeTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'long' }).format(date)
}

export default function TaskDetail() {
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')
    getTask(id)
      .then((loadedTask) => {
        if (!active) return
        setTask(loadedTask)
        setSelectedStatus(loadedTask.status)
      })
      .catch((loadError) => {
        if (active) setError(loadError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [id])

  async function handleStatusChange(event) {
    const nextStatus = event.target.value
    if (!task || saving || nextStatus === task.status) return

    setSelectedStatus(nextStatus)
    setSaving(true)
    setError('')
    setFeedback('')
    try {
      const updatedTask = await updateTaskStatus(task.id, nextStatus)
      setTask(updatedTask)
      setSelectedStatus(updatedTask.status)
      setFeedback('Task status updated.')
    } catch (updateError) {
      setSelectedStatus(task.status)
      setError(updateError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="task-detail-wrap">
      <Link className="task-detail-back" to="/users_dashboard"><span aria-hidden="true">←</span> Back to my tasks</Link>

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
          {error && <div className="task-detail-error" role="alert">{error}</div>}
          {feedback && <div className="task-detail-success" role="status">{feedback}</div>}

          <div className="task-detail-columns">
            <div className="task-detail-left-column">
              <header className="task-detail-heading">
                <div className="eyebrow"><span className="eyebrow-dot" /> TASK DETAILS <span className="task-id">#{task.id}</span></div>
                <h1>{task.title}</h1>
                <p>Review the details and keep the task status up to date.</p>
              </header>

              <section className="task-detail-card" aria-labelledby="detail-description-title">
                <div className="detail-section-heading">
                  <div className="detail-heading-icon">▤</div>
                  <div>
                    <h2 id="detail-description-title">Description</h2>
                    <p>More context about this task</p>
                  </div>
                </div>
                <p className="task-full-description">{task.description || 'No description was added.'}</p>
              </section>
            </div>

            <div className="task-detail-right-column">
                <section className="task-status-editor" aria-labelledby="task-status-heading">
                <div>
                  <h2 id="task-status-heading">Update status</h2>
                </div>
                <div className="status-editor-controls">
                  <label className="sr-only" htmlFor="task-status">Task status</label>
                  <select id="task-status" value={selectedStatus} onChange={handleStatusChange} disabled={saving}>
                    {statusOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  {saving && <span className="status-saving" role="status">Saving…</span>}
                </div>
              </section>
              <section className="task-detail-card" aria-labelledby="detail-info-title">
                <div className="detail-section-heading">
                  <div className="detail-heading-icon">⌑</div>
                  <div>
                    <h2 id="detail-info-title">Task information</h2>
                    <p>People, dates, and priority</p>
                  </div>
                </div>

                <dl className="task-information-grid">
                  <div><dt>Assignee</dt><dd>{task.Assignee || '—'}</dd></div>
                  <div><dt>Reporter</dt><dd>{task.reporter || '—'}</dd></div>
                  <div><dt>Priority</dt><dd><span className={`task-priority priority-${(task.priority || 'medium').toLowerCase()}`}><span />{task.priority || 'Medium'}</span></dd></div>
                  <div><dt>Due date</dt><dd>{formatDate(task.due_date)}</dd></div>
                  <div><dt>Created</dt><dd>{formatDate(task.created_at, true)}</dd></div>
                </dl>
              </section>

              
            </div>
          </div>
        </>
      )}
    </div>
  )
}
