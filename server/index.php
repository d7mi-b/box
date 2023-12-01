<?php 
    // Hello in Box server!

    require_once('./core/db.php');

    $mysql = db_connect($host, $username, $password, $database);

    $result = mysqli_query($mysql, "select * from cities");

    echo "<pre>";
    foreach ($result as $row) {
        print_r($row);
    }
    echo "</pre>";
?>