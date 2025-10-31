import { validateForm } from './validation.js';
import { loginUser, registerUser } from './auth.js';
import { renderProductList, loadProducts } from './products.js';

// --- ЛОГИН ---
const loginForm = document.querySelector('#loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const login = loginForm.querySelector('#username').value.trim();
    const password = loginForm.querySelector('#password').value.trim();

    const { isValid, loginError, passwordError } = validateForm(login, password);
    if (!isValid) {
      alert(`${loginError || ''}\n${passwordError || ''}`);
      return;
    }

    const result = loginUser(login, password);
    if (result.success) {
      alert(`Добро пожаловать, ${result.user.name}!`);
      window.location.href = 'header.html';
    } else {
      alert(result.error);
    }
  });
}

// --- РЕГИСТРАЦИЯ ---
const registerForm = document.querySelector('#registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();

    const login = registerForm.querySelector('#username').value.trim();
    const password = registerForm.querySelector('#password').value.trim();
    const confirm = registerForm.querySelector('#confirm').value.trim();

    if (password !== confirm) {
      alert('Пароли не совпадают!');
      return;
    }

    const { isValid, loginError, passwordError } = validateForm(login, password);
    if (!isValid) {
      alert(`${loginError || ''}\n${passwordError || ''}`);
      return;
    }

    const result = registerUser(login, password, login);
    if (result.success) {
      alert('Регистрация успешна!');
      window.location.href = 'auth.html';
    } else {
      alert(result.error);
    }
  });
}

// --- КАТАЛОГ ---
const productListContainer = document.querySelector('.product-list');
if (productListContainer) {
  renderProductList(productListContainer);
}

// --- СТРАНИЦА ТОВАРА ---
const productContainer = document.querySelector('.product-container');
if (productContainer) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'), 10);
  const products = loadProducts(); // Получаем товары из JSON
  const product = products.find(p => p.id === id);

  if (product) {
    productContainer.querySelector('.product-image img').src = product.image;
    productContainer.querySelector('.product-info h2').textContent = product.name;
    productContainer.querySelector('.product-info p.description').textContent = product.description;
    productContainer.querySelector('.product-info p.price').textContent = `${product.price} ₽`;
  }
}
