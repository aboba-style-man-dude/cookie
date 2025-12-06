//  сервер Express с корзиной в сессии
// запуск - node backend/server.js
// /Applications/Postgres.app/Contents/Versions/18/bin/psql -d cookies_shop

// backend/server.js
const pool = require('./db');
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// проверка, что есть доступ к базе
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.json({ ok: true, time: result.rows[0].now });
  } catch (err) {
    console.error('DB test error:', err);
    res.status(500).json({ ok: false, error: 'DB error' });
  }
});



// JSON body
app.use(express.json());

// сессии (корзина будет лежать в req.session.cart)
app.use(
  session({
    secret: 'cookies-secret',
    resave: false,
    saveUninitialized: true,
  })
);

// раздаём весь проект как статику (html, css, js, images)
app.use(express.static(path.join(__dirname, '..')));

// хелпер: получить корзину из сессии
function getSessionCart(req) {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  return req.session.cart;
}

// --- API КОРЗИНЫ ---

// вернуть корзину
app.get('/api/cart', (req, res) => {
  const cart = getSessionCart(req);
  res.json(cart);
});

// обновить количество товара (добавление/уменьшение/удаление)
app.post('/api/cart/update', (req, res) => {
  const { name, price, weight, descr, image, qty } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const cart = getSessionCart(req);
  const index = cart.findIndex((item) => item.name === name);

  if (!qty || qty <= 0) {
    // qty <= 0 → удаляем из корзины
    if (index !== -1) {
      cart.splice(index, 1);
    }
  } else if (index === -1) {
    // товара ещё нет → добавляем
    cart.push({
      name,
      descr,
      price: Number(price) || 0,
      weight,
      image,
      qty: Number(qty) || 1,
    });
  } else {
    // товар уже есть → обновляем количество и остальные поля
    cart[index].qty = Number(qty) || 1;
    cart[index].price = Number(price) || cart[index].price;
    cart[index].weight = weight || cart[index].weight;
    cart[index].descr = descr || cart[index].descr;
    cart[index].image = image || cart[index].image;
  }

  res.json({ success: true, cart });
});

// оформить заказ: создать запись в БД на основе корзины
app.post('/api/orders', async (req, res) => {
  const cart = req.session.cart || [];
  const { userId, paymentMethod } = req.body; 
  // userId можно пока передавать просто числом (например, 1),
  // если авторизацию ещё не делала

  if (cart.length === 0) {
    return res.status(400).json({ error: 'Корзина пуста' });
  }

  // считаем сумму
  const totalAmount = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1) создаём заказ
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, total_amount, currency)
       VALUES ($1, 'new', $2, 'USD')
       RETURNING id`,
      [userId || null, totalAmount]
    );
    const orderId = orderResult.rows[0].id;

    // 2) строки заказа
    for (const item of cart) {
      // если у товара нет id, пропускаем его, чтобы не падала БД
      if (!item.id) {
        console.log('Пропущен item без id:', item);
        continue;
      }

      await client.query(
        `INSERT INTO order_items (order_id, cookie_id, quantity, price_per_item)
        VALUES ($1, $2, $3, $4)`,
        [
          orderId,
          item.id,
          item.qty,
          item.price
        ]
      );
    }


    // 3) запись об оплате (пока ожидает)
    await client.query(
      `INSERT INTO payments (order_id, amount, payment_method, payment_status)
       VALUES ($1, $2, $3, 'pending')`,
      [orderId, totalAmount, paymentMethod || 'card']
    );

    await client.query('COMMIT');

    // очищаем корзину
    req.session.cart = [];

    res.json({ success: true, orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  } finally {
    client.release();
  }
});


// старт сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
