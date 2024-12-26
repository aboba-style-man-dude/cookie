const cartItemsContainer = (document.getElementsByClassName('cart__list'))[0];
const delInCart = (document.getElementsByClassName('delCart'))[0]
// получение данных из localStorage
// const cart = [JSON.parse(localStorage.getItem('cart'))] || [];



function loadData() { //функция для получения данных из loсаlStorage
    const savedData = localStorage.getItem('cart') //обращается к localStorage и пытается получить данные, сохраненные под ключом 'cart'
    return savedData ? JSON.parse(savedData) : [] //проверяет есть ли сохраненные данные
}

const cart = loadData()

// console.log(cart[0].name);

//очистить корзину
delInCart.addEventListener('click', function(){
    localStorage.clear() // удаляем данные из localStorage
    location.reload()
})

// отображение печенек в корзине
if (cart.length === 0) {
    // если в корзине ничего нет
    const emptyCartMessage = document.createElement('div')
    emptyCartMessage.classList.add('cart__list_nothing')
    emptyCartMessage.innerText = "Корзина пока пуста"

    //ссылка для перехода обратно в каталог
    const catalogLink = document.createElement('a')
    catalogLink.classList.add('cataloglink')
    catalogLink.innerText = "Перейти в каталог"
    catalogLink.href = "allpechenki.html"
    catalogLink.style.display = "block"//сделать в виде див чтобы лучше видно было а не как текст
    catalogLink.style.marginTop = "10px"

    // добавляем сообщение и ссылку в контейнер
    cartItemsContainer.appendChild(emptyCartMessage)
    cartItemsContainer.appendChild(catalogLink)
} else {
    // если есть, показать товары в корзине
    cart.forEach(item => {
        const itemDiv = document.createElement('div')
        itemDiv.classList.add('cart-item')

        itemDiv.innerHTML = `
            <img src="${item.kart}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>${item.descr}</p>
                <p>Цена: ${item.pr} $</p>
                <p>${item.we}</p>
            </div>
        `;

        cartItemsContainer.appendChild(itemDiv)
    });
}

//нужен ли рендер???
// function render(){//обновляет отображение на экране
//     cartItemsContainer.innerHTML=''
//     for (let item of cart){
        
//     }
// }
// render();