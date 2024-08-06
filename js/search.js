const term = getSearchTerm();
document.querySelector(".search_bar").value = term.get('term');
function getSearchTerm(){
    var searchTerm = new URLSearchParams(window.location.search);
    return searchTerm
}
document.addEventListener("DOMContentLoaded", (event) => {
    fetch("https://web-proyecto-integrador.onrender.com/search?"+term)
    .then(response => response.json())
    .then(data => {
        if(data.length > 0){
            data.forEach(element => {
                loadSearchResult(element);
            })
        } else {
            document.querySelector(".resultados_busqueda").innerHTML = 
            "<h2 style='text-align: center;'>No se encontraron resultados de busqueda :(</h2>"+
            "<p style='text-align: center;'>Intenta buscando con otras palabras</p>"
        }
    })
})
function loadSearchResult(array){
    let img_div = document.createElement("div");
    img_div.className = "img";
    let info_span = document.createElement("span");
    let rating_span = document.createElement("span");

    let redirect_img = document.createElement("a");
    redirect_img.href = "/html/POSTS-1/publicado.html?id_post="+array.id_post;
    let img_busqueda = document.createElement("img");
    img_busqueda.className = "img_busqueda";
    if(array.preview_image != null) img_busqueda.src = array.preview_image; 
    else img_busqueda.src = "/assets/pictures/example_pic.jpg"
    redirect_img.appendChild(img_busqueda);
    img_div.appendChild(redirect_img);
    
    let redirect_title = document.createElement("a");
    redirect_title.href = "/html/POSTS-1/publicado.html?id_post="+array.id_post;
    let info_busqueda = document.createElement("div");
    info_busqueda.className = "info_busqueda";
    let titulo_busqueda = document.createElement("h3");
    titulo_busqueda.className = "titulo_busqueda";
    titulo_busqueda.innerText = array.titulo;
    let desc = document.createElement("desc");
    desc.className = "desc";
    let desc_search = document.createElement("p");
    desc_search.className = "desc_search"
    desc_search.innerText = (array.descripcion) ? array.descripcion : "Sin descripción";
    desc.appendChild(desc_search);
    redirect_title.appendChild(titulo_busqueda)
    info_busqueda.appendChild(redirect_title);
    info_busqueda.appendChild(desc);
    info_span.appendChild(info_busqueda);

    let search_rating = document.createElement("div");
    search_rating.className = "search_rating";
    let star_search = document.createElement("img");
    star_search.src = "/assets/pictures/favorito (1).png";
    star_search.className = "star_search";
    let number = document.createElement("h3");
    number.innerText = array.rating;
    search_rating.appendChild(star_search);
    search_rating.appendChild(number);
    rating_span.appendChild(search_rating);

    let result_div = document.createElement("div");
    result_div.className = "receta_busqueda";
    result_div.appendChild(img_div);
    result_div.appendChild(info_span);
    result_div.appendChild(rating_span);
    document.querySelector(".resultados_busqueda").appendChild(result_div);
}