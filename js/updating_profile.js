const edit_form = document.querySelector(".edit_usr");
const file_input = document.getElementById("file_input");

edit_form.addEventListener("submit", (event) => {
    event.preventDefault();

    var form = new FormData();
    form.append('id_post', 'pfp');
    form.append('username', getCookie('username'));
    form.append('pfp', file_input.files[0]);
    form.append('descripcion', edit_form.descripcion.value);
    form.append('u_experiencia', edit_form.u_experiencia.value);

    console.log(Object.fromEntries(form));

    fetch("http://localhost:3000/upt_profile", {
        method: "POST",
        body: form
    }).then(response => response.json());
    
})
