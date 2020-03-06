<?php

session_start();

require_once 'php/lib/utils.php';

include 'php/lib/header.php';
include 'php/lib/nav.php';

if (isset($_GET['p'])) {
    $page = explode("/", $_GET['p'])[0];
    if (file_exists('php/page/' . $page . '.php')) {
        include "php/page/$page.php";
    } else {
        error(404, "Cannot find " . $page . " on this website :(");
    }
} else {
    include 'php/page/home.php';
}

include 'php/lib/footer.php';
