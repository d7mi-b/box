<?php 
    require_once('../../core/db.php');

    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

    $query = $_SERVER["QUERY_STRING"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    $id = $_GET['id'];

    function deleteShipment ($id) {
        global $mysql;

        $result = db_execute_query($mysql, "
            update trucks set status = 'محذوفة' where id = '$id';
        ");

        return $result;
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