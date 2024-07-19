const img = document.getElementById("test");

async function getImages(){
    await fetch(`http://localhost:3000/post/1/images`)
    .then(response => response.json()).then(data => {

        img.src = "/"+data[0].direc
    });
}
