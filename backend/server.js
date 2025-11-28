//  сервер Express с корзиной в сессии
// запуск - node backend/server.js

const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

app.use(express.json());

// Сессии (корзина будет храниться в req.session.cart)
app.use(session({
    secret: 'super-cookie-secret', // любая строка
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 час
    }
}));

// Хелпер: инициализируем корзину в сессии
function ensureCart(req) {
    if (!req.session.cart) {
        req.session.cart = []; // массив товаров { name, pr, we, descr, kart, qty }
    }
}

//API для корзины

// Получить корзину
app.get('/api/cart', (req, res) => {
    ensureCart(req);
    res.json(req.session.cart);
});

// Добавить товар (или увеличить qty, если такой уже есть)
app.post('/api/cart/add', (req, res) => {
    ensureCart(req);
    const { name, pr, we, descr, kart, qty } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }

    const qtyNum = Number(qty) || 1;
    const priceNum = Number(pr) || 0;

    // ищем товар по имени
    const existing = req.session.cart.find(item => item.name === name);
    if (existing) {
        existing.qty += qtyNum;
    } else {
        req.session.cart.push({
            name,
            pr: priceNum,
            we,
            descr,
            kart,
            qty: qtyNum
        });
    }

    res.json(req.session.cart);
});

// Изменить количество товара (delta = +1 / -1)
app.post('/api/cart/change-qty', (req, res) => {
    ensureCart(req);
    const { name, delta } = req.body;

    const d = Number(delta) || 0;
    const item = req.session.cart.find(i => i.name === name);

    if (!item) {
        return res.status(404).json({ error: 'item not found' });
    }

    item.qty += d;
    if (item.qty <= 0) {
        // удаляем полностью
        req.session.cart = req.session.cart.filter(i => i.name !== name);
    }

    res.json(req.session.cart);
});

// Удалить товар полностью
app.post('/api/cart/delete', (req, res) => {
    ensureCart(req);
    const { name } = req.body;

    req.session.cart = req.session.cart.filter(i => i.name !== name);

    res.json(req.session.cart);
});

// Очистить всю корзину
app.post('/api/cart/clear', (req, res) => {
    req.session.cart = [];
    res.json([]);
});

// (по желанию) раздаём статику, чтобы сайт открывался по http://localhost:3000
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
