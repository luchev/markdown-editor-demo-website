<?php

function redirect_back() {
    if (isset($_SESSION['previous_page'])) {
        $previousPage = $_SESSION['previous_page'];
        unset($_SESSION['previous_page']);
    } else if (isset($_SERVER['HTTP_REFERER'])) {
        $previousPage = $_SERVER['HTTP_REFERER'];
    } else {
        $previousPage = header("location: /p/home");
    }

    header("location: $previousPage");
}

function set_previous_page() {
    if (isset($_SERVER['HTTP_REFERER'])) {
        $referer_path = parse_url($_SERVER['HTTP_REFERER'])['path'];
        $current_path = $_SERVER['REQUEST_URI'];
        if ($referer_path !== $current_path) {
            $_SESSION['previous_page'] = $referer_path;
        }
    } else {
        $_SESSION['previous_page'] = '/p/home';
    }
}

function starts_with(string $haystack, string $needle) {
    $needleLength = strlen($needle);
    return (substr($haystack, 0, $needleLength) === $needle);
}

function ends_with(string $haystack, string $needle) {
    $needleLength = strlen($needle);
    return (substr($haystack, -$needleLength) === $needle);
}
