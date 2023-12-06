<?php 
    require_once('../../core/db.php');
    require_once('../bills/add.php');

    define('BASE_PATH', __DIR__);

    $name = $_POST["name"] ?? null;
    $email = $_POST["email"] ?? null;
    $phone = $_POST["phone"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        try {
            if (!$name || !$email || !$phone) {
                http_response_code(400);
                throw new Exception("يجب ملء جميع الحقول");
            }

            $data = array(
                "name" => $name,
                "email" => $email,
                "phone" => $phone,
                "status" => true
            );

            db_insert($mysql, "driver", $data);

            $id = db_execute_query($mysql, "
                select * from driver where email = '$email' and phone = '$phone';
            ");
            

            foreach ($id as $row) {
                http_response_code(201);
                echo json_encode($row);
                break;
            }

        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e -> getMessage()]);
        }
    }
?>