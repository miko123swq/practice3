// server/auth.js
import { getUsers, saveUsers } from 'server/jsonDB.js';

// Вход пользователя
export function loginUser(login, password) {
  const users = getUsers(); // читаем пользователей из users.json
  const user = users.find(u => u.login === login && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, error: 'Неверный логин или пароль' };
}

// Регистрация нового пользователя
export function registerUser(login, password, name) {
  const users = getUsers(); // читаем текущих пользователей
  if (users.find(u => u.login === login)) {
    return { success: false, error: 'Пользователь с таким логином уже существует' };
  }
  const newUser = { id: users.length + 1, login, password, name };
  users.push(newUser);
  saveUsers(users); // сохраняем пользователей обратно в users.json
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return { success: true, user: newUser };
}

// Выход пользователя
export function logoutUser() {
  localStorage.removeItem('currentUser');
}

// Получение текущего пользователя
export function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}
