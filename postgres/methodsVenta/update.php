<?php
include_once '../libs/app.php';
if(isset($_POST['cantidad']) && isset($_POST['cliente']) && isset($_POST['num']) 
    &&isset($_POST['precio']) &&isset($_POST['producto']) &&isset($_POST['ser']) 
    &&isset($_POST['total']) &&isset($_POST['id']) &&isset($_POST['idDetails'])){
        $data = [
           'cantidad' => $_POST['cantidad'],
           'cliente'=> $_POST['cliente'],
           'num'=> $_POST['num'],
           'precio'=> $_POST['precio'],
           'producto'=> $_POST['producto'],
           'ser' => $_POST['ser'],
           'total'=> $_POST['total'],
           'id'=> $_POST['id'],
           'idDetails'=> $_POST['idDetails'],
        ];
    $app = new App;
    header("Content-type: application/json");
    echo json_encode($app->ventas()->upDate($data));
}else{
    $error = new Err; 
    header("Content-type: application/json");
    echo json_encode($error->geterror("los parametros estan erroneos o el metodo no es el correcto"));
}
?>