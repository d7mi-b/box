<?php 
    require_once('../../core/db.php');
    require_once('../bills/add.php');

    session_name('BOXAUTH');
    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

    print_r($_POST);

    $stage = $_POST["stage"] ?? null;
    $truck_id = $_POST["truck_id"] ?? null;
    $id = $_POST["shipment_id"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $data = array(
            "stage" => $stage,
            "truck_id" => $truck_id
        );

        $where = array(
            array(
                "column" => "id",
                "operator" => "=",
                "value" => $id
            )
        );
        
        try {
            $result = db_update($mysql, "shipments", $data, $where);
            http_response_code(203);
            echo json_encode($result);
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e->getMessage()]);
        }
    }
?>