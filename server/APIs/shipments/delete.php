<?php 
    require_once('../../core/db.php');

    $id = $_GET['id'];

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
        try {
            if (deleteShipment($id))
                http_response_code(204);
            else 
                throw new Exception("حدث خطأ");
        } catch (Exception $e) {
            http_response_code(500);
            echo $e->getMessage();
        }
    }
?>