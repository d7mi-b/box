<?php 
    require_once('../../core/db.php');

    $id = $_POST["id"] ?? null;
    $number = $_POST["number"] ?? null;
    $capacity = $_POST["capacity"] ?? null;
    $status = $_POST["status"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = array(
            "number" => $number,
            "capacity" => $capacity,
            "status" => $status
        );

        $where = array(
            array(
                "column" => "id",
                "operator" => "=",
                "value" => $id
            )
        );
        
        try {
            $result = db_update($mysql, "trucks", $data, $where);
            http_response_code(201);
            echo json_encode($result);
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e -> getMessage()]);
        }
    }
?>