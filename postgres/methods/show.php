<?php
include_once '../libs/app.php';
if(isset($_GET['id'])){
    $id = $_GET['id'];
    $app = new App;
    header("Content-type: application/json");
    echo json_encode($app->trabajador()->getById($id));
}else{
    $error = new Err; 
    header("Content-type: application/json");
    echo json_encode($error->geterror("los parametros estan erroneos o el metodo no es el correcto"));
}
?>