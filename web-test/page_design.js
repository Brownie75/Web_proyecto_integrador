const content = document.getElementById("post-content");
const chg_cnt = document.querySelector("button");

var example_content;

document.cookie = 'id_post = 32'

const cookie = getCookie("id_post");

fetch(`http://localhost:3000/recipe/${cookie}/content`)
.then(response => response.text())
.then((data) => {
    example_content = data; 
    fillPage(data);
})

function fillPage(cnt){
    content.innerHTML = cnt;
}

