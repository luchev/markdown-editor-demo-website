<?php

include 'html/home.html';

if (isset($_SESSION['loggedin'])) {
    echo "Logged in as " . $_SESSION['email'];
    echo " with id " . $_SESSION['id'];
}
