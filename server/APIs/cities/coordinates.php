<?php 
    require_once('../../core/db.php');

    $query = $_SERVER["QUERY_STRING"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    function getCoordinates ($mysql, $city1, $city2) {
        $result = mysqli_query($mysql,"select latitude, longitude from cities where id = '$city1' or id = '$city2'");

        $cities = array();

        foreach ($result as $row) {
            $cities[] = $row;
        }

        return json_encode($cities);
    }

    if (isset($query) && $_SERVER["REQUEST_METHOD"] === "GET") {
        $cities = explode("&", $query);

        foreach ($cities as $key => $city) {
            $cities[$key] = explode("=", $city)[1];
        }

        try {
            http_response_code(200);
            echo getCoordinates($mysql, $cities[0], $cities[1]);
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e->getMessage()]);
        }
    }