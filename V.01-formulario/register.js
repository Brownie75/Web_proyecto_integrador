const { readSync } = require("fs");

async function register(){

    await fetch("http://localhost:3000/user",{
        method: "POST"
    })

}