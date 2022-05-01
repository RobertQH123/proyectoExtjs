<?php
include_once '../libs/app.php';
$app = new App;
header("Content-type: application/json");
echo json_encode($app->trabajador()->get());
?>