<?php
include_once '../libs/app.php';
if(isset($_POST['codigo']) && isset($_POST['nombre']) && isset($_POST['apellidoPaterno']) &&isset($_POST['apellidoMaterno'])){
        $data = [
            "codigo" => $_POST['codigo'],
            "nombre" => $_POST['nombre'],
            "apellidoPaterno" => $_POST['apellidoPaterno'],
            "apellidoMaterno" => $_POST['apellidoMaterno'],
        ];
    $app = new App;
    header("Content-type: application/json");
    echo json_encode($app->trabajador()->create($data));
}else{
    $error = new Err; 
    header("Content-type: application/json");
    echo json_encode($error->geterror("los parametros estan erroneos o el metodo no es el correcto"));
}
?>