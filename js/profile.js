console.log("entre al perfil");

// Ejemplo de uso
let miCookie = getCookie('username');
console.log(miCookie); // Imprime 'valorDeMiCookie' si la cookie existe
document.getElementById("username-id").innerText = miCookie;

const pfp = document.querySelector(".usr_img");
const pubs = document.getElementById("usr_pubs")
const lvl = document.getElementById("usr_level")
const dcp = document.querySelector(".usr_desc");
  fetch(`http://localhost:3000/get_user_by_name/${miCookie}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.pfp != null) pfp.src = "/"+data[0].pfp; else pfp.src = "/assets/pfp/1-pfp.png"
    pubs.innerText = `${data[0].publicaciones} recetas`
    if(data.nivel_cocina != null) lvl.innerText += data[0].nivel_cocina; else lvl.innerText += " Desconocido";
    dcp.innerText = data[0].descripcion;
  })

//function