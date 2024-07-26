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
    if(data[0].pfp != null) pfp.src = "/"+data[0].pfp; else pfp.src = "/assets/pfp/1-pfp.png"
    pubs.innerText = `${data[0].publicaciones} recetas`
    if(data.nivel_cocina != null) lvl.innerText += data[0].nivel_cocina; else lvl.innerText += " Desconocido";
    dcp.innerText = data[0].descripcion;
  })

document.addEventListener("DOMContentLoaded", (event) => {
  showUserPosts();
})

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