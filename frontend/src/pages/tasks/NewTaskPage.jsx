import TaskForm from '../../components/TaskForm'

export default function NewTaskPage() {
  return (
    <div className="content-wrap">
      <div className="page-heading">
        <div className="eyebrow"><span className="eyebrow-dot" /> TASK MANAGEMENT</div>
        <h1>Create a task</h1>
        <p>Capture the details and get your next piece of work moving.</p>
      </div>

      <TaskForm />
      <div className="page-footnote"><span>✦</span> A little progress each day adds up to big results.</div>
    </div>
  )
}
