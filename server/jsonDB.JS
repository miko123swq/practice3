// server/jsonDB.js
import fs from 'fs';
import path from 'path';

const usersFile = path.join('data', 'users.json');
const productsFile = path.join('data', 'products.json');

// Получить данные из файла
export function readJSON(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Сохранить данные в файл
export function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Пользователи
export function getUsers() {
  return readJSON(usersFile);
}

export function saveUsers(users) {
  writeJSON(usersFile, users);
}

// Товары
export function getProducts() {
  return readJSON(productsFile);
}

export function saveProducts(products) {
  writeJSON(productsFile, products);
}
