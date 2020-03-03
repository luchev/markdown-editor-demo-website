/**
 * Before submitting the form set the form action attribute dynamically
 */
let form = document.getElementById('signin_form');
form.addEventListener('submit', function (event) {
    form.setAttribute('action', '/p/signin-verify');
});
