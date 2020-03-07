<?php
require_once 'php/lib/utils.php';

// If a user is already logged in, redirect
if (isset($_SESSION['loggedin'])) {
    redirect_back();
}

// If someone is making an incorrect post request, redirect
if (!isset($_POST['email']) || !isset($_POST['password'])) {
    redirect_back();
}

// Connect to the database and sign in a user
require_once 'php/lib/db.php';
$db = DB::instance();
$email = $_POST['email'];
$password = $_POST['password'];
$db->login($email, $password);

// Redirect after adding new user   
redirect_back();
