document.addEventListener('DOMContentLoaded', async () => {
    await fetch("http://localhost:3000/check-session", {
      method: 'GET',
      credentials: "include" // Incluye las cookies con la solicitud
    })
    .then((res) => res.json())
    .then((results) => {
      console.log(results);
      if (!results.loggedIn) {
        // Redirigir o mostrar un mensaje si no está logueado
      } else {
        document.getElementById("welcome_message").innerText = `Bienvenido, ${results.username}`;
      }
    });
  });
  

function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }
  
  let sessionCookie = getCookie('connect.sid');
  console.log('Session Cookie:', sessionCookie);
  