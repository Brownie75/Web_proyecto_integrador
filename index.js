const express = require("express");
const db = require("mysql2");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const secret_jwt = "esta-es-la-clave-secreta"

const multer = require('multer');
const fs = require("fs");
//const { id } = require("choco");
// const {authUser, authDeletePost} = require("./js/auth.js")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //Verifica si el directorio del post existe, sino lo crea
    direc_path = path.join(__dirname, 'assets/'+req.body.id_post)

    if(!fs.existsSync(direc_path)) {

      fs.mkdir((direc_path), (err) => {
        if(err){
          return console.log(err)
        } else {
          console.log("Directorio creado con exito");
        }
      })
    } else console.log("directory already exists")
    cb(null, 'assets/'+req.body.id_post+"/");
  },
  filename: (req, file, cb) => {
    if(req.body.username == undefined){
      cb(null, req.body.id_post + '-' + Date.now() + path.extname(file.originalname))
    } else {
      cb(null, req.body.id_post + '-' + req.body.username + path.extname(file.originalname));
    }
  }
});

const upload = multer({ storage: storage });
server.use(cookieParser());


server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(cors({
  origin: 'http://localhost:5501', 
  credentials: true 
}));
server.use(setUser);

const passwords = ["EseKuEle","gato261261"]

const conn = db.createConnection({
    host: "localhost",
    user: "root",
    password: passwords[1],
    port: 3306,
    database: "db_chefencasa"
});
const ola = "ola";
conn.connect((err) => {
    if(err){
      console.log("Error connecting to database", err);
    } else console.log("Connected to database");
  });
server.listen(3000, () =>{
    console.log("Server is running on http://localhost:3000");
});

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
      return res.status(403).send('Acceso no autorizado');
  }
  try {
      const data = jwt.verify(token, secret_jwt);
      req.user = data;
      next();
  } catch (error) {
      return res.status(401).send('Acceso no autorizado');
  }
};

// API (Pendiente de cambiar a otro archivo)

server.get("/", (req,res) => {
  console.log("GET /");
  console.log(req.body);
  res.send("Bienvenido a Chef en Casa");
})

server.get("/user", (req, res) => {
  conn.query("SELECT * FROM usuarios", (error, results) => {
      if(error){
          console.log("Error fetching data",error);
          res.send("Error fetching data",500);
        } else {
          console.log("Data fetched succesfully");
          res.send(results);
        }
  });
})
server.get("/user/:id", (req, res) =>{
  const id = req.params.id;
  conn.query("SELECT * FROM usuarios WHERE id_user = ?",[id], (error, results) =>{
  if(error){
    console.log("Error fetching data", error);
    res.send("Error fetching data", 500);
  } else {
    console.log("data fetch successfully");
    res.send(results);
  }
});
})
server.get("/recipe/:id", (req, res) => {
  const id = req.params.id;
  conn.query("SELECT * FROM posts WHERE id_post = ?",[id],(error, results) => {
      if(error){
          console.log("Error fetching data", error);
          res.send("Error fetching data", 500);
        } else {
          console.log("data fetch successfully");
          res.send(results);
        }
  });
})
server.get("/recipe/:id/content", (req, res) => {
  const id_post = req.params.id;
  conn.query("SELECT url FROM posts WHERE id_post = ?",[id_post], (error, results) => {
      const file = fs.readFileSync("./"+results[0].url);

      res.send(file.toString());
  })
})
server.get("/user/:id/posts", (req,res) =>{
  const id = req.params.id;
  conn.query("SELECT * FROM posts WHERE fk_user = ?",[id],(error, results) => {
      if(error){
          console.log("Error fetching data", error);
          res.send("Error fetching data", 500);
        } else {
          console.log("data fetch successfully");
          res.send(results);
        }
  });
})

server.get("/image/:img_name", (req,res) =>{
  const direc = req.params.img_name;
  conn.query(`SELECT * FROM images WHERE img_name = '${direc}'`, (error, results) => {
    if(error){
      console.log("Error fetching image");
      res.status(400);
    } else {
      console.log(results);
      res.send(results);
    }
  })
})
server.get("/recipe/:id/images",(req,res) =>{
  id = req.params.id;
  conn.query(`SELECT * FROM images WHERE id_post = ${id}`,(error, results) => {
    if(error){
      console.log("Error fetching images");
      res.status(400);
    } else {
      console.log(results);
      res.send(results);
    }
  })
})

server.get("/get_user_by_name/:username", (req, res) =>{
  const username = req.params.username;
  conn.query("SELECT * FROM usuarios WHERE username = ?",[username], (error, results) =>{
  if(error){
    console.log("Error fetching data", error);
    res.send("Error fetching data", 500);
  } else {
    console.log("data fetch successfully");
    res.send(results);
  }
});
})

// Motor de busqueda
server.get("/search", (req,res) => {
  console.log(req.query.term);
  const searchTerm = req.query.term;

  if(!searchTerm){
    return res.status(400).json({ error: "Search term is required"});
  }

  const searchValue = "%"+searchTerm+"%";

  conn.query("SELECT * FROM posts WHERE titulo LIKE ? OR contenido LIKE ?",[searchValue,searchValue],(error, results) => {
    if (error) {
      console.error("Error executing search query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log(results);
    res.send(results);
  })
})

server.post("/register", (req, res) => {
  const {username, password_, correo} = req.body;
  conn.query(`CALL registro('${username}', '${correo}')`, (error, results) => {
    if (error) {
      console.log("Error inserting data");
    } else {
      if (results[0][0].Validacion_user === 'Registrado!') {
        // Insercion de datos
        conn.query("INSERT INTO usuarios (username, password_, correo) VALUES ('" 
                    + username + "', '" + password_ + "', '" + correo + "')", (error, results) => {
          if (error) {
            res.send("Error inserting data", 500);
          } else {
            res.send(JSON.stringify('Usuario registrado'));
          }
        });
    } else {
      res.send(JSON.stringify('Este usuario ya existe'));
    }
  }
})
}); 

server.post("/login", (req, res) => {
  const { username, password_ } = req.body;

  if (!username || !password_) {
      console.log("Username y contraseña son requeridos");
      return res.status(400).send("Username y contraseña son requeridos");
  }

  conn.query("SELECT * FROM usuarios WHERE username = ?", [username], async (error, results) => {
      if (error) {
          console.log("Error al consultar la base de datos", error);
          return res.status(500).send("Error al consultar la base de datos");
      } 
      
      if (results.length > 0) {
          const storedPassword = results[0]['password_'];  // Usar el campo correcto para la contraseña
          if (storedPassword !== password_) {  // Comparar contraseñas en texto plano
              console.log("Contraseña incorrecta");
              return res.status(401).json({ message: "Datos incorrectos" });
          }
          
          try {
              const token = jwt.sign({ username: results[0].username }, secret_jwt, { expiresIn: '1h' });
              res.cookie('access_token', token, {
                  httpOnly: true,
                  secure: false,
                  sameSite: 'lax',
                  maxAge: 3600000, // 1 hora
                  path: '/'
              });
              return res.status(200).json({ message: "Inicio de sesión exitoso", token });
          } catch (tokenError) {
              console.log("Error al generar el token", tokenError);
              return res.status(500).send("Error al procesar la solicitud");
          }
      } else {
          return res.status(401).json({ message: "Datos incorrectos" });
      }
  });
});


server.get('/autorizacion', (req, res) => {
  const token = req.cookies.access_token;

  if (token) {
      jwt.verify(token, secret_jwt, (err, decoded) => {
          if (err) {
              return res.status(401).json({ authenticated: false });
          }
          // Aquí puedes realizar comprobaciones adicionales si es necesario
          return res.status(200).json({ authenticated: true });
      });
  } else {
      return res.status(401).json({ authenticated: false });
  }
});


server.get('/info-token', (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
      return res.status(403).json({ message: 'No token provided' });
  }

  try {
      // Decodificar el token sin verificar su validez
      const decoded = jwt.decode(token, { complete: true });

      if (decoded) {
          // Información del token
          return res.status(200).json({ message: 'Token decoded successfully', data: decoded });
      } else {
          return res.status(401).json({ message: 'Invalid token' });
      }
  } catch (error) {
      return res.status(500).json({ message: 'Error decoding token', error: error.message });
  }
});

server.get('/logout', (req, res) => {
  res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/'
  });
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
});



server.post("/image", upload.single('image'), (req,res) => {
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).send('No file uploaded.');
    
  }
  const direc = req.file.path
  res.send(direc);
});

server.post("/upt_profile", setUser, (req, res) => {
  const {descripcion, u_experiencia, pfp} = req.body;
  console.log(req.body, req.user);
  conn.query("UPDATE usuarios SET pfp = ?, descripcion = ?, nivel_cocina = ? where id_user = ?",
    [pfp, descripcion, u_experiencia, req.user.id_user], (error, results) => {
      if(error){
        console.log("Error updating data", error);
        res.send("Error updating data", 500);
      } else {
        console.log("data updated successfully");
        res.send("data updated successfully");
      }
    }
  )
})

server.delete("/recipe/:id", (req, res) => {
  const id = req.params.id;
  conn.query("CALL delete_post(?)", [id], (error, results) => {
    if (error){
      console.log("Error deleting data");
      res.send("Error deleting data");
    } else {
      res.send(results);
    }
  })
})

// set user
function setUser(req, res, next){
  const username = req.body.username;
  if(username){
      conn.query("SELECT id_user, username, correo FROM usuarios WHERE username = ?", [username], (error, results) => {
        if(error){
          throw error;
        } else {
          req.user = results[0];
          next();
        }
      }
    )
  } else {
    next();
  }
}