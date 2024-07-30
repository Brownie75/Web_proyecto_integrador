var gallery_recipe = document.querySelector(".galeria .receta")
var random_post = document.querySelector(".random_recipes .post")
var galeria = document.getElementsByClassName("galeria")[0];
var random_recipes = document.getElementsByClassName("random_recipes")[0];

    fetch("http://localhost:3000/posts/recent")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(element => {
            loadThumbnail(element)
        });
    }) 
    fetch("http://localhost:3000/posts/daily")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(element => {
            loadLongPost(element);
        })
    })

function loadThumbnail(element){
    var clon = gallery_recipe.cloneNode(true);
    galeria.appendChild(clon);

    //MODIFYING VALUES
    var nodos = document.querySelectorAll(".galeria .receta");
    var ultimo_nodo = nodos[nodos.length - 1];
    ultimo_nodo.style.display = "block";
    if(element.preview_image)ultimo_nodo.querySelector("img").src = element.preview_image;
    ultimo_nodo.querySelector(".titulo").innerText = element.titulo;
    ultimo_nodo.querySelector("#i_red").href = "/html/template.html?id_post="+element.id_post;
    ultimo_nodo.querySelector("#t_red").href = "/html/template.html?id_post="+element.id_post;
    ultimo_nodo.querySelector(".rating .rating_num").innerText = element.rating;
}

function loadLongPost(element){
    var clon = random_post.cloneNode(true);
    random_recipes.appendChild(clon);

    var nodos = document.querySelectorAll(".random_recipes .post");
    var ultimo_nodo = nodos[nodos.length - 1];
    ultimo_nodo.style.display = "block";
    if(element.preview_image) ultimo_nodo.querySelector("img").src = element.preview_image;
    ultimo_nodo.querySelector(".fecha_post").innerText = element.fecha;
    ultimo_nodo.querySelectorAll(".about_post .post_info")[0].innerText = element.visitas + " visualizaciones";
    ultimo_nodo.querySelectorAll(".about_post .post_info")[1].innerText = "???" + " favoritos";
    ultimo_nodo.querySelectorAll(".about_post .post_info")[2].innerText = "Categoria: ???";
    ultimo_nodo.querySelector("a").href = "/html/template.html?id_post="+element.id_post
}