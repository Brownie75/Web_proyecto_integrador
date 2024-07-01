<?php
    $conn = new mysqli('localhost','root','EseKuEle','db_chefencasa',3306,'C:/xampp/mysql/mysql.sock');

    if($conn->connect_error){
        die(''. $conn->connect_error);
    }
?>