<?php
    include 'db_connection.php';

    if($_SERVER['REQUEST_METHOD'] == "POST"){
        $user = $_POST["u_name"];
        $correo = $_POST["u_mail"];
        $password = $_POST["pass"];
        $registro = $conn->query("CALL registro('$user','$correo')");
    
        if($registro->num_rows > 0){
            $row = $registro->fetch_assoc();
            echo $row["Validacion_user"];
            if($row["Validacion_user"] == "Registrado!"){
                @mysqli_next_result($conn);
                $sql = $conn->query("INSERT INTO usuarios(username, password_, correo) values 
                ('$user','$password','$correo')");
                echo "Usuario registrado";
            }
        }
    }
    header('Location: profile.php');

?>