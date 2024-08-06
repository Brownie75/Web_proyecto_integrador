document.getElementById("btn_iniciar-sesion").addEventListener("click", iniciarSesion);
document.getElementById("btn_registrarse").addEventListener("click", register);

document.getElementById("btn_principal").addEventListener("click", function() {
    window.location.href = "/index.html"; //CAMBIAR AL LINK DE LA PAGINA PRINCIPAL DE CHEF EN CASA
});

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
            input.style.borderColor = 'red'; 
        } else {
            input.style.borderColor = ''; 
            formData[input.name] = input.value.trim();
        }
    });

    if (!allFilled) {
        alert('Por favor, rellene todos los campos.');
        return false;
    }

    if (formClass === 'formulario-login') {
        loginUser(formData);
    } else if (formClass === 'formulario-registro') {
        registerUser(formData);
    }

    return true;
}

async function loginUser(fdata) {
    try {
        const response = await fetch('https://web-proyecto-integrador.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fdata),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Correo o contraseña incorrectos, intentelo de nuevo");
        }

        const data = await response.json();

        // Esperar 2 segundos antes de redirigir
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 1000);

    } catch (error) {
        console.error("Se produjo un error al iniciar sesión:", error);
        alert(error.message);
    }
}

async function registerUser(fdata) {
    try {
        const response = await fetch('https://web-proyecto-integrador.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fdata)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Error al registrarse");
        }

        const data = await response.json();

        if(data.message === 'Usuario registrado'){
            alert('Registro exitoso');
            setCookie("username", fdata["username"], 1);
            window.location.href = "/html/edit_new_profile.html";
        } else {
            alert('Este usuario ya existe');
        }

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        alert(error.message);
    }
}
