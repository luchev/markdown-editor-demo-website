<?php

$icons = scandir("./images/icons");
foreach ($icons as $icon) {
    if ($icon != "." && $icon != "..") {
        echo "<div style='float: left; margin: 5px'><img src='/images/icons/$icon' width='100px' height='100px' alt='$icon' /><br>$icon</div>";
    }
}
