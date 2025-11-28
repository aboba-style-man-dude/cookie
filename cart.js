//Изменения (cart.js): группировка одинаковых товаров, счётчик количества, доставка и корректный расчёт суммы

const cartItemsContainer = (document.getElementsByClassName('cart__list'))[0];
const delInCart = (document.getElementsByClassName('delCart'))[0];
const changeValuta = document.getElementsByClassName('perValuta')[0];

const formZakaz = document.getElementsByClassName('formZakaz')[0];
const closeButton = document.getElementById('closeButton');
const orderProductName = document.getElementById('orderProductName');
const orderCartBtn = document.getElementsByClassName('orderCartBtn')[0];

function loadData() { //функция для получения данных из loсаlStorage
    const savedData = localStorage.getItem('cart'); 
    return savedData ? JSON.parse(savedData) : [];
}

const cart = loadData();
console.log(cart);

//Изменения: текущая валюта и курс
let newV1 = "$";      // символ
let currentRate = 1;  // 1 для $, 98 для ₽

//Изменения: вспомогательная функция — сгруппировать корзину по названию товара
function getCartGroups() {
    const map = new Map();

    cart.forEach(item => {
        const key = item.name;          // считаем, что имя печеньки уникально
        if (!map.has(key)) {
            map.set(key, { ...item, qty: 0 });
        }
        map.get(key).qty += 1;
    });

    return Array.from(map.values());    // массив объектов { name, pr, we, kart, descr, qty }
}

//Изменения: сумма в базовой валюте ($) без учёта доставки
function getCartBaseSum() {
    const groups = getCartGroups();
    let sm = 0;
    groups.forEach(item => {
        sm += Number(item.pr) * item.qty;
    });
    return sm;
}

//Очистить корзину полностью
delInCart.addEventListener('click', function () {
    localStorage.clear();
    location.reload();
});

//Изменения: переключение валюты (обновляем знак и курс)
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

    // обновляем цену в карточках
    const prices = document.getElementsByClassName('products-items-price');
    for (let i = 0; i < prices.length; i++) {
        const basePrice = Number(prices[i].getAttribute('base-price') || 0);
        prices[i].innerText = "Цена: " + String(Math.round(basePrice * currentRate)) + newV1;
    }

    // обновляем итог
    updateTotal();
});

//Изменения: создать карточку позиции в корзине (уже сгруппированную, с qty)
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

    const positionPrice = document.createElement('div');
    positionPrice.classList.add("products-items-price");
    positionPrice.innerText = "Цена: " + Math.round(obj.pr * currentRate) + newV1;
    // цена за одну штуку в базе ($) — нужна для конвертации
    positionPrice.setAttribute('base-price', obj.pr);

    const positionWeight = document.createElement('p');
    positionWeight.innerText = obj.we;

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

    //Изменения: счётчик количества внизу карточки
    const counter = document.createElement('div');
    counter.classList.add('cart-item-counter');

    const minusBtn = document.createElement('button');
    minusBtn.classList.add('counter-btn', 'counter-minus');
    minusBtn.innerText = '−';

    const qtySpan = document.createElement('span');
    qtySpan.classList.add('counter-value');
    qtySpan.innerText = obj.qty;

    const plusBtn = document.createElement('button');
    plusBtn.classList.add('counter-btn', 'counter-plus');
    plusBtn.innerText = '+';

    counter.appendChild(minusBtn);
    counter.appendChild(qtySpan);
    counter.appendChild(plusBtn);

    // footer карточки: слева мусорка, по центру счётчик
    const footer = document.createElement('div');
    footer.classList.add('cart-item-footer');
    footer.appendChild(btnDelPrfromCart);
    footer.appendChild(counter);

    // обработчики + / -
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

//Изменения: сохраняем корзину и перерисовываем
function syncData() {
    localStorage.setItem('cart', JSON.stringify(cart));
    render();
}

//Изменения: изменить количество по имени товара (delta = +1 или -1)
function changeQty(name, delta) {
    if (delta > 0) {
        const sample = cart.find(item => item.name === name);
        if (sample) {
            cart.push({ ...sample, id: Date.now() });
        }
    } else if (delta < 0) {
        const index = cart.findIndex(item => item.name === name);
        if (index !== -1) {
            cart.splice(index, 1);
        }
    }
    syncData();
}

//Изменения: удалить товар полностью из корзины (все экземпляры)
function deleteByName(name) {
    for (let i = cart.length - 1; i >= 0; i--) {
        if (cart[i].name === name) {
            cart.splice(i, 1);
        }
    }
    syncData();
}

//Изменения: обновить блок с итоговой суммой с учётом доставки
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

//Изменения: основной рендер корзины
function render() {
    const orderCartBtn = document.querySelector('.orderCartBtn');

    // если корзина пустая
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "";
        cartItemsContainer.classList.add('cart__list_empty');

        // скрываем кнопку "Заказать все"
        orderCartBtn.classList.add('hidden');

        // убираем блок "Итого к оплате", если он был
        const totalDiv = document.querySelector('.cart-total');
        if (totalDiv) totalDiv.remove();

        // общий контейнер для сообщения и ссылки
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

        // рисуем сгруппированные товары
        const groups = getCartGroups();
        groups.forEach(item => {
            const itemDiv = createPosition(item);
            cartItemsContainer.appendChild(itemDiv);
        });

        updateTotal();
    }
}

render();

//Изменения: обработчик кнопки "Заказать всё" — показываем сумму с учётом выбранной валюты
orderCartBtn.addEventListener('click', function () {
    const base = getCartBaseSum();
    const productsSumDisplay = Math.round(base * currentRate);
    const delivery = base > 0 ? ((newV1 === '$') ? 5 : 300) : 0;
    const totalDisplay = productsSumDisplay + delivery;

    orderProductName.innerText = `Сумма заказа: ${totalDisplay} ${newV1}`;
    formZakaz.style.display = 'block';
});

// Закрытие формы при нажатии на крестик
closeButton.addEventListener('click', function () {
    formZakaz.style.display = 'none';
});

// Закрытие формы при нажатии вне её области
window.addEventListener('click', function (event) {
    if (event.target === formZakaz) {
        formZakaz.style.display = 'none';
    }
});

// Обработка отправки формы (как было, пока без Express)
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;

    alert(`Заказ оформлен!\nИмя: ${name}\nАдрес: ${address}`);
    formZakaz.style.display = 'none';

    // Очистка корзины после заказа
    localStorage.clear();
    location.reload();
});
