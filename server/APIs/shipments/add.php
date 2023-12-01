<?php 

    require_once('../../core/db.php');
    require_once('../bills/add.php');

    define('BASE_PATH', __DIR__);

    $from = $_POST["from"] ?? null;
    $to = $_POST["to"] ?? null;
    $category_id = $_POST["category_id"] ?? null;
    $quantity = $_POST["quantity"] ?? null;
    $date_of_shipment = $_POST["date_of_shipment"] ?? null;
    $owner_name = $_POST["owner_name"] ?? null;
    $owner_email = $_POST["owner_email"] ?? null;
    $owner_phone = $_POST["owner_phone"] ?? null;
    $price = $_POST["price"] ?? null;
    $receipt = $_FILES["receipt"] ?? null;

    $mysql = db_connect($host, $username, $password, $database);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        try {
            if (!$from || !$to || !$category_id || !$quantity || !$date_of_shipment || !$owner_name || !$owner_email || !$owner_phone) { 
                http_response_code(400);
                throw new Exception("يجب ملء جميع الحقول");
            }

            $data = array(
                "from_city_id" => $from,
                "to_city_id" => $to,
                "category_id" => $category_id,
                "quantity" => $quantity,
                "date_of_shipment" => $date_of_shipment,
                "owner_name" => $owner_name,
                "owner_email" => $owner_email,
                "owner_phone" => $owner_phone,
                "status" => true,
                "stage" => "تحت المعالجة",
                "created_at" => date("Y-m-d H:i:s")
            );

            $result = db_insert($mysql, "shipments", $data);

            $id = db_execute_query($mysql, "
                select id from shipments where owner_email = '$owner_email' and owner_phone = '$owner_phone' and created_at ='". $data['created_at'] ."';
            ");

            $shipment_id = '';
            
            foreach ($id as $row) {
                http_response_code(201);
                $shipment_id = $row["id"];
            }

            $receiptURL = myAppHandleFileUpload($receipt, $shipment_id);
            
            if ($receiptURL) {
                $bill = addBill($shipment_id, $price, $receiptURL);
                if (!$bill) {
                    db_execute_query($mysql, "
                        delete from shipments where id = '$shipment_id'
                    ");
                    throw new Exception("حدث خطأ اثناء إنشاء الفاتورة,تأكد من ان البيانات مكتملة وحاول مرة أخرى");
                }
                echo json_encode(array("id" => $shipment_id));
            } else {
                db_execute_query($mysql, "
                    delete from shipments where id = '$shipment_id'
                ");
                throw new Exception("حدث خطأ اثناء رفع الصورة, حاول مرة أخرى");
            }
        } catch (Exception $e) { 
            http_response_code(400);
            echo json_encode(["message" => $e->getMessage()]);
        }
    }

    function myAppHandleFileUpload($file, $id, $directory = "") {
        $path = BASE_PATH;
        $path .= "/uploads/" . $directory ;
        $uploadPath = $path . $id . '.' . explode('/', $file["type"])[1];

        // Check if file is a valid upload
        if (!is_uploaded_file($file['tmp_name'])) {
            return false; //"Invalid file upload.";
        }

        // Check if the target directory exists, create it if necessary
        if (!file_exists($path)) {
            mkdir($path, 0755, true);
        }

        // Move the uploaded file to the target directory
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            return $uploadPath; // "File uploaded successfully.";
        } else {
            return false; // "File upload failed.";
        }
    }
?>