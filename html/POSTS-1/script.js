document.getElementById('add-title').addEventListener('click', function() {
    let title = prompt('Ingrese el título de la receta:');
    if (title) {
        let extra_title = document.createElement("h2");
        extra_title.innerText = title;
        document.getElementById("recipe").appendChild(extra_title);
        //document.getElementById('recipe-title').textContent = title;
    }
});

document.getElementById('add-ingredients').addEventListener('click', function() {
    let ingredient = prompt('Ingrese un ingrediente:');
    if (ingredient) {
        let p = document.createElement('p');
        p.innerHTML = `&#8226; ${ingredient}`;
        document.getElementById('ingredients').appendChild(p);
    }
});

document.getElementById('add-paragraph').addEventListener('click', function() {
    //let paragraph = prompt('Ingrese un párrafo:');
    // if (paragraph) {
        let p = document.createElement('p');
        //p.textContent = paragraph;
        document.getElementById('paragraph-list').appendChild(p);
    //}
});

document.getElementById('add-image').addEventListener('click', function() {
    let imageUrl = prompt('Ingrese la URL de la imagen:');
    if (imageUrl) {
        let img = document.createElement('img');
        img.src = imageUrl;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        document.getElementById('image-container').innerHTML = '';
        document.getElementById('image-container').appendChild(img);
    }
});

document.getElementById('post-recipe').addEventListener('click', function() {
    alert('Receta publicada!');
});
