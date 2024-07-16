const imagen = document.getElementById("file_input");
        
        imagen.addEventListener("change", (event) =>{
            event.preventDefault();
            
            console.log(imagen.files[0]);

            fetch("http://localhost:3000/image",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: imagen.files[0],
                id_post: 1
            }).then(response => {
                console.log(response);
            })
        })