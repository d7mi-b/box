<?php
    session_start();
    session_name('BOXAuth');
    $email = $_POST["email"] ?? null;
    $password = $_POST["password"] ?? null;

    print_r($_POST);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $_SESSION["email"] = $email;

        echo $_SESSION["email"];
        echo "\n" . session_id() . "\n";
        echo $_COOKIE["PHPSESSID"];
    }
?>