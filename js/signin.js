window.onload = function () {
    // Show signin window
    let signinToggle = document.getElementById('signin-toggle');
    let signinPopup = document.getElementById('signin-popup');
    signinToggle.addEventListener('click', function () {
        if (signinPopup.style.display == 'none') {
            signinPopup.style.display = 'flex';
        }
    });

    // Hide signin window when clicked outside
    window.onclick = function (event) {
        if (event.target == signinPopup) {
            signinPopup.style.display = 'none';
        }
    }

    // Hide signin window when ESC key is pressed
    window.addEventListener('keydown', function (event) {
        if (event.which == 27 && signinPopup.style.display == 'flex') {
            signinPopup.style.display = 'none';
        }
    });

    // Login form
    let loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function () {
        loginForm.setAttribute('action', '/p/login-verify');
    });

    // Sign up form
    let signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', function (event) {
        let password = signupForm.querySelector('[name=password]');
        let confirmPassword = signupForm.querySelector('[name=confirm-password]');
        if (!isPasswordValid(password)) {
            password.setCustomValidity('Password must be longer than 7 characters');
            event.preventDefault();
            return false;
        }

        if (!isConformPasswordValid(password, confirmPassword)) {
            confirmPassword.setCustomValidity('Passwords do not match');
            event.preventDefault();
            return false;
        }
        signupForm.setAttribute('action', '/p/signup-verify');
    });


    let password = signupForm.querySelector('[name=password]');
    password.addEventListener('input', function () {
        password.setCustomValidity('');
    });

    let confirmPassword = signupForm.querySelector('[name=confirm-password]');
    confirmPassword.addEventListener('input', function () {
        confirmPassword.setCustomValidity('');
    });
};

/**
 * Verify inputted password validity
 * Password must be longer than 7 characters
 * @param {string} password 
 */
function isPasswordValid(password) {
    return password.value.length > 7;
}

/**
 * Verify if the two password fields have the same value
 * @param {string} password
 * @param {string} passwordConfirm
 */
function isConformPasswordValid(password, passwordConfirm) {
    return password.value === passwordConfirm.value;
}

/**
 * Switch to a different tab panel
 * 
 * @param {Event} event
 * @param {string} panelName 
 */
function openTab(event, panelName) {
    let tabPanels = document.getElementsByClassName('tab-panel');
    for (i = 0; i < tabPanels.length; i++) {
        tabPanels[i].classList.remove('tab-panel-active');
    }

    let tabLinks = document.getElementsByClassName('tab-link');
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('tab-link-active');
    }

    document.getElementById(panelName).classList.add('tab-panel-active');
    event.currentTarget.classList.add('tab-link-active');
}
