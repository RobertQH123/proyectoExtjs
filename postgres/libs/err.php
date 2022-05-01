<?php
class Err{
    function geterror($error = "Problemas del servidor"){
        return ["error"=>$error];
    }
    function okey($status,$id=0){
        return ['ok'=>$status,'id'=>$id];
    }
}
?>