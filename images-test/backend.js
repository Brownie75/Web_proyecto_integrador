const img = document.getElementById("test");
const direct = "1406-pipis"

async function getImages(){
    await fetch(`http://localhost:3000/post/2/images`)
    .then(response => response.json()).then(data => {

        data.forEach(element => {
            console.log(element);
            const el = document.createElement("img");
            el.src = "/"+element.direc;
            document.body.append(el);
        });
        console.log(data);
        //pic.src = `/${data[0].direc}`
        //console.log(pic.src);
    });
}

getImages();