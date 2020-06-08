/**
 * Verify inputted password validity
 * Password must be longer than 7 characters
 * @param {password} password 
 */
function isPasswordValid(password) {
    return password.value.length > 7;
}

/**
 * Verify if the two password fields have the same value
 * @param {password} password 
 * @param {password} passwordConfirm 
 */
function isConfirmPasswordValid(password, passwordConfirm) {
    return password.value === passwordConfirm.value;
}

/**
 * The password input field
 */
let password = document.getElementById('password');

/**
 * Reset the validity message each time the user makes change to the contents
 * of the password input field
 */
password.addEventListener('input', function (event) {
    password.setCustomValidity('');
});

/**
 * The confirm password input field
 */
let passwordConfirm = document.getElementById('password_confirm');

/**
 * Reset the validity message each time the user makes change to the contents
 * of the confirm password input field
 */
passwordConfirm.addEventListener('input', function (event) {
    passwordConfirm.setCustomValidity('');
});

/**
 * The signup form dom object
 */
let form = document.getElementById('signup-form');

/**
 * Before submitting the form validate the password and confirm password fields
 * and set form action attribute dynamically
 */
form.addEventListener('submit', function (event) {
    if (!isPasswordValid(password)) {
        password.setCustomValidity('Password must be longer than 7 characters');
        event.preventDefault();
        return false;
    }

    if (!isConfirmPasswordValid(password, passwordConfirm)) {
        passwordConfirm.setCustomValidity('Passwords do not match');
        event.preventDefault();
        return false;
    }

    form.setAttribute('action', '/p/signup-verify');
});
