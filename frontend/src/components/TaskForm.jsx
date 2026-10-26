import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTask } from '../services/tasks'

const emptyTask = {
  title: '',
  description: '',
  Assignee: '',
  reporter: '',
  status: 'todo',
  due_date: '',
  priority: 'high',
}

export default function TaskForm() {
  const navigate = useNavigate()
  const [task, setTask] = useState(emptyTask)
  const [errors, setErrors] = useState([])
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)

  function updateTask(event) {
    setTask((currentTask) => ({ ...currentTask, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors([])
    setFeedback('')
    setSaving(true)

    try {
      await createTask(task)
      setTask(emptyTask)
      setFeedback('Task created successfully.')
      navigate("/users_dashboard")
    } catch (error) {
      setErrors([error.message])
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="task-card" onSubmit={handleSubmit}>
      <div className="card-heading">
        <div className="card-icon">✳</div>
        <div>
          <h2>Task details</h2>
          <p>Fields marked with <span className="required">*</span> are required.</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="notice error-notice" role="alert">
          <strong>We couldn’t create this task</strong>
          <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
        </div>
      )}
      {feedback && <div className="notice success-notice" role="status">{feedback}</div>}

      <div className="form-grid">
        <label className="field full-width">
          <span>Task name <b>*</b></span>
          <input autoFocus name="title" value={task.title} onChange={updateTask} placeholder="e.g. Prepare Q4 product roadmap" required maxLength={255} />
        </label>

        <label className="field full-width">
          <span>Description <b>*</b></span>
          <textarea name="description" value={task.description} onChange={updateTask} placeholder="Add context, goals, or any helpful details…" rows={4} required />
        </label>

        <label className="field">
          <span>Assignee <b>*</b></span>
          <div className="input-with-icon">
            <span className="input-icon">◎</span>
            <input name="Assignee" value={task.Assignee} onChange={updateTask} placeholder="Who’s working on this?" required />
          </div>
        </label>

      

        <label className="field">
          <span>Status <b>*</b></span>
          <select name="status" value={task.status} onChange={updateTask} required>
            <option value="todo">To do</option>
            <option value="inProgress">In progress</option>
            <option value="inReview">In review</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className="field">
          <span>Priority <b>*</b></span>
          <select name="priority" value={task.priority} onChange={updateTask} required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="field">
          <span>Due date <b>*</b></span>
          <input type="date" name="due_date" min={new Date().toLocaleDateString('en-CA')}value={task.due_date} onChange={updateTask} required />
        </label>
      </div>

      <footer className="form-actions">
        <button className="cancel-button" type="reset" onClick={() => setTask(emptyTask)}>Cancel</button>
        <button className="submit-button" type="submit" disabled={saving}>
          {saving ? 'Creating…' : 'Create task'} <span aria-hidden="true">→</span>
        </button>
      </footer>
    </form>
  )
}
