<?php 
    require_once('../../core/db.php');

    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

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
            if ($result) {
                $driver = db_execute_query($mysql, "
                    select * from driver where id = '$id';
                ");
                foreach ($driver as $row) {
                    http_response_code(201);
                    echo json_encode($row);
                    break;
                }
            } else {
                throw new Exception("حدث خطأ حاول مرة أخرى");
            }
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e -> getMessage()]);
        }
    }
?>