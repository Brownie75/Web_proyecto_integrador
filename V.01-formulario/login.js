function login(){

    const data = document.getElementById("login_form");

    const formData = JSON.stringify(data);
    console.log(formData);

    data.addEventListener("submit", async ()=>{
        await fetch("http://localhost:3000/login",{
            method: "POST",
            body: formData
        }).then((res) => res.json())
        .then((results) => {
            console.log(results);
            if(results.Validacion === 'Sesion iniciada'){
                document.cookie = 'username = '+results.username;
                document.cookie = 'password_ ='+results.password_;
            }
        })
    })

    
}