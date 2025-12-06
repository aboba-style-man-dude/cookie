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

// Логика анимации и СИНХРОНИЗАЦИИ кнопки "В корзину" с сервером
document.addEventListener('DOMContentLoaded', () => {
  const cartButtons = document.querySelectorAll('.button-violet-button-toCart');

  cartButtons.forEach((button) => {
    if (button.dataset.init === 'true') return;
    button.dataset.init = 'true';

    // Находим данные товара по DOM
    const card = button.closest('.products-items-details') || button.closest('.products-item');
    if (!card) return;

    const titleEl = card.querySelector('.products-items-title');
    const productName = titleEl ? titleEl.innerText.trim() : '';

    // Берём товар из массива data (он выше в файле)
    const product = data.find(item => item.name === productName);
    if (!product) return;

    let currentQty = 0; // реальное количество для этого товара

    // функция — отправить новое количество на сервер
    async function syncQtyWithServer() {
        try {
            await fetch('/api/cart/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: product.name,
                    price: Number(product.pr),
                    weight: product.we,
                    descr: product.descr,
                    image: product.kart,   //  сюда уходят images
                    qty: currentQty
                })
            });
        } catch (err) {
            console.error('Ошибка при синхронизации корзины', err);
        }
    }


    // нарисовать кнопку в виде обычной "В корзину"
    function renderAsPlainButton() {
      button.classList.remove('in-cart');
      button.innerHTML = 'В корзину';
    }

    // нарисовать кнопку в виде счётчика
    function renderAsCounter() {
      button.classList.add('in-cart');
      button.innerHTML = `
        <div class="cart-button-content">
          <span class="cart-btn-minus">−</span>
          <div class="cart-btn-info">
            <span class="cart-btn-qty">${currentQty}</span>
            <span class="cart-btn-text">В корзине</span>
          </div>
          <span class="cart-btn-plus">+</span>
        </div>
      `;

      const minus = button.querySelector('.cart-btn-minus');
      const plus = button.querySelector('.cart-btn-plus');
      const qtyEl = button.querySelector('.cart-btn-qty');

      plus.addEventListener('click', async (event) => {
        event.stopPropagation();
        currentQty += 1;
        qtyEl.textContent = currentQty;
        await syncQtyWithServer();
      });

      minus.addEventListener('click', async (event) => {
        event.stopPropagation();
        if (currentQty > 1) {
          currentQty -= 1;
          qtyEl.textContent = currentQty;
          await syncQtyWithServer();
        } else {
          // стало 0 — убираем из корзины и возвращаем обычную кнопку
          currentQty = 0;
          await syncQtyWithServer();
          renderAsPlainButton();
        }
      });
    }

    // основной обработчик клика по кнопке
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      // если ещё не было товаров — делаем qty = 1 и включаем счётчик
      if (!button.classList.contains('in-cart')) {
        currentQty = 1;
        await syncQtyWithServer();
        renderAsCounter();
      } else {
        // если кликнули по уже "фиолетовой" кнопке, считаем это как +1
        const qtyEl = button.querySelector('.cart-btn-qty');
        currentQty = (parseInt(qtyEl.textContent, 10) || 1) + 1;
        qtyEl.textContent = currentQty;
        await syncQtyWithServer();
      }
    });
  });
});
