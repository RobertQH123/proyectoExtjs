<?php

require_once '../libs/model.php';
require_once '../models/trabajadorModel.php';
require_once '../libs/err.php';
require_once '../models/ventasModel.php';
class App{
    function __construct()
    {
        $this->db= new Model;
    }
    function trabajador(){
        $trabajador = new TrabajadorModel;
        return $trabajador;
    }
    function ventas(){
        $ventas = new VentasModel;
        return $ventas;
    }
}
?>