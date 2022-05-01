<?php
class Trabajador {
    public $codigo;
    public $nombre;
    public $apellidoPaterno;
    public $apellidoMaterno;
    public $id;

    function getArray(){
        $data = [
            "id" => $this->id,
            "codigo" => $this->codigo,
            "nombre" => $this->nombre,
            "apellidoPaterno" => $this->apellidoPaterno,
            "apellidoMaterno" => $this->apellidoMaterno
        ];
        return $data;
    }
}
?>