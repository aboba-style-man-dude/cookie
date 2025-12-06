CREATE DATABASE cookies_shop;

--  Подключаемся к этой БД
\connect cookies_shop;

-- таблица пользователей
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Таблица печенек (товаров)
CREATE TABLE cookies (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    price_usd       NUMERIC(7, 2) NOT NULL,      -- цена за штуку
    weight_grams    INT NOT NULL,                -- вес одной печеньки
    image_url       VARCHAR(255),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

--  Таблица заказов
CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    user_id         INT REFERENCES users(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'new',
    total_amount    NUMERIC(9, 2) NOT NULL,
    currency        CHAR(3) NOT NULL DEFAULT 'USD',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT orders_status_check
    CHECK (status IN ('new', 'paid', 'shipped', 'cancelled'))
);

--  Таблица позиций заказа
CREATE TABLE order_items (
    id              SERIAL PRIMARY KEY,
    order_id        INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    cookie_id       INT NOT NULL REFERENCES cookies(id),
    quantity        INT NOT NULL,
    price_per_item  NUMERIC(7, 2) NOT NULL,

    CONSTRAINT order_items_quantity_check
    CHECK (quantity > 0)
);

--  Таблица оплат
CREATE TABLE payments (
    id              SERIAL PRIMARY KEY,
    order_id        INT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    amount          NUMERIC(9, 2) NOT NULL,
    payment_method  VARCHAR(50) NOT NULL,        -- например, 'card', 'sbp'
    payment_status  VARCHAR(20) NOT NULL,
    paid_at         TIMESTAMPTZ,

    CONSTRAINT payments_status_check
    CHECK (payment_status IN ('pending', 'successful', 'failed'))
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_cookie_id ON order_items(cookie_id);
