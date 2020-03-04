<?php

session_start();

include 'php/lib/header.php';
include 'php/lib/nav.php';

if (isset($_GET['p'])) {
    if (file_exists('php/page/' . $_GET['p'] . '.php')) {
        $page = $_GET['p'];
        include "php/page/$page.php";
    } else {
        include 'php/page/404.php';
    }
} else {
    include 'php/page/home.php';
}

include 'php/lib/footer.php';
