<?php 
    require_once('../../core/db.php');

    $query = $_SERVER["QUERY_STRING"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    function getShipment ($mysql, $search) {
        $search = urldecode($search);
        $result = mysqli_query($mysql,"
            select shipments.*, category, city, latitude, longitude from shipments 
            inner join categories on shipments.category_id = categories.id
            inner join cities on shipments.from_city_id = cities.id or shipments.to_city_id = cities.id
            where shipments.id = '$search' or owner_phone = '$search' or owner_email = '$search' or stage = '$search'
        ");

        $data = array();

        foreach ($result as $row) {
            array_push($data, $row);
        }

        return json_encode($data);
    }

    if (isset($query) && $_SERVER["REQUEST_METHOD"] === "GET") {
        $search = explode("=", $query)[1];

        try {
            http_response_code(200);
            echo getShipment($mysql, $search);
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e->getMessage()]);
        }
    }