<?php
require_once '../models/ventas.php';
class VentasModel extends Model{
    public function __construct()
    {
        parent::__construct();
    }

    public function get(){
        $err = new Err;
        $items = [];
        try{
            $query = $this->db->connect()->query('SELECT V.ven_ide as id,v_d_ide,v_d_pro,v_d_uni,v_d_can,v_d_tot,
            ven_ser,ven_num,ven_cli,ven_mon
            FROM prueba.venta_detalle D,prueba.venta V
            WHERE D.est_ado = 1 AND (V.ven_ide = D.ven_ide)');
            while($row = $query->fetch()){
                $item =  new Ventas();
                $item->idDetalles = $row['v_d_ide'];
                $item->producto = $row['v_d_pro'];
                $item->unidad = $row['v_d_uni'];
                $item->cantidad = $row['v_d_can'];
                $item->total = $row['v_d_tot'];
                $item->id = $row['id'];
                $item->ser = $row['ven_ser'];
                $item->num = $row['ven_num'];
                $item->cliente = $row['ven_cli'];
                $item->monto = $row['ven_mon'];
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
            $query = $this->db->connect()->prepare('SELECT V.ven_ide as id,v_d_ide,v_d_pro,v_d_uni,v_d_can,v_d_tot,
            ven_ser,ven_num,ven_cli,ven_mon
            FROM prueba.venta_detalle D,prueba.venta V
            WHERE D.est_ado = 1 AND (V.ven_ide = D.ven_ide) 
            AND V.ven_ide = :id');
            $query->bindParam('id',$id);
            $query->execute();
            if($query->rowCount()>0){
                while($row = $query->fetch()){
                    $item =  new Ventas();
                    $item->idDetalles = $row['v_d_ide'];
                    $item->producto = $row['v_d_pro'];
                    $item->unidad = $row['v_d_uni'];
                    $item->cantidad = $row['v_d_can'];
                    $item->total = $row['v_d_tot'];
                    $item->id = $row['id'];
                    $item->ser = $row['ven_ser'];
                    $item->num = $row['ven_num'];
                    $item->cliente = $row['ven_cli'];
                    $item->monto = $row['ven_mon'];
                }
                return $item->getArray();  
            }
            return $err->geterror("venta no existe");
        }catch(PDOException $e){
            return $err->geterror("problemas con la conexion al servidor");
        }  
    }


    public function upDate($param){
        $err = new Err;
        try{
            $query = $this->db->connect()->prepare("UPDATE prueba.venta
            SET ven_ser=:ser, ven_num=:num , ven_cli=:cli, ven_mon=:mon
            WHERE ven_ide = :id");
            $query->bindParam('ser',$param['ser']);
            $query->bindParam('num',$param['num']);
            $query->bindParam('cli',$param['cliente']);
            $query->bindParam('mon',$param['total']);
            $query->bindParam('id',$param['id']);
            $query->execute();
            if($query->rowCount()>0){
                if($this->updateDetails($param)){
                    return $err->okey("venta editada exitosamente",$param['id']);
                }else{
                    return $err->geterror("no se pudo crear");
                }
            }
            return $err->geterror("no se pudo guardar");
        }catch(PDOException $e){
            return $err->geterror("problemas con la conexion al servidor");
        }
    }

    private function updateDetails($param){
        try{
            $query = $this->db->connect()->prepare("UPDATE prueba.venta_detalle
            SET
            ven_ide=:idven , v_d_pro=:producto , v_d_uni=:unidad , v_d_can=:cantidad ,  v_d_tot=:total
            WHERE v_d_ide=:idedetalles");
            $query->bindParam('idven',$param['id']);
            $query->bindParam('producto',$param['producto']);
            $query->bindParam('unidad',$param['precio']);
            $query->bindParam('cantidad',$param['cantidad']);
            $query->bindParam('total',$param['total']);
            $query->bindParam('idedetalles',$param['idDetails']);
            $query->execute();
            if($query->rowCount()>0){
                return true;
            }
            return false;
        }catch(PDOException $e){
            return false;
        }
    }
    public function create($param){
        $err = new Err;
        try{
            $query = $this->db->connect()->prepare("INSERT INTO prueba.venta (ven_ser,ven_num,ven_cli,ven_mon)
            VALUES (:ser,:num,:cli,:mon)");
            $query->bindParam('ser',$param['ser']);
            $query->bindParam('num',$param['num']);
            $query->bindParam('cli',$param['cliente']);
            $query->bindParam('mon',$param['total']);
            $query->execute();
            if($query->rowCount()>0){
                $query2 = $this->db->connect()->query("SELECT ven_ide FROM prueba.venta 
                WHERE 
                ven_ser='".$param["ser"]."' AND ven_num='".$param["num"]."' AND ven_cli='".$param["cliente"]."'");
                $idr = $query2->fetch(PDO::FETCH_OBJ)->ven_ide;
                if($this->createDetails($param,$idr)){
                    return $err->okey("venta creada exitosamente",$idr);
                }else{
                    return $err->geterror("no se pudo crear");
                }
            }
            return $err->geterror("no se pudo crear");
        }catch(PDOException $e){
            return $err->geterror("problemas con la conexion al servidor");
        }
    }
    private function createDetails($param,$id){
        try{
            $query = $this->db->connect()->prepare("INSERT INTO prueba.venta_detalle 
            (ven_ide,v_d_pro,v_d_uni,v_d_can,v_d_tot)
            VALUES (:idven,:producto,:unidad,:cantidad,:total)");
            $query->bindParam('idven',$id);
            $query->bindParam('producto',$param['producto']);
            $query->bindParam('unidad',$param['precio']);
            $query->bindParam('cantidad',$param['cantidad']);
            $query->bindParam('total',$param['total']);
            $query->execute();
            if($query->rowCount()>0){
                return true;
            }
            return false;
        }catch(PDOException $e){
            return false;
        }
    }
    public function delete($id){
        $err = new Err;
        try{
            $query = $this->db->connect()->prepare("UPDATE prueba.venta_detalle
            SET
            est_ado=0
            WHERE v_d_ide=:id");
            $query->bindParam('id',$id);
            $query->execute();
            if($query->rowCount()>0){
                return $err->okey("venta eliminada exitosamente");
            }
            return $err->geterror("no se pudo eliminar");
        }catch(PDOException $e){
            return $err->geterror("problemas con la conexion al servidor");
        }
    } 
}
?>