<?php
require_once 'php/lib/utils.php';

// If a user is already logged in, redirect
if (isUserLoggedIn()) {
    redirect_back();
}

// If someone is making an incorrect post request, redirect
if (!isset($_POST['email']) || !isset($_POST['password'])) {
    redirect_back();
}

$email = $_POST['email'];
// Validate email

$email = format_email($email);

if (!is_email_valid($email)) {
    /**
     * TODO add error message
     */
}

$password = $_POST['password'];

/**
 * TODO add password validation
 */

// Connect to the database and add new user
require_once 'php/lib/db.php';
$db = DB::instance();
$db->signup($email, $password);

// Redirect after adding new user   
redirect_back();
