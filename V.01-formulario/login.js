const form = document.getElementById("login_form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData_ = new FormData(form);
  const data = Object.fromEntries(formData_);

  await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((results) => {
      console.log(results);
      if (results[0][0].Validacion === "Sesion iniciada") {
        window.location.href = "index.html"
        document.cookie = "username = " + data.username;
        document.cookie = "password_ =" + data.password_;
      } else {
        // Codigo para datos erroneos pendiente
      }
    });
});