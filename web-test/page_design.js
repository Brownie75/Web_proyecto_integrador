
const content = document.getElementById("post-content");

var example_content;

fetch("http://localhost:3000/recipe/32/content")
.then(response => response.text())
.then((data) => {
    example_content = data; 
    fillPage(data);
})

function fillPage(cnt){
    content.innerHTML = cnt;
}

