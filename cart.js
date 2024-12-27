const cartItemsContainer = (document.getElementsByClassName('cart__list'))[0];
const delInCart = (document.getElementsByClassName('delCart'))[0]
// получение данных из localStorage
// const cart = [JSON.parse(localStorage.getItem('cart'))] || [];

const changeValuta = document.getElementsByClassName('perValuta')[0]

const formZakaz = document.getElementsByClassName('formZakaz')[0];
const closeButton = document.getElementById('closeButton');
const orderProductName = document.getElementById('orderProductName');
const orderCartBtn = document.getElementsByClassName('orderCartBtn')[0];

function loadData() { //функция для получения данных из loсаlStorage
    const savedData = localStorage.getItem('cart') //обращается к localStorage и пытается получить данные, сохраненные под ключом 'cart'
    return savedData ? JSON.parse(savedData) : [] //проверяет есть ли сохраненные данные
}

const cart = loadData()

// console.log(cart[0].name);
console.log(cart);
//очистить корзину
delInCart.addEventListener('click', function(){
    localStorage.clear() // удаляем данные из localStorage
    location.reload()
})

newV1="$"
changeValuta.addEventListener('click', function(e) {
    const prices = document.getElementsByClassName('products-items-price')
    const currentV = e.target.innerText

    let newV = "$"
    let c = 1

    if (currentV === "$"){
        newV = "₽"
        c = 98
    }
    e.target.innerText = newV

    for (let i = 0; i < prices.length; i++){
    
    
    prices[i].innerText = String(Number(prices[i].getAttribute("base-price"))*c)+`${newV}`
    }
    newV1=newV
})

// отображение печенек в корзине



function createPosition(obj){
    const itemDiv = document.createElement('div')
    itemDiv.classList.add('cart-item')

    const imgDel = document.createElement('img')
    imgDel.src = "images/icons8-trash-30.png"
    imgDel.alt = "Удалить из корзины"
    const btnDelPrfromCart = document.createElement('button')
    btnDelPrfromCart.classList.add("delPfromCart")
    btnDelPrfromCart.appendChild(imgDel)

    btnDelPrfromCart.addEventListener('click', (event)=> {
        event.stopPropagation();
        deleteById(obj.id);
        console.log(cart);
        // console.log(data);
        

    })

    const imgPthshnInCart = document.createElement('img')
    imgPthshnInCart.classList.add("products-items-image")
    imgPthshnInCart.src = obj.kart
    imgPthshnInCart.alt = obj.name

    const infoDiv = document.createElement('div')

    const positionTitle = document.createElement('h3')
    positionTitle.innerText = obj.name

    const positionDescr = document.createElement('p')
    positionDescr.innerText = obj.descr

    const positionPrice = document.createElement('div')
    positionPrice.classList.add("products-items-price")
    positionPrice.innerText = "Цена: " + obj.pr +newV1
    positionPrice.setAttribute('base-price', obj.pr)

    const positionWeight = document.createElement('p')
    positionWeight.innerText = obj.we



    infoDiv.appendChild(positionTitle)
    infoDiv.appendChild(positionDescr)
    infoDiv.appendChild(positionPrice)
    infoDiv.appendChild(positionWeight)

    
    itemDiv.appendChild(imgPthshnInCart)
    
    itemDiv.appendChild(infoDiv)
    itemDiv.appendChild(btnDelPrfromCart)

    return itemDiv
}

function syncData(){//функция которая сохраненяет текущее состояние данных
    localStorage.setItem('cart', JSON.stringify(cart))
    render()
}

function deleteById(PrId){
    const index = cart.findIndex(item => item.id === PrId)
    if (index !== -1) { 
        cart.splice(index, 1) //Если задача найдена, она удаляется из массива
        syncData()
        render()
    }
}



function sumInCart(){
    let sm = 0
    cart.forEach(item => {
        sm+=Number(item.pr)
    })
    let smSTR = String(sm)
    return smSTR
}

function render(){
    const orderCartBtn = document.querySelector('.orderCartBtn');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "";
        // если в корзине ничего нет
        const emptyCartMessage = document.createElement('div');
        emptyCartMessage.classList.add('cart__list_nothing');
        emptyCartMessage.innerText = "Корзина пока пуста";

        // скрываем кнопку "Заказать все"
        orderCartBtn.classList.add('hidden');

        //ссылка для перехода обратно в каталог
        const catalogLink = document.createElement('a');
        catalogLink.classList.add('cataloglink');
        catalogLink.innerText = "Перейти в каталог";
        catalogLink.href = "allpechenki.html";
        catalogLink.style.display = "block";//сделать в виде див чтобы лучше видно было а не как текст
        catalogLink.style.marginTop = "10px";

        // добавляем сообщение и ссылку в контейнер
        cartItemsContainer.appendChild(emptyCartMessage);
        cartItemsContainer.appendChild(catalogLink);
    } else {
        // показываем кнопку "Заказать все" если есть товары
        orderCartBtn.classList.remove('hidden');
        // если есть, показать товары в корзине
        cartItemsContainer.innerHTML = "";
        cart.forEach(item => {
            const itemDiv = createPosition(item);
            // itemDiv.classList.add('cart-item')
        
        

            // itemDiv.innerHTML = `
            //     <img src="${item.kart}" alt="${item.name}">
            //     <div>
            //         <h3>${item.name}</h3>
            //         <p>${item.descr}</p>
            //         <p>Цена: ${item.pr} $</p>
            //         <p>${item.we}</p>
           //     </div>
            // `;
            
            cartItemsContainer.appendChild(itemDiv);
        });
        const totalDiv = document.createElement('div');
        totalDiv.classList.add('cart-total');
        totalDiv.innerText = "Итого к оплате: " + sumInCart() + newV1;
        document.body.appendChild(totalDiv);
    }
}
//нужен ли рендер???
// function render(){//обновляет отображение на экране
//     cartItemsContainer.innerHTML=''
//     for (let item of cart){
        
//     }
// }
render();

// Обработчик для кнопки "Заказать всё"
orderCartBtn.addEventListener('click', function() {
    const totalSum = sumInCart();
    orderProductName.innerText = `Сумма заказа: ${totalSum}${newV1}`;
    formZakaz.style.display = 'block';
});

// Закрытие формы при нажатии на крестик
closeButton.addEventListener('click', function() {
    formZakaz.style.display = 'none';
});

// Закрытие формы при нажатии вне её области
window.addEventListener('click', function(event) {
    if (event.target === formZakaz) {
        formZakaz.style.display = 'none';
    }
});

// Обработка отправки формы
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    
    alert(`Заказ оформлен!\nИмя: ${name}\nАдрес: ${address}`);
    formZakaz.style.display = 'none';
    
    // Очистка корзины после заказа
    localStorage.clear();
    location.reload();
});