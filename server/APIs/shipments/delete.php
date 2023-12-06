<?php 
    require_once('../../core/db.php');

    $query = $_SERVER["QUERY_STRING"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    function deleteShipment ($id) {
        global $mysql;

        try {
            db_execute_query($mysql, "
                update shipments set status = false where id = '$id';
            ");

            return true;
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(array("message" => $e->getMessage()));
        }
    }

    if ($_SERVER["REQUEST_METHOD"] === 'DELETE') {
        $id = explode("=", $query)[1];
        if (deleteShipment($id)) { 
            http_response_code(203);
            echo json_encode(array("message"=> 'تم حذف الشحنة'));
        }
    }
?>