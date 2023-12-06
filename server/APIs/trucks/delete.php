<?php 
    require_once('../../core/db.php');

    $query = $_SERVER["QUERY_STRING"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    function deleteShipment ($id) {
        global $mysql;

        $result = db_execute_query($mysql, "
            update trucks set status = 'محذوفة' where id = '$id';
        ");

        return $result;
    }

    if ($_SERVER["REQUEST_METHOD"] === 'DELETE') {
        $id = explode("=", $query)[1];
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