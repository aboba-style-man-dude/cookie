// frontend/cart.js – работа с корзиной через backend-сессию

const cartItemsContainer = document.querySelector('.cart__list');
const changeValuta = document.querySelector('.perValuta');
const orderCartBtn = document.querySelector('.orderCartBtn');
const formZakaz = document.querySelector('.formZakaz');
const closeButton = document.getElementById('closeButton');

// элементы в модалке
const orderProductImage = document.getElementById('orderProductImage');
const orderProductTitle = document.getElementById('orderProductTitle');
const orderProductPrice = document.getElementById('orderProductPrice');
const orderProductQty = document.getElementById('orderProductQty');
const orderForm = document.getElementById('orderForm');

let currencySymbol = '$';
let currencyRate = 1;

// получить корзину с сервера
async function fetchCart() {
  const res = await fetch('/api/cart', { credentials: 'include' });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// отправить новое количество товара
async function updateItemOnServer(item, newQty) {
  await fetch('/api/cart/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      name: item.name,
      price: item.price,
      weight: item.weight,
      descr: item.descr,
      image: item.image,
      qty: newQty
    })
  });
}

// пересчёт и отрисовка блока "Итого к оплате"
function renderTotal(cart) {
  let productsBaseSum = 0; // в долларах без курса

  cart.forEach((item) => {
    productsBaseSum += Number(item.price) * Number(item.qty);
  });

  const productsDisplay = Math.round(productsBaseSum * currencyRate);

  // доставка: 5$ или 300₽ если корзина не пустая
  let delivery = 0;
  if (productsBaseSum > 0) {
    delivery = currencySymbol === '$' ? 5 : 300;
  }

  const totalDisplay = productsDisplay + delivery;

  let totalDiv = document.querySelector('.cart-total');
  if (!totalDiv) {
    totalDiv = document.createElement('div');
    totalDiv.classList.add('cart-total');
    document.body.appendChild(totalDiv);
  }

  const deliveryText = delivery
    ? ` (включая доставку ${delivery} ${currencySymbol})`
    : '';

  totalDiv.textContent = `Итого к оплате: ${totalDisplay} ${currencySymbol}${deliveryText}`;
}

// создание разметки одной карточки в корзине
function createCartItem(item, cart) {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('cart-item');

  // картинка
  const img = document.createElement('img');
  img.classList.add('products-items-image');
  img.src = item.image;
  img.alt = item.name;

  const infoDiv = document.createElement('div');

  const title = document.createElement('h3');
  title.textContent = item.name;

  const descr = document.createElement('p');
  descr.textContent = item.descr;

  // цена и вес с учётом количества
  const totalPrice = Math.round(Number(item.price) * Number(item.qty) * currencyRate);

  const packsPieces = 2;   // в одной упаковке
  const packGrams = 200;
  const totalPieces = packsPieces * Number(item.qty);
  const totalGrams = packGrams * Number(item.qty);

  const priceDiv = document.createElement('div');
  priceDiv.classList.add('products-items-price');
  priceDiv.textContent = `Цена: ${totalPrice} ${currencySymbol}`;
  priceDiv.setAttribute('base-price', Number(item.price) * Number(item.qty));

  const weightP = document.createElement('p');
  weightP.classList.add('cart-item-weight');
  weightP.textContent = `${totalPieces} шт / ${totalGrams} гр`;

  infoDiv.appendChild(title);
  infoDiv.appendChild(descr);
  infoDiv.appendChild(priceDiv);
  infoDiv.appendChild(weightP);

  // мусорка
  const trashImg = document.createElement('img');
  trashImg.src = 'images/icons8-trash-30.png';
  trashImg.alt = 'Удалить из корзины';

  const trashBtn = document.createElement('button');
  trashBtn.classList.add('delPfromCart');
  trashBtn.appendChild(trashImg);

  // футер: мусорка + счётчик
  const footer = document.createElement('div');
  footer.classList.add('cart-item-footer');

  const counter = document.createElement('div');
  counter.classList.add('cart-item-counter');

  const minusBtn = document.createElement('button');
  minusBtn.classList.add('counter-btn');
  minusBtn.textContent = '−';

  const qtySpan = document.createElement('span');
  qtySpan.classList.add('counter-value');
  qtySpan.textContent = item.qty;

  const plusBtn = document.createElement('button');
  plusBtn.classList.add('counter-btn');
  plusBtn.textContent = '+';

  counter.appendChild(minusBtn);
  counter.appendChild(qtySpan);
  counter.appendChild(plusBtn);

  footer.appendChild(trashBtn);
  footer.appendChild(counter);

  // обработчики
  plusBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const newQty = Number(item.qty) + 1;
    item.qty = newQty;
    qtySpan.textContent = newQty;
    await updateItemOnServer(item, newQty);
    render(cart); // перерисуем всё
  });

  minusBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const newQty = Number(item.qty) - 1;
    if (newQty <= 0) {
      // удаляем карточку
      itemDiv.remove();
      await updateItemOnServer(item, 0);
      const newCart = cart.filter((c) => c.name !== item.name);
      renderTotal(newCart);
    } else {
      item.qty = newQty;
      qtySpan.textContent = newQty;
      await updateItemOnServer(item, newQty);
      render(cart);
    }
  });

  trashBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    itemDiv.remove();
    await updateItemOnServer(item, 0);
    const newCart = cart.filter((c) => c.name !== item.name);
    renderTotal(newCart);
  });

  itemDiv.appendChild(img);
  itemDiv.appendChild(infoDiv);
  itemDiv.appendChild(footer);

  return itemDiv;
}

// основной рендер страницы корзины
async function render(cartFromServer) {
  const cart = cartFromServer || (await fetchCart());

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.classList.add('cart__list_empty');
    if (orderCartBtn) orderCartBtn.classList.add('hidden');

    const emptyBlock = document.createElement('div');
    emptyBlock.classList.add('cart__list_nothing');

    const emptyText = document.createElement('p');
    emptyText.classList.add('cart-empty-text');
    emptyText.innerText = 'Корзина пока пуста';

    const catalogLink = document.createElement('a');
    catalogLink.classList.add('cataloglink');
    catalogLink.innerText = 'Перейти в каталог';
    catalogLink.href = 'allpechenki.html';

    emptyBlock.appendChild(emptyText);
    emptyBlock.appendChild(catalogLink);

    cartItemsContainer.appendChild(emptyBlock);

    const totalDiv = document.querySelector('.cart-total');
    if (totalDiv) totalDiv.remove();
    return;
  }

  cartItemsContainer.classList.remove('cart__list_empty');
  if (orderCartBtn) orderCartBtn.classList.remove('hidden');

  cart.forEach((item) => {
    const itemDiv = createCartItem(item, cart);
    cartItemsContainer.appendChild(itemDiv);
  });

  renderTotal(cart);
}

// обработка смены валюты
if (changeValuta) {
  changeValuta.addEventListener('click', async (e) => {
    const current = e.target.innerText;
    if (current === '$') {
      currencySymbol = '₽';
      currencyRate = 98;
    } else {
      currencySymbol = '$';
      currencyRate = 1;
    }
    e.target.innerText = currencySymbol;

    const cart = await fetchCart();
    render(cart);
  });
}

// кнопка "Заказать всё" – открываем красивую модалку
if (orderCartBtn) {
  orderCartBtn.addEventListener('click', async () => {
    const cart = await fetchCart();

    let base = 0;
    let totalPieces = 0;
    cart.forEach((item) => {
      base += Number(item.price) * Number(item.qty);
      totalPieces += 2 * Number(item.qty); // 2 шт в упаковке
    });

    const productsDisplay = Math.round(base * currencyRate);
    const delivery = base > 0 ? (currencySymbol === '$' ? 5 : 300) : 0;
    const totalDisplay = productsDisplay + delivery;

    // наполняем модалку так же, как в каталоге
    if (orderProductTitle) {
      orderProductTitle.textContent = 'Все товары из корзины';
    }
    if (orderProductImage) {
      orderProductImage.src = 'images/cookie.png';
      orderProductImage.alt = 'Все товары из корзины';
    }
    if (orderProductQty) {
      orderProductQty.textContent = `${totalPieces} шт.`;
    }
    if (orderProductPrice) {
      orderProductPrice.textContent = `${totalDisplay} ${currencySymbol}`;
    }

    if (formZakaz) {
      formZakaz.style.display = 'block';
    }
  });
}

if (closeButton) {
  closeButton.addEventListener('click', () => {
    if (formZakaz) formZakaz.style.display = 'none';
  });
}

window.addEventListener('click', (event) => {
  if (event.target === formZakaz) {
    formZakaz.style.display = 'none';
  }
});

if (orderForm) {
  orderForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        // если заказ успешно записан в БД – идём на страницу оплаты/успеха
        window.location.href = 'payment.html';
      } else {
        alert('Не удалось оформить заказ: ' + (data.error || 'неизвестная ошибка'));
      }
    } catch (err) {
      console.error('Ошибка при оформлении заказа', err);
      alert('Ошибка при оформлении заказа');
    }
  });
}

// при загрузке страницы – рендерим корзину
document.addEventListener('DOMContentLoaded', () => {
  render();
});
