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

