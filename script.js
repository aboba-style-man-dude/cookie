const productsList = document.querySelector('.products-items'); // все товары
const formZakaz = document.getElementsByClassName('formZakaz')[0] // окно формы
const closeButton = document.getElementById('closeButton'); // кнопка закрытия
const orderProductName = document.getElementById('orderProductName'); // для названия товара

// при нажатии заказать
productsList.addEventListener('click', function(event) {
    // Проверяем, была ли нажата какя-нибудь кнопка "Заказать"
    if (event.target && event.target.classList.contains('button-violet-button')) {
        const button = event.target; // сохраняем ссылку на кнопку
        const productName = button.closest('.products-items-details').querySelector('.products-items-title').innerText; // Получаем название товара
        console.log(productName);

        orderProductName.innerText = `Вы хотите заказать: ${productName}`;
        formZakaz.style.display = 'block'; // Показываем окно формы
    }
});
// Закрытие формы при нажатии на крестик
closeButton.addEventListener('click', function() {
    formZakaz.style.display = 'none'; 
});

// Закрытие формы при нажатии вне его области
window.addEventListener('click', function(event) {
    if (event.target === formZakaz) {
        formZakaz.style.display = 'none';
    }
});



