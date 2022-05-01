<?php
require_once '../models/ventaDetalles.php';
class Ventas extends ventaDetalles{
    public $id;
    public $ser;
    public $num;  
    public $cliente;  
    public $monto;
    function getArray(){
        $data = [
            "id" => $this->id,
            "ser" => $this->ser,
            "num" => $this->num,
            "cliente" => $this->cliente,
            "monto" => $this->monto,
            "detalles" => [
                "id"=> $this->idDetalles,
                "producto"=> $this->producto,
                "unidad"=> $this->unidad,
                "cantidad"=> $this->cantidad,
                "total"=> $this->total,
            ]
        ];
        return $data;
    }
}


?>