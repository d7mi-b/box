<?php 
    require_once('../../core/db.php');

    session_name('BOXAUTH');
    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

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
            if ($result) {
                $city = db_execute_query($mysql, "
                    select * from cities where id = '$id';
                ");
                foreach ($city as $row) {
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