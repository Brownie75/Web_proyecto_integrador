const update_form = document.getElementById("update_form");
const file_input = update_form.pfp

update_form.addEventListener("submit", async (event) => {
    event.preventDefault();

    
    let userResponse = await fetch("http://localhost:3000/info-token", {
        method: "GET",
        credentials: 'include'
    }).then(response => response.json())
    .then(data => data.data.payload)
    
    var user = userResponse.username
    
    var form = new FormData();
    form.append('username', user);
    form.append('descripcion', update_form.descripcion.value);
    form.append('u_experiencia', update_form.u_experiencia.value);
    
    console.log(Object.fromEntries(form));
    var imageForm = new FormData();
    imageForm.append('id_post','pfp');
    imageForm.append('username', user);
    imageForm.append('image',file_input.files[0]);

    console.log(Object.fromEntries(imageForm));

    fetch("http://localhost:3000/image",{
        method: "POST",
        body: imageForm
    })
    .then(response => response.text())
    .then(data => {
        console.log(data)
        form.append('pfp', data);
        data = Object.fromEntries(form)
        fetch("http://localhost:3000/upt_profile", {
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