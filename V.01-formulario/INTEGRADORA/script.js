document.getElementById("btn_iniciar-sesion").addEventListener("click", iniciarSesion);
document.getElementById("btn_registrarse").addEventListener("click", register);

var contenedor_login_register = document.querySelector(".contenedor_login-register");
var formulario_login = document.querySelector(".formulario-login");
var formulario_registro = document.querySelector(".formulario-registro");
var caja_trasera_login = document.querySelector(".caja_trasera-login");
var caja_trasera_register = document.querySelector(".caja_trasera-register");

function iniciarSesion() {
    formulario_registro.style.display = "none";
    contenedor_login_register.style.left = "10px";
    formulario_login.style.display = "block";
    caja_trasera_register.style.opacity = "1";
    caja_trasera_login.style.opacity = "0";
}

function register() {
    formulario_registro.style.display = "block";
    contenedor_login_register.style.left = "410px";
    formulario_login.style.display = "none";
    caja_trasera_register.style.opacity = "0";
    caja_trasera_login.style.opacity = "1";
}

function validateForm(event, formClass) {
    event.preventDefault();
    var form = document.querySelector(`.${formClass}`);
    var inputs = form.querySelectorAll('input');
    var allFilled = true;
    var formData = {};

    inputs.forEach(function(input) {
        if (input.value.trim() === '') {
            allFilled = false;
            input.style.borderColor = 'red'; // Highlight the empty fields
        } else {
            input.style.borderColor = ''; // Reset the border color if filled
            formData[input.name] = input.value.trim();
        }
    });

    if (!allFilled) {
        alert('Por favor, rellene todos los campos.');
        return false;
    }
    
    // Si todos los campos están llenos, puedes enviar el formulario.
    if (formClass === 'formulario-login') {
        loginUser(formData);
    } else if (formClass === 'formulario-registro') {
        registerUser(formData);
    } 

    return true;
}

function loginUser(data) {
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Inicio de sesión exitoso');
        window.location.href = "../index.html"
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al iniciar sesión');
    });
}

function registerUser(data) {
    fetch('http://localhost:3000/user', { //modificar esto
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Registro exitoso');
        window.location.href = "../profile.html";
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al registrarse');
    });
}

