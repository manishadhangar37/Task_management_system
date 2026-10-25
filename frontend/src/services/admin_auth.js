import {getAuthCsrfToken} from './auth'
export async function getAdminCsrfToken() {
  const response = await fetch('/api/admin/login', {
    credentials: 'include',
    headers: { Accept: 'text/html' },
  })
  console.log(response);
  if (!response.ok) {
    throw new Error('Admin login page is not available.')
  }
  
}
  export async function adminSignIn({ email, password }) {
    const csrfToken = await getAuthCsrfToken()
    console.log('CSRF token:', csrfToken);
    
    const formData = new URLSearchParams({
      'admin_user[email]': email,
      'admin_user[password]': password,
      authenticity_token: csrfToken,
    })
    
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData,
    })
    console.log(response);
    
    if (response.redirected && response.url.includes('/admin')) {
      return
    }
    
    if (response.status === 401 || response.status === 422 || response.redirected) {
      throw new Error('Invalid admin email or password.')
    }
    
    if (!response.ok) {
      throw new Error(`Admin login failed (${response.status}).`)
    }
    
    throw new Error('Invalid admin email or password.')
  }