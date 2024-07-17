
console.log("entre al perfil");
// Función para obtener el valor de una cookie específica por su nombre
function getCookie(username) {
  let nameEQ = username + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
// Ejemplo de uso
let miCookie = getCookie('username');
console.log(miCookie); // Imprime 'valorDeMiCookie' si la cookie existe
document.getElementById("username-id").innerText = miCookie;

const pfp = document.querySelector(".usr_img");
const pubs = document.getElementById("usr_pubs")
const lvl = document.getElementById("usr_level")
  fetch(`http://localhost:3000/get_user_by_name/${miCookie}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    pfp.src = "/"+data[0].pfp;
    pubs.innerText = `${data[0].publicaciones} recetas`
    lvl.innerText = data[0].nivel_cocina;
  })

