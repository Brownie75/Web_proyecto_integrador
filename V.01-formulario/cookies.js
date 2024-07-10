function login(){
    var correo = document.getElementById("u_mail").value;
    var pass = document.getElementById("u_pswd").value;

    document.cookie = "correo ="+correo;
    document.cookie = "password_ ="+pass;
}