
console.log("entre al perfil");
// Función para obtener el valor de una cookie específica por su nombre
function getCookie(name) {
  let nameEQ = name + "=";
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
