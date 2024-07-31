const edit_form = document.getElementById("edit_user");
const file_input = document.getElementById("file_input");

edit_form.addEventListener("submit", (event) => {
    event.preventDefault();

    var form = new FormData();
    form.append('username', getCookie("username"));
    form.append('descripcion', edit_form.descripcion.value);
    form.append('u_experiencia', edit_form.u_experiencia.value);

    var imageForm = new FormData();
    imageForm.append('id_post','pfp');
    imageForm.append('username', getCookie("username"));
    imageForm.append('image',edit_form.image.files[0]);

    fetch("https://web-proyecto-integrador.onrender.com/image",{
        method: "POST",
        body: imageForm
    })
    .then(response => response.text())
    .then(data => {
        console.log(data)
        form.append('pfp', data);
        data = Object.fromEntries(form)
        fetch("https://web-proyecto-integrador.onrender.com/upt_profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.text())
        .then(data => {
            console.log(data);
            if(data == 'data updated successfully'){
                alert("Informacion actualizada");
                window.location.href = "/html/profile.html"
            }
        });
    })
})
