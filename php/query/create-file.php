<?php
$output = array();

if (isUserLoggedIn()) {
    $filename = "New File";
    if (count($params) > 1) {
        $filename = $params[1];
    }

    if (strlen($filename) > 250) {
        $output['errors'][] = "Filename is too long";
        answerQuery($output);
    }
    if ($filename === "") {
        $output['errors'][] = "File name cannot be empty";
        answerQuery($output);
    }
    
    require_once 'php/lib/db.php';
    $db = DB::instance();
    $uid = getUid();
    $file_id = $db->createFile($uid, $filename);
    if ($file_id) {
        $output['file_id'] = $file_id;
    } else {
        $output['errors'][] = "Creating new file failed";
        answerQuery($output);
    }
} else {
    $output['errors'][] = "You must be logged in to create files";
    answerQuery($output);
}

answerQuery($output);
