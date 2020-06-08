<?php
$output = array();

if (isUserLoggedIn()) {
    if (count($params) < 2) {
        $output['errors'][] = "Incorrect query, provide file ID";
        answerQuery($output);
    }

    $file_id = $params[1];
    if (!is_numeric($file_id)) {
        $output['errors'][] = "File ID is not numeric";
        answerQuery($output);
    }

    require_once 'php/lib/db.php';
    $db = DB::instance();
    $uid = $_SESSION['uid'];
    $success = $db->deleteFile($file_id);
    if (!$success) {
        $output['errors'][] = "Failed to delete file";
        answerQuery($output);
    }
} else {
    $output['errors'] = "You must be logged in to delete files";
    answerQuery($output);
}

answerQuery($output);
