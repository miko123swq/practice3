// server/products.js
import { getProducts } from 'server/jsonDB.js';

// Получаем все товары
export function loadProducts() {
  return getProducts(); // читаем из products.json
}

// Генерация HTML-карточки товара
export function renderProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price} ₽</p>
      <button>Подробнее</button>
    </div>
  `;
}

// Рендер списка товаров в контейнере
export function renderProductList(container) {
  const items = loadProducts();
  container.innerHTML = items.map(renderProductCard).join('');

  container.querySelectorAll('.product-card button').forEach(btn => {
    btn.addEventListener('click', e => {
      const card = e.target.closest('.product-card');
      const id = card.dataset.id;
      window.location.href = `product.html?id=${id}`;
    });
  });
}
