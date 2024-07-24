const content = document.getElementById("recipe");

document.getElementById("recipe").addEventListener('keypress', (event) => {
    if(KeyboardEvent.key == '13' && KeyboardEvent.shiftKey == false){
        event.preventDefault
    }
})

document.getElementById("add-ingredients").addEventListener("click", () => {
    document.execCommand("insertUnorderedList", false,null);
})

let title = document.getElementById("add-title");
let parap = document.getElementById("add-paragraph");
let image_imput = document.getElementById("insert-img");
/* let vid_input = document.getElementById("vid-label");

vid_input.addEventListener("click", () => {
    document.getElementById("insert-vid").style.display = 'block';
}) */

title.addEventListener("change", () => {

    
    let titulo = document.createElement(title.value);
    titulo.className = "page-title"
    titulo.innerText = "[inserta tu titulo]";
    if (content.lastElementChild) content.removeChild(content.lastElementChild);
    content.appendChild(titulo);
    title.value=""
})

image_imput.addEventListener("change", async (event) => {
    event.preventDefault();
    var form = new FormData();
    form.append('id_post', getCookie("id_post"));
    form.append('image',image_imput.files[0]);
    await fetch("http://localhost:3000/image",{
        method: "PATCH",
        body: form
    }).then(response => response.text())
    .then(data => {
        putting_image(data);
    })
    return false;
})
document.cookie = "id_post = 32; path=/";

function putting_image(url){
    var divs = document.querySelectorAll("#recipe div")
    var last_div = divs[divs.length - 1];
    // console.log(last_div.innerHTML);

    var img = document.createElement("img");
    img.src = "/"+url;
    img.className = "inserted-image";
    if(last_div != null){
        last_div.innerHTML = "";
        last_div.appendChild(img);
    } else {
        var div = document.createElement("div");
        div.appendChild(img);
        content.appendChild(div);
    }
}