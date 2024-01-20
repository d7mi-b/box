<?php 
    require_once('../../core/db.php');

    session_name('BOXAUTH');
    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

    $id = $_POST["id"] ?? null;
    $number = $_POST["number"] ?? null;
    $capacity = $_POST["capacity"] ?? null;
    $drivers = $_POST["drivers"] ?? null;
    $status = $_POST["status"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = array(
            "number" => $number,
            "capacity" => $capacity,
            "driver_id" => $drivers ,
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

            if ($result) {
                $truck = db_execute_query($mysql, "
                    select trucks.*, driver.name from trucks left outer join driver on
                    trucks.driver_id = driver.id where trucks.id = '$id';
                ");
                foreach ($truck as $row) {
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