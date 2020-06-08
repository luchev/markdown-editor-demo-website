<?php

function redirect_back() {
    if (isset($_SESSION['previous_page'])) {
        $previousPage = $_SESSION['previous_page'];
        unset($_SESSION['previous_page']);
    } else if (isset($_SERVER['HTTP_REFERER'])) {
        $previousPage = $_SERVER['HTTP_REFERER'];
    } else {
        $previousPage = "/p/home";
    }

    if (ends_with($previousPage, $_SERVER['REQUEST_URI'])) {
        $previousPage = "/p/home";
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

/**
 * Check if $haystack starts with $needle
 * @param string $haystack - string to check
 * @param string $needle string to look for at the beginning of $haystack
 * @return bool
 */
function starts_with(string $haystack, string $needle) {
    $needleLength = strlen($needle);
    return (substr($haystack, 0, $needleLength) === $needle);
}

/**
 * Check if $haystack ends with $needle
 * @param string $haystack - string to check
 * @param string $needle string to look for at the end of $haystack
 * @return bool
 */
function ends_with(string $haystack, string $needle) {
    $needleLength = strlen($needle);
    return (substr($haystack, -$needleLength) === $needle);
}

/**
 * Remove empty spaces at the start/end of the email string
 * Convert all letters to lowercase
 * @param string $email
 * @return string 
 */
function format_email(string $email) {
    return strtolower(trim($email));
}

/**
 * Check if an email is valid
 * @param string @email
 * @return bool
 */
function is_email_valid($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Count letters in a string
 * @param string str - input string
 * @return int
 */
function count_letters($str) {
    $letterCount = 0;
    $strSplit = str_split($str, 1);
    $regexLetter = '/\w/';
    $regexNotUnderscore = '/[^_]/';
    
    foreach ($strSplit as $char) {
        if (preg_match($regexLetter, $char) &&
            preg_match($regexNotUnderscore, $char)) {
            $letterCount++;
        }
    }

    return $letterCount;
}

/**
 * Count digits in a string
 * @param string str - input string
 * @return int
 */
function count_digits($str) {
    $digitCount = 0;
    $strSplit = str_split($str, 1);
    $regexDigit = '/\d/';
    
    foreach ($strSplit as $char) {
        if (preg_match($regexDigit, $char)) {
            $digitCount++;
        }
    }

    return $digitCount;
}

/**
 * Count special characters in a string
 * @param string str - input string
 * @return int
 */
function count_special_characters($str) {
    $specialCharCount = 0;
    $strSplit = str_split($str, 1);
    $regexSpecialChar = '/[^\w\d]/';
    $regexUnderscore = '/_/';
    
    foreach ($strSplit as $char) {
        if (preg_match($regexSpecialChar, $char) &&
            preg_match($regexUnderscore, $char)) {
            $specialCharCount++;
        }
    }

    return $specialCharCount;
}

/**
 * Check if a password is valid
 * This method applies custom password validation
 * A valid password contains 1 character and 1 number
 * @param string $password to validate
 */
function is_password_valid(string $password) {
   // TODO 
}

/**
 * Redirect to the error page which has no content except
 * the header, footer and the error $message and $code
 * @param int $code is the error code
 * @param string $message is the error message
 */
function error(int $code, string $message) {
    header("location: /p/error/$code/$message");
}

/**
 * Split an url on forward slash / and return an array
 * from the split parts
 * @param string $url URL to split on /
 */
function parse_url_params(string $url) {
    return explode("/", $url);
}

/**
 * End a query to the server api priting the response and setting the http code
 */
function answerQuery($output) {
    if (isset($output['errors'])) {
        http_response_code(400);
        $output['success'] = FALSE;
    } else {
        http_response_code(200);
        $output['success'] = TRUE;
    }
    print(json_encode($output));
    die();
}

/**
 * Check if a user is logged in (session is started)
 */
function isUserLoggedIn() {
    return isset($_SESSION['loggedin']);
}

function getUid() {
    if (isset($_SESSION['uid'])) {
        return $_SESSION['uid'];
    } else {
        return -1;
    }
}
