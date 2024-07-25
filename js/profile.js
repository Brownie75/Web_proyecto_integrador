console.log("entre al perfil");

// Ejemplo de uso
//let miCookie = getCookie('username');
//console.log(miCookie); // Imprime 'valorDeMiCookie' si la cookie existe
//document.getElementById("username-id").innerText = miCookie;

/*const pfp = document.querySelector(".usr_img");
const pubs = document.getElementById("usr_pubs")
const lvl = document.getElementById("usr_level")
const dcp = document.querySelector(".usr_desc");
  fetch(`http://localhost:3000/get_user_by_name/${miCookie}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    pfp.src = "/"+data[0].pfp;
    pubs.innerText = `${data[0].publicaciones} recetas`
    lvl.innerText = data[0].nivel_cocina;
    dcp.innerText = data[0].descripcion;
  })*/


//module.exports = getCookie

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.querySelector('.logout');
  
  if (logoutButton) {
      logoutButton.addEventListener('click', async (event) => {
          event.preventDefault();
          try {
              const response = await fetch('http://localhost:3000/logout', {
                  method: 'GET',
                  credentials: 'include',
              });

              if (response.ok) {
                  // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
                  window.location.href = '../html/signup_Majo/index.html'; // Asegúrate de que esta URL es la correcta
              } else {
                  console.error('Error al cerrar sesión');
              }
          } catch (error) {
              console.error('Se produjo un error al cerrar sesión:', error);
          }
      });
  }
});
