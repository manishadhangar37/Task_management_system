
export async function getAuthCsrfToken() {
  const response = await fetch('/csrf_token', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Could not fetch CSRF token. Please try again.');
  }

  const data = await response.json();

  if (!data.csrf_token) {
    throw new Error('CSRF token not found in response.');
  }

  return data.csrf_token;
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



export async function signOut() {
  const csrf_token = await getAuthCsrfToken()
  
  const response = await fetch('api/users/sign_out', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-CSRF-Token': csrf_token,
    },
  })

  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`)
  }

  return true
}

export async function getUser() {
  const current_user = await fetch('/api/current_user', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })
  const data = await current_user.json()
  return data
}

