function login(){
    var correo = document.getElementById("u_mail").inputValue;
    var pass = document.getElementById("u_pswd").inputValue;

    document.cookie("correo=? password=?",[correo,pass]);
}