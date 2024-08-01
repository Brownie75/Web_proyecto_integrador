document.addEventListener("DOMContentLoaded", async (event) => {
    try {
      const authResponse = await fetch("https://web-proyecto-integrador.onrender.com/autorizacion", {
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
  
              const userResponse = await fetch("https://web-proyecto-integrador.onrender.com/user-info", {
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
                  const userPfpElement = document.querySelector(".usr_img")

                  userPfpElement.src = (userResult.pfp != "") ? "/"+userResult.pfp : "/assets/pfp/generic-pfp.png"
  
                  if (userNameElement) {
                      userNameElement.textContent = `${userResult.username}`;
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
          fetch("https://web-proyecto-integrador.onrender.com/info-token", {
            method: "GET",
            credentials: 'include'
        }).then(response => response.json())
        .then(data => {
            console.log(data.data);
            showUserPosts(data.data.payload.id_user);
            document.querySelector(".btn_create_post").addEventListener("click", (event) => {
                makeEditablePost(data.data.payload.username)
            })
        })
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
                const response = await fetch('https://web-proyecto-integrador.onrender.com/logout', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
                    window.location.href = 'https://chefsencasa.com/html/signup_Majo/index.html'; // Asegúrate de que esta URL es la correcta
                } else {
                    console.error('Error al cerrar sesión');
                }
            } catch (error) {
                console.error('Se produjo un error al cerrar sesión:', error);
            }
        });
    }
  });
  
document.getElementById("id_pfp").addEventListener("change", (event) => {
    document.querySelector(".add_pic").innerText = "Foto agregada!"
});

function makeEditablePost(username){
  fetch("https://web-proyecto-integrador.onrender.com/recipe",{
    method: "POST",
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "username": username
    })
  }).then(response => response.json())
  .then(data => {
    console.log(data)
    window.location.href = "/html/POSTS-1/posts.html?id_post="+data.new_post
  })
}

function showUserPosts(id){
  var user_post = document.getElementById("user_posts");
  fetch(`https://web-proyecto-integrador.onrender.com/user/${id}/posts`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.length > 0){
      data.forEach(element => {
        loadPost(element.id_post, element.titulo, element.fecha, element.visitas, 0, element.categoria, element.preview_image)
      });
    } else {
      user_post.innerHTML = "<h3>Este usuario no tiene recetas :(</h3>"
    }
  }) 
}
function loadPost(d_id, d_titulo, d_fecha, d_vistas, d_likes, d_categoria, d_p_img){
  var user_post = document.getElementById("user_posts");

  var post_container = document.createElement("div");
  post_container.className = "post";
  var img_container = document.createElement("div");
  img_container.style = "display: flex; align-items: center";
  var img_a = document.createElement("a");
  img_a.href = `/html/template.html?id_post=${d_id}`;
  var post_img = document.createElement("img");
  post_img.className = "miniatura_post";
  if(d_p_img != null && d_p_img != "") post_img.src = d_p_img; else post_img.src = "/assets/pictures/example_pic.jpg";
  img_a.appendChild(post_img);
  img_container.appendChild(img_a);
  
  var info_span = document.createElement("div");
  var post_info = document.createElement("div");
  info_span.className = "info_post";
  post_info.style = "display: flex; flex-direction: column;"
  post_info.appendChild(document.createElement("div"));
  
  var title_div = document.createElement("div");
  title_div.style = "display: flex; justify-content: space-around; align-content: center;";
  var title_a = document.createElement("a");
  title_a.href = `/html/template.html?id_post=${d_id}`
  var titulo = document.createElement("h4");
  titulo.className = "title_post"; titulo.innerText = (d_titulo != "") ? d_titulo : "Receta sin titulo";
  title_a.appendChild(titulo);
  var fecha = document.createElement("span");
  fecha.className = "fecha_post"; fecha.innerText = d_fecha.substring(0,10);
  title_div.appendChild(title_a);
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
