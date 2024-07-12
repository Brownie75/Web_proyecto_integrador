async function login(){

    await fetch("http://localhost:3000/login",{
        method: "POST",
        body: data
    }).then((res) => res.json())
    .then((results) => {
        if(results.Validacion === 'Sesion iniciada'){
            document.cookie = 'username = '+results.username;
            document.cookie = 'password_ ='+results.password_;
        }
    })
    
}