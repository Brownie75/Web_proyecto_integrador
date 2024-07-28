document.addEventListener("DOMContentLoaded", async (event) => {
    try {
      const authResponse = await fetch("http://localhost:3000/autorizacion", {
          method: "GET",
          credentials: 'include',
      });
  
      if (authResponse.ok) {
          const authResult = await authResponse.json();
          const navLoggedInItems = document.querySelectorAll(".nav-logged-in");
          const navLoggedOutItems = document.querySelectorAll(".nav-logged-out");
  
          if (authResult.authenticated) {
              navLoggedInItems.forEach(item => item.style.display = "block");
              navLoggedOutItems.forEach(item => item.style.display = "none");
  
              const userResponse = await fetch("http://localhost:3000/user-info", {
                  method: "GET",
                  credentials: 'include',
              });
  
              if (userResponse.ok) {
                  const userResult = await userResponse.json();
  
                  const userNameElement = document.querySelector('.name_usr');
                  const userLevelElement = document.querySelector('#usr_level');
                  const userPubsElement = document.querySelector('#usr_pubs span');
                  const userRatingElement = document.querySelector('#prom_usr');
                  const userDescElement = document.querySelector('.usr_desc p');
  
                  if (userNameElement) {
                      userNameElement.textContent = `${userResult.nombre} ${userResult.apellido}`;
                  }
                  if (userLevelElement) {
                      userLevelElement.textContent = `Nivel: ${userResult.nivel_cocina}`;
                  }
                  if (userPubsElement) {
                      userPubsElement.textContent = userResult.correo;
                  }
                  if (userRatingElement) {
                      userRatingElement.textContent = "Rating Placeholder";  // Aquí se debería obtener el rating del usuario si está disponible
                  }
                  if (userDescElement) {
                      userDescElement.textContent = userResult.descripcion;
                  }
              } else {
                  console.error("Error al obtener la información del usuario");
              }
          } else {
              navLoggedInItems.forEach(item => item.style.display = "none");
              navLoggedOutItems.forEach(item => item.style.display = "block");
          }
      } else {
          console.error("Error al verificar el estado de autenticación");
      }
    } catch (error) {
      console.error("Se produjo un error al verificar el estado de autenticación:", error);
    }
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
                    window.location.href = 'http://localhost:5501/html/signup_Majo/index.html'; // Asegúrate de que esta URL es la correcta
                } else {
                    console.error('Error al cerrar sesión');
                }
            } catch (error) {
                console.error('Se produjo un error al cerrar sesión:', error);
            }
        });
    }
    showUserPosts();
  });
  
  

function makeEditablePost(){
  
}

function showUserPosts(){
  var user_post = document.getElementById("user_posts");
  fetch(`http://localhost:3000/user/1/posts`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.length > 0){
      data.forEach(element => {
        loadPost(element.titulo, element.fecha, element.vistas, 0, element.categoria, element.preview_image)
      });
    } else {
      user_post.innerHTML = "<h3>Este usuario no tiene recetas :(</h3>"
    }
  }) 
}
function loadPost(d_titulo, d_fecha, d_vistas, d_likes, d_categoria, d_p_img){
  var user_post = document.getElementById("user_posts");

  var post_container = document.createElement("div");
  post_container.className = "post";
  var img_container = document.createElement("div");
  img_container.style = "display: flex; align-items: center";
  var post_img = document.createElement("img");
  post_img.className = "miniatura_post";
  if(d_p_img != null) post_img.src = d_p_img; else post_img.src = "/assets/pictures/example_pic.jpg";
  img_container.appendChild(post_img);
  
  var info_span = document.createElement("div");
  var post_info = document.createElement("div");
  info_span.className = "info_post";
  post_info.style = "display: flex; flex-direction: column;"
  post_info.appendChild(document.createElement("div"));
  
  var title_div = document.createElement("div");
  title_div.style = "display: flex; justify-content: space-around; align-content: center;";
  var titulo = document.createElement("h4");
  titulo.className = "title_post"; titulo.innerText = d_titulo;
  var fecha = document.createElement("span");
  fecha.className = "fecha_post"; fecha.innerText = d_fecha.substring(0,10);
  title_div.appendChild(titulo);
  title_div.appendChild(fecha);
  
  var about_post = document.createElement("ul");
  about_post.className = "about_post";
  var visualizaciones = document.createElement("li");
  visualizaciones.className = "post_info"; visualizaciones.innerText = d_vistas + " visualizaciones";
  var likes = document.createElement("li");
  likes.className = "post_info"; likes.innerText = d_likes + " favoritos";
  var categoria = document.createElement("li");
  categoria.className = "post_info"; categoria.innerText = "Categorias: " + d_categoria

  //APPEND ALL ELEMENTS OH GOD
  about_post.appendChild(visualizaciones); about_post.appendChild(likes);
  about_post.appendChild(categoria);
  post_info.lastElementChild.appendChild(title_div);
  post_info.lastElementChild.appendChild(about_post);
  info_span.appendChild(post_info);

  post_container.appendChild(img_container);
  post_container.appendChild(info_span);

  user_post.appendChild(post_container);
}
