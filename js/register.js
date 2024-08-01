const form = document.getElementById("signup_form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData_ = new FormData(form);
    const data = Object.fromEntries(formData_);

    await fetch("https://web-proyecto-integrador.onrender.com/user",{
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then((results) => {
        console.log(results);
        if(results){
            window.location.href = "profile.html";
            document.cookie = "username = " + data.username;
            document.cookie = "correo ="+data.correo
            document.cookie = "password_ =" + data.password_;
        }
    });
});