<?php
$output = array();

if (isUserLoggedIn()) {
    if (count($params) > 1) {
        $file_id = $params[1];
    } else {
        $output['errors'][] = "No file ID provided";
        answerQuery($output);
    }
    require_once 'php/lib/db.php';
    $db = DB::instance();
    $uid = getUid();
    $content = $db->loadFile($file_id);
    if ($content || $content === "") {
        $output['content'] = $content;
    } else {
        $output['errors'][] = "Failed to load file content";
        answerQuery($output);
    }
} else {
    $output['errors'][] = "You must be logged in to see the content of files";
    answerQuery($output);
}

answerQuery($output);
