const update_form = document.getElementById("update_form");
const file_input = update_form.pfp

update_form.addEventListener("submit", (event) => {
    event.preventDefault();

    var form = new FormData();
    form.append('username', getCookie("username"));
    form.append('descripcion', update_form.descripcion.value);
    form.append('u_experiencia', update_form.u_experiencia.value);

    console.log(Object.fromEntries(form));

    var imageForm = new FormData();
    imageForm.append('id_post','pfp');
    imageForm.append('username', getCookie("username"));
    imageForm.append('image',file_input.files[0]);

    console.log(Object.fromEntries(imageForm));

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
                window.location.reload();
            }
        });
    })
})