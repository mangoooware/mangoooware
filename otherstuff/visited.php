<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $link = trim($_POST['link']);
    if ($link && strpos($link, 'onion') !== false) {
        file_put_contents('visited.txt', $link . PHP_EOL, FILE_APPEND | LOCK_EX);
        echo "OK";
    } else {
        http_response_code(400);
        echo "Invalid link";
    }
}
?>