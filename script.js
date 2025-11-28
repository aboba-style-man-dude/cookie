//Изменения: полный актуальный script.js для allpechenki.html

const productsList = document.querySelector('.products-items'); // все товары

//для оформления заказа
const formZakaz = document.getElementsByClassName('formZakaz')[0]; // окно формы
const closeButton = document.getElementById('closeButton');        // кнопка закрытия

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

//Изменения: объявили переменную нормально, а не неявно
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

// функция для получения данных из localStorage
function loadData() {
    const savedData = localStorage.getItem('cart');
    return savedData ? JSON.parse(savedData) : [];
}

let counter = 1;
const cart = loadData();

cart.forEach((item) => {
    // нужно для того, чтобы были разные id, т.е. не повторялись
    if (item.id >= counter) {
        counter = item.id + 1;
    }
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

// при нажатии "В корзину"
productsList.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('button-violet-button-toCart')) {
        const button = event.target;
        const details = button.closest('.products-items-details');
        if (!details) return;

        const productName = details.querySelector('.products-items-title').innerText;

        const product = data.find(item => item.name === productName);
        if (!product) return;

        cart.push({
            id: counter++,
            name: product.name,
            kart: product.kart,
            descr: product.descr,
            pr: product.pr,
            we: product.we
        });
        localStorage.setItem('cart', JSON.stringify(cart));

        showNotification(`${productName} добавлен в корзину`);
    }
});

// при нажатии "Купить сейчас"
productsList.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('button-violet-button')) {
        const button = event.target;
        const details = button.closest('.products-items-details');
        if (!details) return;

        const productName = details.querySelector('.products-items-title').innerText;

        const product = data.find(item => item.name === productName);
        if (!product) return;

        // заполняем данные в модалке
        orderProductTitle.textContent = product.name;
        orderProductImage.src = product.kart;
        orderProductImage.alt = product.name;

        // используем текущую валюту newV1
        orderProductPrice.textContent = `${product.pr} ${newV1}`;
        orderProductQty.textContent = '1 шт.';

        formZakaz.style.display = 'block';
    }
});


// закрытие формы при нажатии на крестик
closeButton.addEventListener('click', function () {
    formZakaz.style.display = 'none';
});


// закрытие формы при нажатии вне его области
window.addEventListener('click', function (event) {
    if (event.target === formZakaz) {
        formZakaz.style.display = 'none';
    }
});

//переход на страницу оплаты после подтверждения заказа
orderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // здесь позже можно будет собрать данные и отправить на сервер (Express)
    window.location.href = 'payment.html'; // временная страница оплаты
});



// создание карточки печенья (если нужно добавлять динамически)
function createCookie(obj) {
    const pech = document.createElement('div');
    pech.classList.add("products-item");

    // изображение
    const img = document.createElement('img');
    img.src = obj.kart;
    img.alt = "cookie";

    const divImg = document.createElement('div');
    divImg.classList.add("products-items-image");
    divImg.appendChild(img);

    // детали
    const details = document.createElement('div');
    details.classList.add("products-items-details");

    const prTitleJS = document.createElement('div');
    prTitleJS.classList.add("products-items-title");
    prTitleJS.innerText = obj.name;

    const prTextJS = document.createElement('div');
    prTextJS.classList.add("products-item-text");
    prTextJS.innerText = obj.descr;

    // блок с ценой и кнопками
    const prExstraJS = document.createElement('div');
    prExstraJS.classList.add("products-item-extra");

    const prExstraInfJS = document.createElement('div');
    prExstraInfJS.classList.add("products-item-info");

    const prExstraPriceJS = document.createElement('div');
    prExstraPriceJS.classList.add("products-items-price");
    prExstraPriceJS.innerText = obj.pr + newV1;
    prExstraPriceJS.setAttribute('base-price', obj.pr);

    const prExstraWeightJS = document.createElement('div');
    prExstraWeightJS.classList.add("products-items-weight");
    prExstraWeightJS.innerText = obj.we;

    prExstraInfJS.appendChild(prExstraPriceJS);
    prExstraInfJS.appendChild(prExstraWeightJS);

    //Изменения: обёртка для двух кнопок, как в HTML
    const buttonsWrap = document.createElement('div');
    buttonsWrap.classList.add("products-item-buttons");

    const prBtnZ = document.createElement('button');
    prBtnZ.classList.add("button-violet-button");
    prBtnZ.innerText = "Купить сейчас";

    const prBtnCart = document.createElement('button');
    prBtnCart.classList.add("button-violet-button-toCart");
    prBtnCart.innerText = "В корзину";

    buttonsWrap.appendChild(prBtnZ);
    buttonsWrap.appendChild(prBtnCart);

    prExstraJS.appendChild(prExstraInfJS);
    prExstraJS.appendChild(buttonsWrap);

    details.appendChild(prTitleJS);
    details.appendChild(prTextJS);
    details.appendChild(prExstraJS);

    pech.appendChild(divImg);
    pech.appendChild(details);

    return pech;
}

// (если нужно генерировать товары из data)
// for (let item of data) {
//     const tmpEl = createCookie(item);
//     productsList.appendChild(tmpEl);
// }

//Изменения: логика анимации и счётчика для кнопки "В корзину" на странице каталога
document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.button-violet-button-toCart');

    cartButtons.forEach((button) => {
        if (button.dataset.init === 'true') return;
        button.dataset.init = 'true';

        button.addEventListener('click', (e) => {
            e.preventDefault();

            // если кнопка уже в режиме "В корзине" — по клику просто +1
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
