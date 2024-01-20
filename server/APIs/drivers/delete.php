<?php 
    require_once('../../core/db.php');

    session_name('BOXAUTH');
    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول, يتطلب تسجيل الدخول");
    }

    $id = $_GET["id"];

    $mysql = db_connect($host, $username, $password, $database);

    function deleteShipment ($id) {
        global $mysql;

        try {
            $result = db_execute_query($mysql, "
                update driver set status = false where id = '$id';
            ");

            return $result;
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