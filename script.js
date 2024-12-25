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
        name: "Лучшие друзья",
        kart: "images/1.png",
        descr: "Печенье, с которого все началось! Наше фирменное печенье с шоколадной крошкой и грецкими орехами хрустящее снаружи с достаточно толстой и липкой серединкой.",
        pr: "20",
        we: "2 шт./ 200 гр."
    },

    {
        name: "Лучшие друзья",
        kart: "images/1.png",
        descr: "Печенье, с которого все началось! Наше фирменное печенье с шоколадной крошкой и грецкими орехами хрустящее снаружи с достаточно толстой и липкой серединкой.",
        pr: "20",
        we: "2 шт./ 200 гр."
    },

    {
        name: "Лучшие друзья",
        kart: "images/1.png",
        descr: "Печенье, с которого все началось! Наше фирменное печенье с шоколадной крошкой и грецкими орехами хрустящее снаружи с достаточно толстой и липкой серединкой.",
        pr: "20",
        we: "2 шт./ 200 гр."
    },

    {
        name: "Лучшие друзья",
        kart: "images/1.png",
        descr: "Печенье, с которого все началось! Наше фирменное печенье с шоколадной крошкой и грецкими орехами хрустящее снаружи с достаточно толстой и липкой серединкой.",
        pr: "20",
        we: "2 шт./ 200 гр."
    },

    {
        name: "Лучшие друзья",
        kart: "images/1.png",
        descr: "Печенье, с которого все началось! Наше фирменное печенье с шоколадной крошкой и грецкими орехами хрустящее снаружи с достаточно толстой и липкой серединкой.",
        pr: "20",
        we: "2 шт./ 200 гр."
    }
]

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

})




// при нажатии заказать
productsList.addEventListener('click', function(event) {
    // проверяем была ли нажата какя-нибудь кнопка "Заказать"
    if (event.target && event.target.classList.contains('button-violet-button')) {
        const button = event.target; // сохраняем ссылку на кнопку
        const productName = button.closest('.products-items-details').querySelector('.products-items-title').innerText; // Получаем название товара
        console.log(productName);

        orderProductName.innerText = `Вы хотите заказать: ${productName}`;
        formZakaz.style.display = 'block'; // показываем окно формы
    }
})
// закрытие формы при нажатии на крестик
closeButton.addEventListener('click', function() {
    formZakaz.style.display = 'none'; 
})

// закрытие формы при нажатии вне его области
window.addEventListener('click', function(event) {
    if (event.target === formZakaz) {
        formZakaz.style.display = 'none';
    }
})

function createCookie(obj){
    const pech = document.createElement('div')
    pech.classList.add("products-item")//задаем ей класс

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
    prExstraPriceJS.innerText = obj.pr
    // prExstraPriceJS.setAttribute('base-price')


    const prExstraWeightJS = document.createElement('div')
    prExstraWeightJS.classList.add("products-items-weight")
    prExstraWeightJS.innerText = obj.we

    const prBtnZ = document.createElement('button')
    prBtnZ.classList.add("button-violet-button")
    prBtnZ.innerText = "Заказать"

    prExstraInfJS.appendChild(prExstraPriceJS)
    prExstraInfJS.appendChild(prExstraWeightJS)

    prExstraJS.appendChild(prExstraInfJS)
    prExstraJS.appendChild(prBtnZ)

    details.appendChild(prTitleJS)
    details.appendChild(prTextJS)
    details.appendChild(prExstraJS)
    
    


    pech.appendChild(divImg)
    pech.appendChild(details)

    return pech
}



// productsList.innerHTML=''
for (let item of data){
    const tmpEl = createCookie(item)

    productsList.appendChild(tmpEl)
}
