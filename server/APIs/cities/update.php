<?php 
    require_once('../../core/db.php');

    $id = $_POST["id"] ?? null;
    $city = $_POST["city"] ?? null;
    $latitude = $_POST["latitude"] ?? null;
    $longitude = $_POST["longitude"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = array(
            "city" => $city,
            "latitude" => $latitude,
            "longitude" => $longitude,
        );

        $where = array(
            array(
                "column" => "id",
                "operator" => "=",
                "value" => $id
            )
        );
        
        try {
            $result = db_update($mysql, "cities", $data, $where);
            http_response_code(203);
            echo json_encode($result);
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e -> getMessage()]);
        }
    }
?>