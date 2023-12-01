<?php 

    require_once('../../core/db.php');

    $mysql = db_connect($host, $username, $password, $database);

    function getCategories ($mysql) {
        $result = mysqli_query($mysql,'select * from categories');
        
        $categories = array();

        foreach ($result as $row) {
            $categories[] = $row;
        }

        return json_encode($categories);
    }

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        http_response_code(200);
        echo getCategories($mysql);
    }