<?php
require_once '../models/trabajador.php';
class TrabajadorModel extends Model{
    public function __construct()
    {
        parent::__construct();
    }

    public function get(){
        $err = new Err;
        $items = [];
        try{
            $query = $this->db->connect()->query('SELECT * FROM prueba.trabajador WHERE est_ado = 1');
            while($row = $query->fetch()){
                $item =  new Trabajador();
                $item->id = $row['tra_ide'];
                $item->codigo = $row['tra_cod'];
                $item->nombre = $row['tra_nom'];
                $item->apellidoPaterno = $row['tra_pat'];
                $item->apellidoMaterno = $row['tra_mat'];
                array_push($items,$item->getArray());
            }
            return $items;
        }catch(PDOException $e){
            return $err->geterror("problemas con la conexion al servidor");
        } 
    }
    public function getById($id){
        $err = new Err;
        try{
            $item =  new Trabajador();
            $query = $this->db->connect()->prepare('SELECT * FROM prueba.trabajador WHERE tra_ide = :id');
            $query->bindParam('id',$id);
            $query->execute();
            while($row = $query->fetch()){
                $item->id = $row['tra_ide'];
                $item->codigo = $row['tra_cod'];
                $item->nombre = $row['tra_nom'];
                $item->apellidoPaterno = $row['tra_pat'];
                $item->apellidoMaterno = $row['tra_mat'];
            }
            if($query->rowCount()>0){
                return $item->getArray();  
            }
            return $err->geterror("trabajador no existe");
        }catch(PDOException $e){
            return $err->geterror("problemas con la conexion al servidor");
        }  
    }


    public function upDate($param){
        $err = new Err;
        try{
            $query = $this->db->connect()->prepare("UPDATE prueba.trabajador 
            SET tra_cod=:codigo,tra_nom=:nombre,tra_pat=:apellidoPaterno,tra_mat=:apellidoMaterno
            WHERE tra_ide = :id
            ");
            $query->bindParam('codigo',$param['codigo']);
            $query->bindParam('nombre',$param['nombre']);
            $query->bindParam('apellidoPaterno',$param['apellidoPaterno']);
            $query->bindParam('apellidoMaterno',$param['apellidoMaterno']);
            $query->bindParam('id',$param['id']);
            $query->execute();
            if($query->rowCount()>0){
                return $err->okey("cambios guardados");
            }
            return $err->geterror("no se pudo guardar");
        }catch(PDOException $e){
            return $err->geterror("problemas con la conexion al servidor");
        }
    }
    public function create($param){
        $err = new Err;
        try{
            $query = $this->db->connect()->prepare("INSERT INTO prueba.trabajador(tra_cod,tra_nom,tra_pat,tra_mat) VALUES
            (:codigo,:nombre,:apellidoPaterno,:apellidoMaterno)");
            $query->bindParam('codigo',$param['codigo']);
            $query->bindParam('nombre',$param['nombre']);
            $query->bindParam('apellidoPaterno',$param['apellidoPaterno']);
            $query->bindParam('apellidoMaterno',$param['apellidoMaterno']);
            $query->execute();
            if($query->rowCount()>0){
                $query2 = $this->db->connect()->query("SELECT tra_ide FROM prueba.trabajador 
                WHERE tra_cod='".$param["codigo"]."' AND tra_nom='".$param["nombre"]."'");
                $idr = $query2->fetch(PDO::FETCH_OBJ)->tra_ide;
                return $err->okey("trabajador creado exitosamente",$idr);
            }
            return $err->geterror("no se pudo crear");
        }catch(PDOException $e){
            return $err->geterror("problemas con la conexion al servidor");
        }
    }
    public function delete($param){
        $err = new Err;
        try{
            $query = $this->db->connect()->prepare("update prueba.trabajador set est_ado= 0 WHERE tra_ide=:id");
            $query->bindParam('id',$param);
            $query->execute();
            if($query->rowCount()>0){
                return $err->okey("trabajador eliminado exitosamente");
            }
            return $err->geterror("no se pudo eliminar");
        }catch(PDOException $e){
            return $err->geterror("problemas con la conexion al servidor");
        }
    } 
}
?>