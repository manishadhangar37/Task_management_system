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

async function getCsrfToken() {
  const pageToken = document.querySelector('meta[name="csrf-token"]')?.content
  if (pageToken) return pageToken

  const response = await fetch('/api/tasks', {
    credentials: 'include',
    headers: { Accept: 'text/html' },
  })

  if (response.url.includes('/users/sign_in')) {
    throw new Error('Sign in to Rails before creating a task.')
  }
  if (!response.ok) {
    throw new Error(
      `Could not load a Rails security token (HTTP ${response.status}). Make sure Rails is running at localhost:3000 and you are signed in.`,
    )
  }

  const html = await response.text()
  const token = new DOMParser()
    .parseFromString(html, 'text/html')
    .querySelector('meta[name="csrf-token"]')?.content

  if (!token) throw new Error('Rails did not provide a security token. Reload the page and try again.')
  return token
}

export async function createTask(task) {
  const csrfToken = await getCsrfToken()
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
