<?php 

    require_once('../../core/db.php');

    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

    $mysql = db_connect($host, $username, $password, $database);

    function getDrivers ($mysql) {
        $result = mysqli_query($mysql,'select * from driver where status = true');
        
        $drivers = array();

        foreach ($result as $row) {
            $drivers[] = $row;
        }

        return json_encode($drivers);
    }

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        try {
            http_response_code(200);
            echo getDrivers($mysql);
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e]);
        }
    }