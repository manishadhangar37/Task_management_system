
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const STATUS_COLUMNS = [
    { key: 'todo', label: 'To Do' },
    { key: 'inProgress', label: 'In Progress' },
    { key: 'inReview', label: 'In Review' },
    { key: 'done', label: 'Done' },
];

function normalizeStatus(status) {
    if (!status) return 'todo';
    
    const normalized = String(status)
    .toLowerCase()
    .replace(/[\s_-]/g, '');
    
    const statusMap = {
        todo: 'todo',
        pending: 'todo',
        inprogress: 'inProgress',
        inreview: 'inReview',
        review: 'inReview',
        done: 'done',
        completed: 'done',
    };
    
    return statusMap[normalized] || 'todo';
}

function getInitials(name) {
    if (!name) return '?';
    
    return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function TaskCard({ task }) {
    const navigate = useNavigate();
    const assignee =
    task.assignee ||
    task.assignee ||
    task.assignee_name ||
    task.assignee?.name ||
    'Unassigned';
    
    const priority = task.priority || 'Medium';
    
    return (
        <article className="jira-card">
        <div className="jira-card-header">
        <span className="jira-task-key">
        {task.key || task.task_key || `TASK-${task.id}`}
        </span>
        
        
        </div>
        
        <h4 className="jira-card-title">
        {task.title || 'Untitled task'}
        </h4>
        
        <div className="jira-card-meta">
        <span className="assignee-info">
        <strong>Assignee:</strong>
        
        {task.assignee ? (
            <span className="assignee-avatar-wrapper">
            <span className="assignee-avatar">
            {task.assignee
                .split('@')[0]
                .slice(0, 2)
                .toUpperCase()}
                </span>
                
                <span className="assignee-email">
                {task.assignee}
                </span>
                </span>
            ) : (
                assignee === 'Unassigned'
                ? 'Unassigned'
                : typeof assignee === 'object'
                ? assignee.name || assignee.email || 'Unassigned'
                : assignee
            )}
            </span>
            
            {task.due_date && (
                <span className="jira-due-date">
                Due: {new Date(task.due_date).toLocaleDateString()}
                </span>
            )}
            </div>
            <button type="button" className="jira-view-button" onClick={() => navigate(`/tasks/${task.id}`)}>
            View task
            </button>
            </article>
        );
    }
    
    export default function AssignedTasks() {
        const [tasks, setTasks] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        
        useEffect(() => {
            let active = true;
            
            async function fetchAssignedTasks() {
                try {
                    setLoading(true);
                    setError('');
                    
                    const response = await fetch('/api/tasks/assigned', {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            Accept: 'application/json',
                        },
                    });
                    
                    if (!response.ok) {
                        throw new Error(
                            `Failed to load assigned tasks (${response.status})`
                        );
                    }
                    
                    const data = await response.json();
                    
                    const assignedTasks = Array.isArray(data)
                    ? data
                    : Array.isArray(data.tasks)
                    ? data.tasks
                    : [];
                    
                    if (active) {
                        setTasks(assignedTasks);
                    }
                } catch (err) {
                    if (active) {
                        setError(
                            err.message || 'Unable to load assigned tasks.'
                        );
                    }
                } finally {
                    if (active) {
                        setLoading(false);
                    }
                }
            }
            
            fetchAssignedTasks();
            
            return () => {
                active = false;
            };
        }, []);
        
        if (loading) {
            return (
                <div className="assigned-tasks-page">
                <h2>Assigned to Me</h2>
                <p>Loading assigned tasks...</p>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="assigned-tasks-page">
                <h2>Assigned to Me</h2>
                
                <p role="alert" className="assigned-tasks-error">
                {error}
                </p>
                
                <button
                type="button"
                onClick={() => window.location.reload()}
                >
                Try Again
                </button>
                </div>
            );
        }
        
        return (
            <div className="assigned-tasks-page">
            <div className="assigned-tasks-header">
            <div>
            <h2>Assigned to Me</h2>
            <p>Tasks assigned to you</p>
            </div>
            
            <span className="assigned-tasks-count">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
            </div>
            
            {tasks.length === 0 ? (
                <div className="assigned-tasks-empty">
                <h3>No assigned tasks</h3>
                <p>Tasks assigned to you will appear here.</p>
                </div>
            ) : (
                <div className="jira-board">
                {STATUS_COLUMNS.map((column) => {
                    const columnTasks = tasks.filter(
                        (task) => normalizeStatus(task.status) === column.key
                    );
                    
                    return (
                        <section className="jira-column" key={column.key}>
                        <div className="jira-column-header">
                        <h3>{column.label}</h3>
                        
                        <span className="jira-column-count">
                        {columnTasks.length}
                        </span>
                        </div>
                        
                        <div className="jira-column-content">
                        {columnTasks.length > 0 ? (
                            columnTasks.map((task) => (
                                <TaskCard
                                key={task.id}
                                task={task}
                                />
                            ))
                        ) : (
                            <p className="jira-column-empty">
                            No tasks
                            </p>
                        )}
                        </div>
                        </section>
                    );
                })}
                </div>
            )}
            </div>
        );
    }
    