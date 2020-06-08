<?php
$output = array();

if (isUserLoggedIn()) {        
    require_once 'php/lib/db.php';
    $db = DB::instance();
    $uid = getUid();
    $files = $db->listFiles($uid);
    if ($files) {
        $output['files'] = $files;
    } else {
        $output['errors'][] = "Failed to retrieve user files";
        answerQuery($output);
    }
} else {
    $output['errors'][] = "You must be logged in to see your files";
    answerQuery($output);
}

answerQuery($output);
