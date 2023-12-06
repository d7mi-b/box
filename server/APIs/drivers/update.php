<?php 
    require_once('../../core/db.php');

    $id = $_POST["id"] ?? null;
    $name = $_POST["name"] ?? null;
    $email = $_POST["email"] ?? null;
    $phone = $_POST["phone"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = array(
            "name" => $name,
            "email" => $email,
            "phone" => $phone
        );

        $where = array(
            array(
                "column" => "id",
                "operator" => "=",
                "value" => $id
            )
        );
        
        try {
            $result = db_update($mysql, "driver", $data, $where);
            http_response_code(203);
            echo json_encode($result);
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e -> getMessage()]);
        }
    }
?>