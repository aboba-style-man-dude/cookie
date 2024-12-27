const formTitle = document.getElementById('form-title');
const toggleForm = document.getElementById('toggle-form');
const confirmPasswordGroup = document.getElementById('confirm-password-group');
const authForm = document.getElementById('auth-form');

let isSignup = false;

toggleForm.addEventListener('click', () => {
    isSignup = !isSignup;
    formTitle.textContent = isSignup ? 'Создать аккаунт' : 'Вход';
    confirmPasswordGroup.style.display = isSignup ? 'block' : 'none';
    toggleForm.innerHTML = isSignup
    ? "У вас уже есть аккаунт? <span>Вход</span>"
    : "У вас нет аккаунта? <span>Создать аккаунт</span>"
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (isSignup && password !==confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    alert(`${isSignup ? 'Signup' : 'Login'} successful!`);
});