<?php
include_once '../libs/app.php';
if(isset($_POST['id'])){
    $id = $_POST['id'];
    $app = new App;
    header("Content-type: application/json");
    echo json_encode($app->trabajador()->delete($id));
}else{
    $error = new Err; 
    header("Content-type: application/json");
    echo json_encode($error->geterror("los parametros estan erroneos o el metodo no es el correcto"));
}
?>