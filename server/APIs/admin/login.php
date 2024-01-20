<?php
    require_once('../../core/db.php');

    $mysql = db_connect($host, $username, $password, $database);

    $email = $_POST["email"] ?? null;
    $password = $_POST["password"] ?? null;

    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        try {
            $result = db_execute_query($mysql, "
                select * from admin where email = '$email'
            ");

            if ($result -> num_rows == 0) {
                throw new Exception("البريد الإلكتروني غير صحيح");
            }

            foreach ($result as $row) {
                $admin = $row;
                break;
            }

            $match = password_verify($password, $admin["password"]);

            if ($match) {
                session_name('BOXAUTH');
                session_start();
                $_SESSION["email"] = $email;
                http_response_code(201);
                echo json_encode(["message" => "تم تسجيل الدخول بنجاح"]);
            } else {
                throw new Exception("كلمة المرور غير صحية");
            }
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e -> getMessage()]);
        }
    }
?>