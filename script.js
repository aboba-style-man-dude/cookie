//теперь работает с Express-сервером (без localStorage)

const productsList = document.querySelector('.products-items'); // все товары

// для оформления заказа (модалка "Купить сейчас")
const formZakaz = document.getElementsByClassName('formZakaz')[0];
const closeButton = document.getElementById('closeButton');

const orderProductImage = document.getElementById('orderProductImage');
const orderProductTitle = document.getElementById('orderProductTitle');
const orderProductPrice = document.getElementById('orderProductPrice');
const orderProductQty = document.getElementById('orderProductQty');
const orderForm = document.getElementById('orderForm');

const changeValuta = document.getElementsByClassName('perValuta')[0];
const prices = document.getElementsByClassName('products-items-price');

const data = [
    {
        name: "Лучшие друзья",
        kart: "images/1.png",
        descr: "Печенье, с которого все началось! Наше фирменное печенье с шоколадной крошкой и грецкими орехами хрустящее снаружи с достаточно толстой и липкой серединкой.",
        pr: "20",
        we: "2 шт./ 200 гр."
    },
    {
        name: "Шоколадный француз",
        kart: "images/2.png",
        descr: "Это печенье, изготовленное из тёмного французского какао и полусладкой шоколадной стружки, наверняка удовлетворит даже самого заядлого любителя шоколада.",
        pr: "24",
        we: "2 шт./ 200 гр."
    },
    {
        name: "Овсянка с изюмом, Сэр!",
        kart: "images/3.png",
        descr: "Это сдобное маслянистое печенье весом шесть унций каждое, золотисто-коричневое снаружи, влажное внутри и наполненное пухлым сладким изюмом.",
        pr: "18",
        we: "2 шт./ 200 гр."
    },
    {
        name: "Шоколадное наслаждение",
        kart: "images/4.png",
        descr: "Идеально хрустящее снаружи и достаточно густое и липкое в центре, это печенье наполнено полусладкой и тёмной шоколадной стружкой, придающей богатую глубину вкуса.",
        pr: "24",
        we: "2 шт./ 200 гр."
    },
    {
        name: "Арахисовый рай",
        kart: "images/5.png",
        descr: "Сладкое, пикантное и идеально сбалансированное печенье удовлетворяет тягу любителей арахисового масла и шоколада.",
        pr: "20",
        we: "2 шт./ 200 гр."
    },
    {
        name: "Шоколадный ореховый деликатес",
        kart: "images/6.png",
        descr: "Наша фирменная рецептура печенья с шоколадными крошками и грецкими орехами гарантирует незабываемый вкусовой опыт. Каждое печенье хрустит снаружи, но раскрывает внутри нежную сердцевину.",
        pr: "18",
        we: "2 шт./ 200 гр."
    }
];

// текущий символ валюты
let newV1 = "$";

changeValuta.addEventListener('click', function (e) {
    const currentV = e.target.innerText;

    let newV = "$";
    let c = 1;

    if (currentV === "$") {
        newV = "₽";
        c = 98;
    }
    e.target.innerText = newV;

    for (let i = 0; i < prices.length; i++) {
        prices[i].innerText = String(Number(prices[i].getAttribute("base-price")) * c) + `${newV}`;
    }
    newV1 = newV;
});

// уведомление "добавлено в корзину"
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// ================== КАТАЛОГ → ДОБАВЛЕНИЕ В КОРЗИНУ ЧЕРЕЗ EXPRESS ==================

productsList.addEventListener('click', function (event) {
    // ищем кнопку "В корзину" (даже если кликнули по внутреннему span)
    const button = event.target.closest('.button-violet-button-toCart');
    if (!button) return;

    event.preventDefault();

    const details = button.closest('.products-items-details');
    if (!details) return;

    const productName = details.querySelector('.products-items-title').innerText;
    const product = data.find(item => item.name === productName);
    if (!product) return;

    // пока что всегда добавляем 1 набор (2 шт / 200 гр)
    const qtyToAdd = 1;

    fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // важно для сессий
        body: JSON.stringify({
            name: product.name,
            kart: product.kart,
            descr: product.descr,
            pr: product.pr,
            we: product.we,
            qty: qtyToAdd
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log('Корзина на сервере:', data);
            showNotification(`${productName} добавлен в корзину`);
        })
        .catch(err => {
            console.error('Ошибка при добавлении в корзину', err);
        });
});

// ================== "Купить сейчас" — модалка ==================

productsList.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('button-violet-button')) {
        const button = event.target;
        const details = button.closest('.products-items-details');
        if (!details) return;

        const productName = details.querySelector('.products-items-title').innerText;
        const product = data.find(item => item.name === productName);
        if (!product) return;

        orderProductTitle.textContent = product.name;
        orderProductImage.src = product.kart;
        orderProductImage.alt = product.name;

        orderProductPrice.textContent = `${product.pr} ${newV1}`;
        orderProductQty.textContent = '1 шт.';

        formZakaz.style.display = 'block';
    }
});

closeButton.addEventListener('click', function () {
    formZakaz.style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target === formZakaz) {
        formZakaz.style.display = 'none';
    }
});

orderForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // позже можно будет реально отправлять заказ на backend
    window.location.href = 'payment.html';
});

// ================== АНИМАЦИЯ КНОПКИ "В КОРЗИНУ" (как было) ==================

document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.button-violet-button-toCart');

    cartButtons.forEach((button) => {
        if (button.dataset.init === 'true') return;
        button.dataset.init = 'true';

        button.addEventListener('click', (e) => {
            // Express уже ловит клик через делегирование выше
            e.preventDefault();

            // если кнопка уже в режиме "В корзине" — по клику просто +1 (визуально)
            if (button.classList.contains('in-cart')) {
                const qtyEl = button.querySelector('.cart-btn-qty');
                let qty = parseInt(qtyEl.textContent, 10) || 1;
                qtyEl.textContent = qty + 1;
                return;
            }

            // первый клик — меняем вид кнопки на счётчик
            button.classList.add('in-cart');

            button.innerHTML = `
                <div class="cart-button-content">
                    <span class="cart-btn-minus">−</span>
                    <div class="cart-btn-info">
                        <span class="cart-btn-qty">1</span>
                        <span class="cart-btn-text">В корзине</span>
                    </div>
                    <span class="cart-btn-plus">+</span>
                </div>
            `;

            const minus = button.querySelector('.cart-btn-minus');
            const plus = button.querySelector('.cart-btn-plus');
            const qtyEl = button.querySelector('.cart-btn-qty');

            plus.addEventListener('click', (event) => {
                event.stopPropagation();
                let qty = parseInt(qtyEl.textContent, 10) || 1;
                qtyEl.textContent = qty + 1;
            });

            minus.addEventListener('click', (event) => {
                event.stopPropagation();
                let qty = parseInt(qtyEl.textContent, 10) || 1;

                if (qty > 1) {
                    qtyEl.textContent = qty - 1;
                } else {
                    button.classList.remove('in-cart');
                    button.textContent = 'В корзину';
                }
            });
        });
    });
});
