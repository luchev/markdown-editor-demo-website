<?php

// If a user is already logged in, redirect
if (isset($_SESSION['signedin'])) {
    require 'php/lib/utils.php';
    redirect_back();
}

// If someone is making an incorrect post request, redirect
if (!isset($_POST['email']) || !isset($_POST['password'])) {
    require 'php/lib/utils.php';
    redirect_back();
}

// Connect to the database and sign in a user
require 'php/lib/db.php';
$db = DB::instance();
$email = $_POST['email'];
$password = $_POST['password'];
$db->signin($email, $password);

// Redirect after adding new user   
require 'php/lib/utils.php';
redirect_back();
