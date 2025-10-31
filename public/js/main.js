// Client main script: renders product list on catalog pages
const container = document.querySelector('.product-list');
if (container) {
  fetch('/products')
    .then(r => r.json())
    .then(items => {
      container.innerHTML = items.map(p => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p class="price">${p.price} ₽</p>
          <button class="btn-buy" data-id="${p.id}">Подробнее</button>
        </div>
      `).join('');

      container.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.currentTarget.dataset.id;
          window.location.href = `product.html?id=${id}`;
        });
      });
    })
  .catch(err => console.error("Can't load products", err));
}

// If on product.html, load specific product
const productContainer = document.querySelector('.product-container');
if (productContainer) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'), 10);
  fetch('/products')
    .then(r => r.json())
    .then(products => {
      const p = products.find(x => x.id === id);
      if (!p) return;
      const img = productContainer.querySelector('.product-image img');
      const title = productContainer.querySelector('.product-info h2');
      const desc = productContainer.querySelector('.product-info p.description');
      const price = productContainer.querySelector('.product-info p.price');
      if (img) img.src = p.image;
      if (title) title.textContent = p.name;
      if (desc) desc.textContent = p.description || '';
      if (price) price.textContent = `${p.price} ₽`;
    });
}

// Simple header link behavior (if needed)
const loginLinks = document.querySelectorAll('a[href="auth.html"]');
loginLinks.forEach(a => a.addEventListener('click', () => {}));

export {};
