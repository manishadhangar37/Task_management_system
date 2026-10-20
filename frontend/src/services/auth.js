export async function getAuthCsrfToken() {
  const pageToken = document.querySelector('meta[name="csrf-token"]')?.content
  if (pageToken) return pageToken

  const response = await fetch('/api/users/sign_in', {
    credentials: 'include',
    headers: { Accept: 'text/html' },
  })
  const html = await response.text()
  const documentFragment = new DOMParser().parseFromString(html, 'text/html')
  const token = documentFragment.querySelector('meta[name="csrf-token"]')?.content
    || documentFragment.querySelector('input[name="authenticity_token"]')?.value

  if (!token) {
    throw new Error('Could not load the secure sign-in form. Check that Rails is running and try again.')
  }

  return token
}

export async function signIn({ email, password, remember }) {
  const csrfToken = await getAuthCsrfToken()
  const formData = new URLSearchParams({
    'user[email]': email,
    'user[password]': password,
    'user[remember_me]': remember ? '1' : '0',
    authenticity_token: csrfToken,
  })

  const response = await fetch('/api/users/sign_in', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: formData,
  })

  if (response.redirected && !new URL(response.url).pathname.endsWith('/users/sign_in')) {
    return
  }

  if (response.status === 422 || response.redirected) {
    throw new Error('We couldn’t sign you in. Check your email and password, then try again.')
  }

  if (!response.ok) {
    throw new Error(`Sign-in failed (HTTP ${response.status}). Please try again.`)
  }

  throw new Error('We couldn’t sign you in. Check your email and password, then try again.')
}
