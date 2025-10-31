// Admin client: manage users and products, upload images
async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Network error');
  return data;
}

// --- Products UI ---
const productsTable = document.getElementById('productsTable');
const productForm = document.getElementById('productForm');
if (productsTable) {
  async function loadProducts() {
    const items = await fetchJSON('/products');
    productsTable.innerHTML = items.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td><img src="${p.image}" style="width:80px;"/></td>
        <td>
          <button data-id="${p.id}" class="edit-prod">Edit</button>
          <button data-id="${p.id}" class="del-prod">Delete</button>
        </td>
      </tr>
    `).join('');

    productsTable.querySelectorAll('.del-prod').forEach(b => b.addEventListener('click', async e => {
      const id = e.currentTarget.dataset.id;
      if (!confirm('Удалить товар?')) return;
      await fetchJSON(`/products/${id}`, { method: 'DELETE' });
      await loadProducts();
    }));

    productsTable.querySelectorAll('.edit-prod').forEach(b => b.addEventListener('click', async e => {
      const id = e.currentTarget.dataset.id;
      const items = await fetchJSON('/products');
      const p = items.find(x => x.id == id);
      if (!p) return;
      // fill form
      productForm.dataset.edit = id;
      productForm.querySelector('[name="name"]').value = p.name;
      productForm.querySelector('[name="price"]').value = p.price;
      productForm.querySelector('[name="description"]').value = p.description || '';
      productForm.querySelector('#currentImage').src = p.image || '';
    }));
  }
  loadProducts().catch(err => console.error(err));
}

if (productForm) {
  productForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData();
    const name = productForm.querySelector('[name="name"]').value.trim();
    const price = parseFloat(productForm.querySelector('[name="price"]').value) || 0;
    const description = productForm.querySelector('[name="description"]').value.trim();
    const fileInput = productForm.querySelector('[name="imageFile"]');

    let imageUrl = productForm.querySelector('#currentImage').src || '';

    if (fileInput && fileInput.files && fileInput.files[0]) {
      fd.append('image', fileInput.files[0]);
      const up = await fetch('/upload', { method: 'POST', body: fd });
      const upData = await up.json();
      imageUrl = upData.url;
    }

    const payload = { name, price, description, image: imageUrl };

    try {
      if (productForm.dataset.edit) {
        const id = productForm.dataset.edit;
        await fetchJSON(`/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        delete productForm.dataset.edit;
      } else {
        await fetchJSON('/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      productForm.reset();
      document.getElementById('currentImage').src = '';
      if (productsTable) await (async () => { const ev = new Event('reload'); productsTable.dispatchEvent(ev); })();
      await fetchJSON('/products');
      // reload products
      if (productsTable) await (async () => { window.location.reload(); })();
    } catch (err) {
      alert(err.message);
    }
  });
}

// --- Users UI (simple) ---
const usersTable = document.getElementById('usersTable');
const userForm = document.getElementById('userForm');
if (usersTable) {
  async function loadUsers() {
    const items = await fetchJSON('/users');
    usersTable.innerHTML = items.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.login}</td>
        <td>${u.name || ''}</td>
        <td>
          <button data-id="${u.id}" class="del-user">Delete</button>
        </td>
      </tr>
    `).join('');

    usersTable.querySelectorAll('.del-user').forEach(b => b.addEventListener('click', async e => {
      const id = e.currentTarget.dataset.id;
      if (!confirm('Удалить пользователя?')) return;
      await fetchJSON(`/users/${id}`, { method: 'DELETE' });
      await loadUsers();
    }));
  }
  loadUsers().catch(err => console.error(err));
}

if (userForm) {
  userForm.addEventListener('submit', async e => {
    e.preventDefault();
    const login = userForm.querySelector('[name="login"]').value.trim();
    const password = userForm.querySelector('[name="password"]').value;
    const name = userForm.querySelector('[name="name"]').value.trim() || login;
    try {
      await fetchJSON('/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ login, password, name }) });
      userForm.reset();
      if (usersTable) await loadUsers();
    } catch (err) { alert(err.message); }
  });
}

export {};
