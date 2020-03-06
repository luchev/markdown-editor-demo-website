<?php
require_once 'php/lib/utils.php';

// If a user is already logged in, redirect
if (isset($_SESSION['signedin'])) {
    redirect_back();
}

include 'html/signup-form.html';
set_previous_page();
