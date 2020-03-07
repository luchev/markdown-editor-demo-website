<nav>
    <div id="nav-logo" class="nav-section">
        <a href="/p/home">
            <svg id="logo-svg" viewBox="0 59.08 639.99 393.84" class="block">
                <path fill="#b9bbbe"
                    d="m593.85 452.92h-547.7c-25.45 0-46.15-20.7-46.15-46.15v-301.54c0-25.45 20.7-46.15 46.15-46.15h547.69c25.45 0 46.15 20.7 46.15 46.15v301.54c0.01 25.45-20.69 46.15-46.14 46.15zm-440-92.3v-120l61.54 76.92 61.54-76.92v120h61.54v-209.24h-61.54l-61.54 76.92-61.54-76.92h-61.54v209.23h61.54zm412.3-104.62h-61.54v-104.62h-61.54v104.62h-61.54l92.31 107.69 92.31-107.69z" />
            </svg>
        </a>
    </div>
    <div id="nav-links" class="nav-section">
<?php
    if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true) {
        include 'html/nav-loggedin.html';
    } else {
        include 'html/nav-loggedout.html';
    }
?>
    </div>
</nav>
