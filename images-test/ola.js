const imagen = document.getElementById("file_input");
        
        imagen.addEventListener("submit", (event) =>{
            event.preventDefault();
            
            console.log(imagen.image.files[0]);

            var form = new FormData();
            form.append('id_post',1);
            form.append('image',imagen.image.files[0])

            fetch("http://localhost:3000/image",{
                method: "POST",
                body: form
            }).then(response => {     
                console.log(response);
            })
        }) 