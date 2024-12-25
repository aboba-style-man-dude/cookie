const productsList = document.querySelector('.products-items') // все товары
const formZakaz = document.getElementsByClassName('formZakaz')[0] // окно формы
const closeButton = document.getElementById('closeButton') // кнопка закрытия
const orderProductName = document.getElementById('orderProductName') // для названия товара

const changeValuta = document.getElementsByClassName('perValuta')[0]

const prices = document.getElementsByClassName('products-items-price')

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



