<?php 

    require_once('../../core/db.php');

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