<main>
<div class = "error">

<?php

$urlParams = (parse_url_params($_GET['p']));
$errorCode = $urlParams[1];
$errorMessage = $urlParams[2];

echo "<div class='error-code'>$errorCode</div>";
echo "<div class='error-message'>$errorMessage</div>";

?>

</div>
</main>
