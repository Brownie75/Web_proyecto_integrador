
console.log("ENTRE");
document.getElementById("logout_button").addEventListener("click", async () => {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((results) => {
        if (results.message === "Logout successful") {
          //window.location.href = "../html/signup_Majo/index.html";
        } else {
          alert("Error al cerrar sesión");
        }
      });
  });
  