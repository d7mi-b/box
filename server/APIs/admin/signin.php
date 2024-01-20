<?php 
    require_once('../../core/db.php');

    session_start();
    session_regenerate_id();
    if(!isset($_SESSION['email'])) {    // if there is no valid session
        throw new Exception("ليس لديك صلاحية الوصول");
    }

    $mysql = db_connect($host, $username, $password, $database);

    $email = $_POST["email"] ?? null;
    $password = $_POST["password"] ?? null;

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        try {
            if (!$email || !$password) {
                http_response_code(400);
                throw new Exception("يجب ملء جميع الحقول");
            }

            $data = array(
                "email" => $email,
                "password" => password_hash($password, PASSWORD_DEFAULT)
            );

            $result = db_insert($mysql, "admin", $data);

            if ($result) {
                session_name('BOXAUTH');
                session_start();
            } else {
                throw new Exception("حدث خطأ حاول مره أخرى");
            }

        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e -> getMessage()]);
        }
    }
?>