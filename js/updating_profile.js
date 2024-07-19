const edit_form = document.querySelector(".edit_usr");
const file_input = document.getElementById("file_input");

edit_form.addEventListener("submit", (event) => {
    event.preventDefault();

    var form = new FormData();
    form.append("id_post", "pfp");
    form.append("id_user", 1);
    form.append("pfp", file_input.files[0]);
    form.append("descripcion", edit_form.descripcion.value);
    form.append("u_experiencia", edit_form.u_experiencia.value);

    fetch("http://localhost:3000/profile", {
        method: "PUT",
        body: form
    })
    
})
