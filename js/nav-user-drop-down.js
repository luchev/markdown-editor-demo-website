
let navUser = document.getElementById('nav-user');
let navUserDropdown = document.getElementById('nav-user-drop-down')
navUser.addEventListener('click', function () {
    if (navUserDropdown.style.display == 'none') {
        navUserDropdown.style.display = 'block';
    } else {
        navUserDropdown.style.display = 'none';
    }
});
