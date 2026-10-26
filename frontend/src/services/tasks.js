import { getAuthCsrfToken } from './auth'
async function responseJson(response) {
  const body = await response.text()

  try {
    return body ? JSON.parse(body) : {}
  } catch {
    if (response.url.includes('/users/sign_in')) {
      throw new Error('Your Rails session has expired. Sign in, then try again.')
    }

    throw new Error(
      `The server returned an unexpected page (HTTP ${response.status}). Make sure Rails is running at localhost:3000 and that you are signed in.`,
    )
  }
}



export async function createTask(task) {
  const csrfToken = await getAuthCsrfToken()
  const response = await fetch('/api/tasks', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ task }),
  })
  const result = await responseJson(response)

  if (!response.ok) {
    throw new Error(result.errors?.join(', ') || 'Unable to create task. Please try again.')
  }

  return result
}

export async function getTasks() {
  const response = await fetch('/api/tasks', {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  const result = await responseJson(response)
  if (response.status === 401) {
  window.location.replace('/sign_in')
  throw new Error('Please sign in to continue.')
}

  return result
}

export async function getTask(id) {
  const response = await fetch(`/api/tasks/${id}`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  const result = await responseJson(response)

  if (!response.ok) {
    throw new Error(result.errors?.join(', ') || 'Unable to load this task.')
  }

  return result
}

export async function updateTask(id, payload) {
  const csrfToken = await getAuthCsrfToken()
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ task: payload }),
    
  })
  const result = await responseJson(response)

  if (!response.ok) {
    throw new Error(result.errors?.join(', ') || 'Unable to update task.')
  }

  return result
}

export async function updateTaskStatus(id, status) {
  return updateTask(id, { status })
}

 export async function fetchAdminUsers() {
    try {
      const csrf_token = await getAuthCsrfToken()
      const response = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'X-CSRF-Token': csrf_token,
        },
      });
       
      if (!response.ok) {
        throw new Error('Failed to load users.');
      }

      const data = await response.json();
     return data
      
    } catch (err) {
      console.error(err.message);
    }
        
    
  }