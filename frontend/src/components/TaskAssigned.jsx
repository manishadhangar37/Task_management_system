import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './TaskAssigned.css'

function TaskAssigned() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    
    useEffect(() => {
        
        const fetchAssignedTasks = async () => {
            try {
                const response = await fetch('/api/tasks/assigned', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                    },
                })
                console.log(response)
                if (!response.ok) {
                    throw new Error('Failed to fetch assigned tasks')
                }
                
                const data = await response.json()
                
                setTasks(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        
        fetchAssignedTasks()
    }, [])
    
    if (loading) {
        return <p>Loading assigned tasks...</p>
    }
    
    if (error) {
        return <p>Error: {error}</p>
    }
    
    if (tasks.length === 0) {
        return <p>No tasks assigned to you.</p>
    }
    
    return (
        <div className="assigned-tasks">
        <h2>My Assigned Tasks</h2>
        
        {tasks.map((task) => (
            <div className="task-card" key={task.id}>
            <h3>{task.title}</h3>
            
            <p>{task.description}</p>
            
            <p>
            <strong>Assignee:</strong> {task.Assignee}
            </p>
             <p>
            <strong>Reporter:</strong> {task.reporter}
            </p>
            
            <p>
            <strong>Status:</strong> {task.status}
            </p>
            
            <p>
            <strong>Priority:</strong> {task.priority}
            </p>
            
            <p>
            <strong>Due Date:</strong>{' '}
            {task.due_date
                ? new Date(task.due_date).toLocaleDateString()
                : 'No due date'}
                </p>
                <button onClick={() => navigate(`/tasks/${task.id}`)}>
                View Task
                </button>
                </div>
            ))}
            </div>
        )
    }
    
    export default TaskAssigned
    