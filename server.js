// server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));
app.use(express.static('.'));

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true });
if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- ПУТИ К JSON ФАЙЛАМ ---
const USERS_FILE = 'data/users.json';
const PRODUCTS_FILE = 'data/products.json';

// --- УТИЛИТЫ ---
function readJSON(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]', 'utf-8');
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// --- ЗАГРУЗКА ИЗОБРАЖЕНИЙ ---
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });
  // Return URL relative to server root
  res.json({ url: `/uploads/${req.file.filename}` });
});

// --- LOGIN (auth) ---
app.post('/login', (req, res) => {
  const users = readJSON(USERS_FILE);
  const { login, password } = req.body || {};
  const user = users.find(u => u.login === login && u.password === password);
  if (!user) return res.status(401).json({ success: false, error: 'Неверный логин или пароль' });
  // Don't send password back
  const { password: _p, ...safe } = user;
  res.json({ success: true, user: safe });
});

// --- CRUD ДЛЯ ПРОДУКТОВ ---
app.get('/products', (req, res) => res.json(readJSON(PRODUCTS_FILE)));

app.post('/products', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  writeJSON(PRODUCTS_FILE, products);
  res.json(newProduct);
});

app.put('/products/:id', (req, res) => {
  const products = readJSON(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Товар не найден' });
  products[index] = { ...products[index], ...req.body };
  writeJSON(PRODUCTS_FILE, products);
  res.json(products[index]);
});

app.delete('/products/:id', (req, res) => {
  let products = readJSON(PRODUCTS_FILE);
  products = products.filter(p => p.id != req.params.id);
  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true });
});

// --- CRUD ДЛЯ ПОЛЬЗОВАТЕЛЕЙ ---
app.get('/users', (req, res) => res.json(readJSON(USERS_FILE)));

app.post('/users', (req, res) => {
  const users = readJSON(USERS_FILE);
  const { login, password, name } = req.body;
  if (users.find(u => u.login === login)) return res.status(400).json({ error: 'Пользователь уже существует' });
  const newUser = { id: Date.now(), login, password, name };
  users.push(newUser);
  writeJSON(USERS_FILE, users);
  res.json(newUser);
});

app.put('/users/:id', (req, res) => {
  const users = readJSON(USERS_FILE);
  const index = users.findIndex(u => u.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Пользователь не найден' });
  users[index] = { ...users[index], ...req.body };
  writeJSON(USERS_FILE, users);
  res.json(users[index]);
});

app.delete('/users/:id', (req, res) => {
  let users = readJSON(USERS_FILE);
  users = users.filter(u => u.id != req.params.id);
  writeJSON(USERS_FILE, users);
  res.json({ success: true });
});

// --- СЕРВЕР СТАРТ ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
