<?php

if (!isUserLoggedIn()) {
    redirect_back();
}

include 'html/editor.html';
