const content = document.getElementById("recipe");

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

title.addEventListener("change", (event) => {
    let titulo = document.createElement(title.value);
    titulo.className = "page-title"
    titulo.innerText = "[inserta tu titulo]";
    if(content.lastElementChild) {
        console.log(content.lastElementChild.firstChild.tagName)
        if(content.lastElementChild.firstChild.tagName == "BR") {
            content.lastElementChild.innerHTML = "";
        }
        content.lastElementChild.appendChild(titulo);
    } else {
        content.appendChild(titulo);
    }
    content.focus();
    title.value="";
})

image_imput.addEventListener("change", async (event) => {
    event.preventDefault();
    var form = new FormData();
    form.append('id_post', getCookie("id_post"));
    form.append('image',image_imput.files[0]);
    await fetch("http://localhost:3000/image",{
        method: "POST",
        body: form
    }).then(response => response.text())
    .then(data => {
        putting_image(data);
    })
    return false;
})
document.cookie = "id_post = 32; path=/";
document.cookie = "username = jdoe; path=/";

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

function publish_post(){
    //event.preventDefault();
    var submit_content = document.getElementById("submit_form");
    var prev_img = (content.querySelector("img")) ? content.querySelector("img").src : "";
    var ingredients = (content.querySelector("ul")) ? content.querySelector("ul").innerHTML.trim() : "";
    var hiddenInput = submit_content.description.value

    var formData = new FormData();
    formData.append('id_post', getCookie('id_post'));
    formData.append('username', getCookie('username'));
    formData.append('page_title', submit_content.recipe_title.value);
    if(ingredients) formData.append('ingredients',ingredients);
    formData.append('page_content', content.innerHTML.trim());
    formData.append('preview',prev_img);
    formData.append('description', hiddenInput);

    console.log(Object.fromEntries(formData));
    fetch("http://localhost:3000/post_recipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
}

// DESCRIPCIÓN DE LA RECETA
var modal = document.getElementById("descriptionModal");
var btn = document.getElementById("post-recipe");
var span = document.getElementsByClassName("close")[0];
var saveBtn = document.getElementById("save-description");

btn.onclick = function(event) {
    event.preventDefault(); 
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

saveBtn.onclick = function() {
    var description = document.getElementById("post-description").value;
    if (description) {
        var hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "description";
        hiddenInput.value = description;
        document.getElementById("submit_form").appendChild(hiddenInput);

        publish_post();
    } else {
        alert("Por favor, ingrese una descripción.");
    }
}
