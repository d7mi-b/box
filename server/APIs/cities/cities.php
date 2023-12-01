<?php 

    require_once('../../core/db.php');

    $mysql = db_connect($host, $username, $password, $database);

    function getCities ($mysql) {
        $result = mysqli_query($mysql,'select * from cities');
        
        $cities = array();

        foreach ($result as $row) {
            $cities[] = $row;
        }

        return json_encode($cities);
    }

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        try {
            http_response_code(200);
            echo getCities($mysql);
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e]);
        }
    }