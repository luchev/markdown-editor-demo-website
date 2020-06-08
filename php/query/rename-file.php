<?php
$output = array();

if (isUserLoggedIn()) {
    if (count($params) < 3) {
        $output['errors'][] = "Incorrect query, provide file ID and new file name";
        answerQuery($output);
    }

    $file_id = $params[1];
    $newName = $params[2];
    if (!is_numeric($file_id)) {
        $output['errors'][] = "File ID is not numeric";
        answerQuery($output);
    }
    if ($newName === "") {
        $output['errors'][] = "File name cannot be empty";
        answerQuery($output);
    }

    require_once 'php/lib/db.php';
    $db = DB::instance();
    $uid = $_SESSION['uid'];
    $success = $db->renameFile($file_id, $newName);
    if (!$success) {
        $output['errors'][] = "Failed to update filename. " . $name;
        answerQuery($output);
    }
} else {
    $output['errors'] = "You must be logged in to rename files";
    answerQuery($output);
}

answerQuery($output);
