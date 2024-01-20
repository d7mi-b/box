<?php 
    require_once('../../core/db.php');
    require_once('../bills/add.php');

    session_name('BOXAUTH');
    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

    $number = $_POST["number"] ?? null;
    $capacity = $_POST["capacity"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        try {
            if (!$number || !$capacity) {
                http_response_code(400);
                throw new Exception("يجب ملء جميع الحقول");
            }

            $data = array(
                "number" => $number,
                "capacity" => $capacity,
                "status" => "متفرغة"
            );

            db_insert($mysql, "trucks", $data);

            $id = db_execute_query($mysql, "
                select * from trucks where number = '$number' and capacity = '$capacity';
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