
export function getSession() {
  if (typeof window === 'undefined') return null;
  
  // If using localStorage
  const token = localStorage.getItem('token');
  return token ? { token } : null;

  // If using cookies
  // const token = document.cookie
  //   .split('; ')
  //   .find((row) => row.startsWith('token='))
  //   ?.split('=')[1];
  // return token ? { token } : null;
}

export function setSession(token: string) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('token', token);

  // If using cookies instead:
  // document.cookie = `token=${token}; path=/;`;
}

export function clearSession() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('token');

  // If using cookies instead:
  // document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}
