var id = new URLSearchParams(window.location.search);
console.log(id);

loadContent()

function loadContent(){
    fetch("https://web-proyecto-integrador.onrender.com/recipe/"+id.get('id_post'))
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.querySelector(".post_title").innerText = data[0].titulo
        fetch(data[0].contenido)
        .then(response => response.text())
        .then(html => {
            var parser = new DOMParser()
            var doc = parser.parseFromString(html, "text/html");
            console.log(doc);
            document.getElementById("post_content").innerHTML += html;
        })
        .catch(err => console.log("Failed to fetch",err))
    })
    
}