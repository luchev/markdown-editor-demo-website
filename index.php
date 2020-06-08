<?php

session_start();
require_once 'php/lib/utils.php';

if (isset($_GET['q'])) {
    $params = parse_url_params($_GET['q']);
    $query = $params[0];
    if (file_exists('php/query/' . $query . '.php')) {
        include "php/query/$query.php";
        return;
    } else {
        error(404, "Cannot find /q/" . $query . " on this website :(");
    }
}

include 'php/lib/header.php';
include 'php/lib/nav.php';
if (isset($_GET['p'])) {
    $params = parse_url_params($_GET['p']);
    $page = $params[0];
    if (file_exists('php/page/' . $page . '.php')) {
        include "php/page/$page.php";
    } else {
        error(404, "Cannot find /p/" . $page . " on this website :(");
    }
} else {
    include 'php/page/home.php';
}
include 'php/lib/footer.php';
