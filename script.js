const productsList = document.querySelector('.products-items') // все товары

const formZakaz = document.getElementsByClassName('formZakaz')[0] // окно формы
const closeButton = document.getElementById('closeButton') // кнопка закрытия
const orderProductName = document.getElementById('orderProductName') // для названия товара

const changeValuta = document.getElementsByClassName('perValuta')[0]
const prices = document.getElementsByClassName('products-items-price')

const data = [
    {
        name: "Лучшие друзья",
        kart: "images/1.png",
        descr: "Печенье, с которого все началось! Наше фирменное печенье с шоколадной крошкой и грецкими орехами хрустящее снаружи с достаточно толстой и липкой серединкой.",
        pr: "20",
        we: "2 шт./ 200 гр."
    },

    {
        name: "Шоколадный француз",
        kart: "images/2.png",
        descr: "Это печенье, изготовленное из тёмного французского какао и полусладкой шоколадной стружки, наверняка удовлетворит даже самого заядлого любителя шоколада.",
        pr: "24",
        we: "2 шт./ 200 гр."
    },

    {
        name: "Овсянка с изюмом, Сэр!",
        kart: "images/3.png",
        descr: "Это сдобное маслянистое печенье весом шесть унций каждое, золотисто-коричневое снаружи, влажное внутри и наполненное пухлым сладким изюмом.",
        pr: "18",
        we: "2 шт./ 200 гр."
    },

    {
        name: "Шоколадное наслаждение",
        kart: "images/4.png",
        descr: "Идеально хрустящее снаружи и достаточно густое и липкое в центре, это печенье наполнено полусладкой и тёмной шоколадной стружкой, придающей богатую глубину вкуса.",
        pr: "24",
        we: "2 шт./ 200 гр."
    },

    {
        name: "Арахисовый рай",
        kart: "images/5.png",
        descr: "Сладкое, пикантное и идеально сбалансированное печенье удовлетворяет тягу любителей арахисового масла и шоколада.",
        pr: "20",
        we: "2 шт./ 200 гр."
    },

    {
        name: "Шоколадный ореховый деликатес",
        kart: "images/6.png",
        descr: "Наша фирменная рецептура печенья с шоколадными крошками и грецкими орехами гарантирует незабываемый вкусовой опыт. Каждое печенье хрустит снаружи, но раскрывает внутри нежную сердцевину.",
        pr: "18",
        we: "2 шт./ 200 гр."
    }
]

newV1="$"
changeValuta.addEventListener('click', function(e) {
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

// let cart = [JSON.parse(localStorage.getItem('cart'))] || [];
// localStorage.setItem('cart', JSON.stringify(cart))


function loadData() { //функция для получения данных из loсаlStorage
    const savedData = localStorage.getItem('cart') //обращается к localStorage и пытается получить данные, сохраненные под ключом 'cart'
    return savedData ? JSON.parse(savedData) : [] //проверяет есть ли сохраненные данные
}

const cart = loadData()


// при нажатии В корзину

productsList.addEventListener('click', function(event) {
    // проверяем была ли нажата какя-нибудь кнопка "В корзину"
    if (event.target && event.target.classList.contains('button-violet-button-toCart')) {
        const button = event.target; // сохраняем ссылку на кнопку
        const productName = button.closest('.products-items-details').querySelector('.products-items-title').innerText // получаем название товара
        console.log(productName);


        const product = data.find(item => item.name === productName)

        // сохраняем в localStorage
        
        cart.push({
            name: product.name,
            kart: product.kart,
            descr: product.descr,
            pr: product.pr,
            we: product.we
        });
        localStorage.setItem('cart', JSON.stringify(cart))
    }
})



productsList.addEventListener('click', function(event) {
    // проверяем была ли нажата какя-нибудь кнопка "Заказать"
    if (event.target && event.target.classList.contains('button-violet-button')) {
        const button = event.target; // сохраняем ссылку на кнопку
        const productName = button.closest('.products-items-details').querySelector('.products-items-title').innerText; // получаем название товара
        console.log(productName);

        
        orderProductName.innerText = `Вы хотите заказать: ${productName}`
        formZakaz.style.display = 'block'; // показываем окно формы
       
    }
})
// закрытие формы при нажатии на крестик
closeButton.addEventListener('click', function() {
    formZakaz.style.display = 'none'
})

// закрытие формы при нажатии вне его области
window.addEventListener('click', function(event) {
    if (event.target === formZakaz) {
        formZakaz.style.display = 'none'
    }
})

function createCookie(obj){
    const pech = document.createElement('div')
    pech.classList.add("products-item")

    //изображение
    const img = document.createElement('img')
    img.src = obj.kart
    img.alt = "somep"

    const divImg = document.createElement('div')
    divImg.classList.add("products-items-image") 

    divImg.appendChild(img)

    //детали
    const details = document.createElement('div')
    details.classList.add("products-items-details")

    const prTitleJS = document.createElement('div')
    prTitleJS.classList.add("products-items-title")
    prTitleJS.innerText = obj.name

    const prTextJS = document.createElement('div')
    prTextJS.classList.add("products-item-text")
    prTextJS.innerText = obj.descr

    //детали, экстра
    const prExstraJS = document.createElement('div')
    prExstraJS.classList.add("products-item-extra")

    const prExstraInfJS = document.createElement('div')
    prExstraInfJS.classList.add("products-item-info")

    const prExstraPriceJS = document.createElement('div')
    prExstraPriceJS.classList.add("products-items-price")
    prExstraPriceJS.innerText = obj.pr+newV1
    prExstraPriceJS.setAttribute('base-price', obj.pr)


    const prExstraWeightJS = document.createElement('div')
    prExstraWeightJS.classList.add("products-items-weight")
    prExstraWeightJS.innerText = obj.we

    const prBtnZ = document.createElement('button')
    prBtnZ.classList.add("button-violet-button")
    prBtnZ.innerText = "Заказать"

    const prBtnCart = document.createElement('button')
    prBtnCart.classList.add("button-violet-button-toCart")
    prBtnCart.innerText = "В корзину"

    prExstraInfJS.appendChild(prExstraPriceJS)
    prExstraInfJS.appendChild(prExstraWeightJS)

    prExstraJS.appendChild(prExstraInfJS)
    prExstraJS.appendChild(prBtnZ)
    prExstraJS.appendChild(prBtnCart)

    details.appendChild(prTitleJS)
    details.appendChild(prTextJS)
    details.appendChild(prExstraJS)
    
    


    pech.appendChild(divImg)
    pech.appendChild(details)

    return pech
}



for (let item of data){
    const tmpEl = createCookie(item)

    productsList.appendChild(tmpEl)
}
