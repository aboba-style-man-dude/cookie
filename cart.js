//теперь корзина хранится на сервере 

const cartItemsContainer = (document.getElementsByClassName('cart__list'))[0];
const delInCart = (document.getElementsByClassName('delCart'))[0];
const changeValuta = document.getElementsByClassName('perValuta')[0];

const formZakaz = document.getElementsByClassName('formZakaz')[0];
const closeButton = document.getElementById('closeButton');
const orderProductName = document.getElementById('orderProductName');
const orderCartBtn = document.getElementsByClassName('orderCartBtn')[0];

let cart = [];          // корзина приходит с сервера
let newV1 = "$";        // символ валюты
let currentRate = 1;    // 1 для $, 98 для ₽

// загрузка корзины с сервера
function loadCartFromServer() {
    fetch('/api/cart', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            cart = Array.isArray(data) ? data : [];
            render();
        })
        .catch(err => {
            console.error('Ошибка при загрузке корзины', err);
            cart = [];
            render();
        });
}

// сумма в базовой валюте ($) без учёта доставки
function getCartBaseSum() {
    let sm = 0;
    cart.forEach(item => {
        const price = Number(item.pr) || 0;
        const qty = Number(item.qty) || 1;
        sm += price * qty;
    });
    return sm;
}

// Очистить корзину полностью
delInCart.addEventListener('click', function () {
    fetch('/api/cart/clear', {
        method: 'POST',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(() => {
            cart = [];
            render();
        })
        .catch(err => console.error('Ошибка при очистке корзины', err));
});

// переключение валюты (обновляем знак и курс)
changeValuta.addEventListener('click', function (e) {
    const currentV = e.target.innerText;

    let newV = "$";
    let c = 1;

    if (currentV === "$") {
        newV = "₽";
        c = 98;
    }
    newV1 = newV;
    currentRate = c;
    e.target.innerText = newV;

    // обновляем цены в карточках
    const prices = document.getElementsByClassName('products-items-price');
    for (let i = 0; i < prices.length; i++) {
        const basePriceTotal = Number(prices[i].getAttribute('base-price') || 0);
        prices[i].innerText = "Цена: " + String(Math.round(basePriceTotal * currentRate)) + " " + newV1;
    }

    // обновляем итог
    updateTotal();
});

// создать карточку позиции в корзине
function createPosition(obj) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');

    const imgPthshnInCart = document.createElement('img');
    imgPthshnInCart.classList.add("products-items-image");
    imgPthshnInCart.src = obj.kart;
    imgPthshnInCart.alt = obj.name;

    const infoDiv = document.createElement('div');

    const positionTitle = document.createElement('h3');
    positionTitle.innerText = obj.name;

    const positionDescr = document.createElement('p');
    positionDescr.innerText = obj.descr;

    const pricePerOne = Number(obj.pr) || 0;
    const qty = Number(obj.qty) || 1;
    const basePriceTotal = pricePerOne * qty; // базовая сумма в $
    const displayPrice = Math.round(basePriceTotal * currentRate);

    // цена
    const positionPrice = document.createElement('div');
    positionPrice.classList.add("products-items-price");
    positionPrice.innerText = `Цена: ${displayPrice} ${newV1}`;
    positionPrice.setAttribute('base-price', basePriceTotal);

    // вес: считаем, что 1 "позиция" = 2 шт / 200 гр
    const baseCount = 2;
    const baseGrams = 200;
    const totalCount = baseCount * qty;
    const totalGrams = baseGrams * qty;

    const positionWeight = document.createElement('p');
    positionWeight.classList.add("cart-item-weight");
    positionWeight.innerText = `${totalCount} шт / ${totalGrams} гр`;

    infoDiv.appendChild(positionTitle);
    infoDiv.appendChild(positionDescr);
    infoDiv.appendChild(positionPrice);
    infoDiv.appendChild(positionWeight);

    // кнопка-мусорка (удалить все такие товары)
    const imgDel = document.createElement('img');
    imgDel.src = "images/icons8-trash-30.png";
    imgDel.alt = "Удалить из корзины";

    const btnDelPrfromCart = document.createElement('button');
    btnDelPrfromCart.classList.add("delPfromCart");
    btnDelPrfromCart.appendChild(imgDel);

    btnDelPrfromCart.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteByName(obj.name);
    });

    // счётчик количества
    const counter = document.createElement('div');
    counter.classList.add('cart-item-counter');

    const minusBtn = document.createElement('button');
    minusBtn.classList.add('counter-btn', 'counter-minus');
    minusBtn.innerText = '−';

    const qtySpan = document.createElement('span');
    qtySpan.classList.add('counter-value');
    qtySpan.innerText = qty;

    const plusBtn = document.createElement('button');
    plusBtn.classList.add('counter-btn', 'counter-plus');
    plusBtn.innerText = '+';

    counter.appendChild(minusBtn);
    counter.appendChild(qtySpan);
    counter.appendChild(plusBtn);

    // футер: мусорка + счётчик
    const footer = document.createElement('div');
    footer.classList.add('cart-item-footer');
    footer.appendChild(btnDelPrfromCart);
    footer.appendChild(counter);

    plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        changeQty(obj.name, +1);
    });

    minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        changeQty(obj.name, -1);
    });

    itemDiv.appendChild(imgPthshnInCart);
    itemDiv.appendChild(infoDiv);
    itemDiv.appendChild(footer);

    return itemDiv;
}

// изменить количество товара на сервере
function changeQty(name, delta) {
    fetch('/api/cart/change-qty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, delta })
    })
        .then(res => res.json())
        .then(data => {
            cart = Array.isArray(data) ? data : [];
            render();
        })
        .catch(err => console.error('Ошибка при изменении количества', err));
}

// удалить товар полностью
function deleteByName(name) {
    fetch('/api/cart/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name })
    })
        .then(res => res.json())
        .then(data => {
            cart = Array.isArray(data) ? data : [];
            render();
        })
        .catch(err => console.error('Ошибка при удалении товара', err));
}

// обновить блок "Итого к оплате"
function updateTotal() {
    const base = getCartBaseSum();          // сумма товаров в $
    const productsSumDisplay = Math.round(base * currentRate);

    // доставка: фиксированная — 5$ или 300₽, если в корзине что-то есть
    let delivery = 0;
    if (base > 0) {
        delivery = (newV1 === '$') ? 5 : 300;
    }

    const totalDisplay = productsSumDisplay + delivery;

    let totalDiv = document.querySelector('.cart-total');
    if (!totalDiv) {
        totalDiv = document.createElement('div');
        totalDiv.classList.add('cart-total');
        document.body.appendChild(totalDiv);
    }

    const deliveryText = delivery > 0
        ? ` (включая доставку ${delivery} ${newV1})`
        : '';

    totalDiv.innerText = `Итого к оплате: ${totalDisplay} ${newV1}${deliveryText}`;
}

// основной рендер корзины
function render() {
    const orderCartBtn = document.querySelector('.orderCartBtn');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "";
        cartItemsContainer.classList.add('cart__list_empty');

        orderCartBtn.classList.add('hidden');

        const totalDiv = document.querySelector('.cart-total');
        if (totalDiv) totalDiv.remove();

        const emptyBlock = document.createElement('div');
        emptyBlock.classList.add('cart__list_nothing');

        const emptyText = document.createElement('p');
        emptyText.classList.add('cart-empty-text');
        emptyText.innerText = "Корзина пока пуста";

        const catalogLink = document.createElement('a');
        catalogLink.classList.add('cataloglink');
        catalogLink.innerText = "Перейти в каталог";
        catalogLink.href = "allpechenki.html";

        emptyBlock.appendChild(emptyText);
        emptyBlock.appendChild(catalogLink);

        cartItemsContainer.appendChild(emptyBlock);
    } else {
        cartItemsContainer.classList.remove('cart__list_empty');
        orderCartBtn.classList.remove('hidden');

        cartItemsContainer.innerHTML = "";

        cart.forEach(item => {
            const itemDiv = createPosition(item);
            cartItemsContainer.appendChild(itemDiv);
        });

        updateTotal();
    }
}

// кнопка "Заказать всё"
orderCartBtn.addEventListener('click', function () {
    const base = getCartBaseSum();
    const productsSumDisplay = Math.round(base * currentRate);
    const delivery = base > 0 ? ((newV1 === '$') ? 5 : 300) : 0;
    const totalDisplay = productsSumDisplay + delivery;

    orderProductName.innerText = `Сумма заказа: ${totalDisplay} ${newV1}`;
    formZakaz.style.display = 'block';
});

// закрытие формы при нажатии на крестик
closeButton.addEventListener('click', function () {
    formZakaz.style.display = 'none';
});

// закрытие формы при клике вне
window.addEventListener('click', function (event) {
    if (event.target === formZakaz) {
        formZakaz.style.display = 'none';
    }
});

// отправка формы заказа
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;

    alert(`Заказ оформлен!\nИмя: ${name}\nАдрес: ${address}`);

    // очищаем корзину на сервере
    fetch('/api/cart/clear', {
        method: 'POST',
        credentials: 'include'
    })
        .then(res => res.json())
        .then(() => {
            cart = [];
            render();
            formZakaz.style.display = 'none';
        })
        .catch(err => console.error('Ошибка при очистке после заказа', err));
});

// загружаем корзину при открытии страницы
document.addEventListener('DOMContentLoaded', loadCartFromServer);
