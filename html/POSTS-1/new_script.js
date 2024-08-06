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

saveBtn.onclick = function(event) {
    var description = document.getElementById("post-description").value;
    if (description) {
        var hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "description";
        hiddenInput.value = description;
        document.getElementById("submit_form").appendChild(hiddenInput);

        publish_post(event);
        // modal.style.display = "none"; 
    } else {
        alert("Por favor, ingrese una descripción.");
    }
}

function publish_post(event) {
    event.preventDefault()
    var description = document.getElementById("post-description").value;
    if (description) {

        let data = new FormData();
        data.append("id_post", id_post);
        data.append("page_title", document.querySelector("input[name='recipe_title']").value);
        data.append("ingredients", (document.getElementById("recipe").querySelector("ul")) ? document.getElementById("recipe").querySelector("ul").innerHTML : "No ingredients");
        data.append("page_content",document.getElementById("recipe").innerHTML);
        data.append("preview", (document.getElementById("recipe").querySelector("img")) ? document.getElementById("recipe").querySelector("img").src : "/assets/pictures/example_pic.jpg");
        data.append("description", description);

        console.log(Object.fromEntries(data));

        let _body = Object.fromEntries(data)

        fetch("http://localhost:3000/post_recipe",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(_body)
        }).then(response => response.json())
        .then(data => {
            if(data.estado == "Publicado!"){
                window.location.href = "publicado.html?id_post="+id_post; 
            }
        })

        /* localStorage.setItem('recipeTitle', document.querySelector("input[name='recipe_title']").value);
        localStorage.setItem('recipeContent', document.getElementById("recipe").innerHTML);
        localStorage.setItem('recipeDescription', description);*/
    } else {
        alert("Por favor, ingrese una descripción.");
    }
};

