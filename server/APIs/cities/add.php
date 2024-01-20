<?php 
    require_once('../../core/db.php');
    require_once('../bills/add.php');

    session_name('BOXAUTH');
    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

    $city = $_POST["city"] ?? null;
    $latitude = $_POST["latitude"] ?? null;
    $longitude = $_POST["longitude"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        try {
            if (!$city || !$latitude || !$longitude) {
                http_response_code(400);
                throw new Exception("يجب ملء جميع الحقول");
            }

            $data = array(
                "city" => $city,
                "latitude" => $latitude,
                "longitude" => $longitude,
                // "status" => true
            );

            db_insert($mysql, "cities", $data);

            $id = db_execute_query($mysql, "
                select * from cities where latitude = '$latitude' and longitude = '$longitude';
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