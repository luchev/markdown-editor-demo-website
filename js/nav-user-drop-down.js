let navUser = document.getElementById('nav-user');
let navUserDropdown = document.getElementById('nav-user-drop-down')

window.addEventListener('click', function (event) {
    if (event.target.closest('#nav-user')) {  // If clicked on nav-user
        if (navUserDropdown.style.display == 'none') {
            navUserDropdown.style.display = 'block';
        } else {
            navUserDropdown.style.display = 'none';
        }
    } else {  // If clicked outside of the drop-down -> hide the drop down
        navUserDropdown.style.display = 'none';
    }
});

// Hide dropdown when ESC key is pressed
window.addEventListener('keydown', function (event) {
    if (event.which == 27 && navUserDropdown.style.display != 'none') {
        navUserDropdown.style.display = 'none';
    }
});
