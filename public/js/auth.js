// Client auth: login and registration using server endpoints
const loginForm = document.querySelector('#loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const login = loginForm.querySelector('#username').value.trim();
    const password = loginForm.querySelector('#password').value.trim();

    try {
      const res = await fetch('/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка авторизации');
      // store minimal user in sessionStorage for client-side UI (not secure)
      sessionStorage.setItem('currentUser', JSON.stringify(data.user));
      window.location.href = 'header.html';
    } catch (err) {
      const errorEl = document.getElementById('error');
      if (errorEl) errorEl.textContent = err.message;
    }
  });
}

const registerForm = document.querySelector('#registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const login = registerForm.querySelector('#username').value.trim();
    const password = registerForm.querySelector('#password').value.trim();

    try {
      const res = await fetch('/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password, name: login })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
      // success -> go to login page
      window.location.href = 'auth.html';
    } catch (err) {
      const errorEl = document.getElementById('error');
      if (errorEl) errorEl.textContent = err.message;
    }
  });
}

export {};
