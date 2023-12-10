<?php 

    require_once('../../core/db.php');

    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

    $mysql = db_connect($host, $username, $password, $database);

    function getTrucks ($mysql) {
        $result = mysqli_query($mysql, "
            select trucks.*, driver.name from trucks left outer join driver on
            trucks.driver_id = driver.id where trucks.status != 'محذوفة'
        ");
        
        $trucks = array();

        foreach ($result as $row) {
            $trucks[] = $row;
        }

        return json_encode($trucks);
    }

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        http_response_code(200);
        echo getTrucks($mysql);
    }