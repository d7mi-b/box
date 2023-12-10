<?php 
    require_once("../../core/db.php");

    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

    $mysql = db_connect($host, $username, $password, $database);

    function addBill ($shipment_id, $price, $receipt) {
        global $mysql;

        if (!$shipment_id || !$price || !$receipt) { 
            return false;
        }
        try {

            $data = array(
                "shipment_id"=> $shipment_id,
                "price"=> $price,
                "image" => str_replace("\\", "/", $receipt)               
            );

            db_insert($mysql, "bills", $data);
            return true;
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e->getMessage()]);
        }
    }
?>