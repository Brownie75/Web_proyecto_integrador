const content = document.getElementById("recipe");

document.getElementById("add-ingredients").addEventListener("click", () => {
    document.execCommand("insertUnorderedList", false, null);
});

let title = document.getElementById("add-title");
let image_input = document.getElementById("insert-img");

title.addEventListener("change", (event) => {
    let titulo = document.createElement(title.value);
    titulo.className = "page-title";
    titulo.innerText = "[inserta tu titulo]";
    if(content.lastElementChild) {
        if(content.lastElementChild.firstChild.tagName === "BR") {
            content.lastElementChild.innerHTML = "";
        }
        content.lastElementChild.appendChild(titulo);
    } else {
        content.appendChild(titulo);
    }
    content.focus();
    title.value = "";
});

image_input.addEventListener("change", async (event) => {
    event.preventDefault();
    var form = new FormData();
    form.append('id_post', getCookie("id_post"));
    form.append('image', image_input.files[0]);
    await fetch("http://localhost:3000/image", {
        method: "POST",
        body: form
    }).then(response => response.text())
      .then(data => {
        putting_image(data);
    });
    return false;
});

var id_post = new URLSearchParams(window.location.search).get("id_post")
document.cookie = `id_post=`+id_post+`; path=/`;
document.cookie = `username=`+getCookie("username")+`; path=/`;

function putting_image(url) {
    var divs = document.querySelectorAll("#recipe div");
    var last_div = divs[divs.length - 1];

    var img = document.createElement("img");
    img.src = "/" + url;
    img.className = "inserted-image";
    if(last_div != null) {
        last_div.innerHTML = "";
        last_div.appendChild(img);
    } else {
        var div = document.createElement("div");
        div.appendChild(img);
        content.appendChild(div);
    }
}

function publish_post() {
    var submit_content = document.getElementById("submit_form");
    var prev_img = (content.querySelector("img")) ? content.querySelector("img").src : "";
    var ingredients = (content.querySelector("ul")) ? content.querySelector("ul").innerHTML.trim() : "";
    var hiddenInput = submit_content.querySelector("input[name='description']").value;

    var formData = {
        id_post: getCookie('id_post'),
        username: getCookie('username'),
        page_title: submit_content.recipe_title.value,
        ingredients: ingredients,
        page_content: content.innerHTML.trim(),
        preview: prev_img,
        description: hiddenInput
    };

    fetch("http://localhost:3000/post_recipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then(response => response.json())
      .then(data => {
        console.log(data)
        if (data) {
            alert('Receta publicada!');
            window.location.href = "/html/page_view_test/post_view_temp.html?id_post="+getCookie('id_post');
        } else {
            alert('Hubo un error al publicar la receta.');
        }
    });
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
    if (event.target === modal) {
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
        modal.style.display = "none"; 
    } else {
        alert("Por favor, ingrese una descripción.");
    }
}
