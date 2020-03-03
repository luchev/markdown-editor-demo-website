<?php

// If a user is already logged in, redirect
if (isset($_SESSION['loggedin'])) {
    header('location: /p/home');
}

include 'html/signup-form.html';
include 'php/lib/utils.php';
set_previous_page();
