<?php
$output = array();

if (isUserLoggedIn()) {
    if (count($params) > 1) {
        $file_id = $params[1];
    } else {
        $output['errors'][] = "Incorrect query.";
    }

    $content = file_get_contents('php://input');

    require_once 'php/lib/db.php';
    $db = DB::instance();
    $uid = getUid();
    $success = $db->saveFile($file_id, $content);
    if (!$success) {
        $output['errors'][] = "Failed to save file";
        answerQuery($output);
    }
} else {
    $output['errors'][] = "You must be logged in to rename files";
    answerQuery($output);
}

answerQuery($output);
