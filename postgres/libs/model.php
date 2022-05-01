<?php
require_once '../libs/db.php';
class Model{
    function __construct()
    {
        $this->db = new DB();
    }
}
?>