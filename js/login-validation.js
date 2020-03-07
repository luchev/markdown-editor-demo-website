/**
 * Before submitting the form set the form action attribute dynamically
 */
let form = document.getElementById('login-form');
form.addEventListener('submit', function (event) {
    form.setAttribute('action', '/p/login-verify');
});
