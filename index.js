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
server.use(cors());
//server.use(setUser);

const passwords = ["EseKuEle","gato261261"]

/*const conn = db.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || passwords[0],
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || "db_chefencasa"
});*/

const connPool = db.createPool({
  host                  : process.env.DB_HOST || 'localhost',
  user                  : process.env.DB_USER || 'root',
  password              : process.env.DB_PASSWORD || passwords[0],
  database              : process.env.DB_NAME || 'db_chefencasa',
  waitForConnections    : true,
  connectionLimit       : 3,
  maxIdle               : 3, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout           : 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit            : 0,
  enableKeepAlive       : true,
  keepAliveInitialDelay : 1000,
});

 
/*conn.connect((err) => {
    if(err){
      console.log("Error connecting to database", err);
    } else console.log("Connected to database");
});*/

server.listen(3000, () =>{
    console.log("Server is running on https://web-proyecto-integrador.onrender.com");
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

  connPool.query("SELECT * FROM usuarios", (error, results) => {
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
  connPool.query("SELECT * FROM usuarios WHERE id_user = ?",[id], (error, results) =>{
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
  connPool.query("SELECT * FROM posts WHERE id_post = ?",[id],(error, results) => {
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
  connPool.query("SELECT url FROM posts WHERE id_post = ?",[id_post], (error, results) => {
      const file = fs.readFileSync("./"+results[0].url);

      res.send(file.toString());
  })
})
server.get("/user/:id/posts", (req,res) =>{
  const id = req.params.id;
  connPool.query("SELECT * FROM posts WHERE fk_user = ?",[id],(error, results) => {
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
  connPool.query(`SELECT * FROM images WHERE img_name = '${direc}'`, (error, results) => {
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
  connPool.query(`SELECT * FROM images WHERE id_post = ${id}`,(error, results) => {
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
  connPool.query("SELECT * FROM usuarios WHERE username = ?",[username], (error, results) =>{
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
  const searchTerm = req.query.term.split(" ");

  if(!searchTerm){
    return res.status(400).json({ error: "Search term is required"});
  }
  var searchValue;
  var searchQuery = "";
  var arraylen;

  searchTerm.forEach(term => {
    searchValue = `%${term}%`;
    searchQuery += `(titulo LIKE '${searchValue}' OR contenido LIKE '${searchValue}' OR ingredientes LIKE '${searchValue}') OR `;
    arraylen = searchQuery.length;
  })
  searchQuery = searchQuery.substring(0, arraylen-3);

  const query = "SELECT * FROM posts WHERE "+searchQuery;

  connPool.query(query + "ORDER BY fecha",(error, results) => {
    if (error) {
      console.error("Error executing search query:", error);
      return res.status(500).json({ error: "Internal server error" });
    } else {
      res.send(results);
    }
  })
})

server.post("/recipe", setUser, (req, res) => {
  var id_newpost;
  connPool.getConnection(function (err, conn) {
    // Do something with the connection
    conn.query("START TRANSACTION");
    conn.query("INSERT INTO posts (titulo, ingredientes, contenido, categoria, fk_user) VALUES ('', '', '', '', ?)", [req.user.id_user], (error, results) => {
      if(error) {
        res.status(400).send("Could not make post");
      }
    })
    conn.query("SELECT LAST_INSERT_ID() as newid", (error, results) => {
      if(error) {
        res.status(400).send("Could not make post");
      } else {
        id_newpost = results[0].newid;
        conn.query("COMMIT");
        if (id_newpost != null) res.json({new_post: id_newpost});
      }
    })
    // Don't forget to release the connection when finished!
    pool.releaseConnection(conn);
  });
  
})

server.post("/post_recipe", (req, res) => {
  const {id_post, username, page_title, ingredients, page_content, preview, description} = req.body;
  
  var direc = path.join(__dirname, `html/${id_post}`)
  if(!fs.existsSync(direc)) fs.mkdir(direc, (err) => {
    if(err){
      return console.log(err)
    } else {
      console.log("Directorio creado con exito");
    }
  }); else console.log("Ya existe directorio");
  fs.writeFileSync(direc + '/content.html', page_content, (err) => {
    if(err){
      return console.log(err)
    } else {
      console.log("Archivo creado con exito");
    }
  });

  connPool.query(`UPDATE posts SET titulo = '${page_title}', descripcion = '${description}', ingredientes = '${ingredients}', contenido = '/html/${id_post}/content.html', preview_image = '${preview}', borrador = 1 WHERE id_post = ${id_post}`, (error, results) => {
    if(error){
      console.log("could not publish post");
      res.status(400).send("could not publish post");
    } else {
      console.log('Published!');
      console.log(results)
      res.status(200).send(results);
    }
  })
})

server.post("/register", (req, res) => {
  const {username, password_, correo} = req.body;
  connPool.query(`CALL registro('${username}', '${correo}')`, (error, results) => {
    if (error) {
      console.log("Error inserting data");
    } else {
      if (results[0][0].Validacion_user === 'Registrado!') {
        // Insercion de datos
        connPool.query("INSERT INTO usuarios (username, password_, correo) VALUES ('" 
                    + username + "', '" + password_ + "', '" + correo + "')", (error, results) => {
          if (error) {
            res.status(500).send("Error inserting data");
          } else {
            connPool.query("SELECT LAST_INSERT_ID() as id_newuser", (error, results) => {
              if(error) {
                res.status(500).send("Error inserting data");
              } else {
                try {
                  const token = jwt.sign({ username: username, id_user: results[0].id_newuser }, secret_jwt, { expiresIn: '1h' });
                  res.cookie('access_token', token, {
                      httpOnly: true,
                      secure: false,
                      sameSite: 'lax',
                      maxAge: 3600000, // 1 hora
                      path: '/'
                  });
                  return res.status(200).json({message: "Usuario registrado", token});
                  } catch (tokenError) {
                      console.log("Error al generar el token", tokenError);
                      return res.status(500).send("Error al procesar la solicitud");
                  }
              }
            })
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

  connPool.query("SELECT * FROM usuarios WHERE username = ?", [username], async (error, results) => {
      if (error) {
          console.log("Error al consultar la base de datos", error);
          return res.status(500).send("Error al consultar la base de datos");
      } 
      console.log(results);
      if (results.length > 0) {
          const storedPassword = results[0]['password_'];  // Usar el campo correcto para la contraseña
          if (storedPassword !== password_) {  // Comparar contraseñas en texto plano
              console.log("Contraseña incorrecta");
              return res.status(401).json({ message: "Datos incorrectos" });
          }
          
          try {
              const token = jwt.sign({ username: results[0].username, id_user: results[0].id_user }, secret_jwt, { expiresIn: '1h' });
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

server.get('/user-info', verifyToken, (req, res) => {
  const userId = req.user.username;  // el del usuario desde el token decodificado
  const sql = "SELECT nombre, apellido, correo, telefono, edad, nivel_cocina, descripcion, pfp FROM usuarios WHERE username = ?";
  connPool.query(sql, [userId], (error, results) => {
      if (error) {
          console.error("Error al obtener la información del usuario", error);
          return res.status(500).json({ message: 'Error interno del servidor' });
      }

      if (results.length > 0) {
          const user = results[0];
          res.status(200).json({
              nombre: user.nombre,
              apellido: user.apellido,
              correo: user.correo,
              telefono: user.telefono,
              edad: user.edad,
              nivel_cocina: user.nivel_cocina,
              descripcion: user.descripcion,
              pfp: user.pfp
          });
      } else {
          res.status(404).json({ message: 'Usuario no encontrado' });
      }
  });
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

server.get("/posts/:theme", (req, res) => {
  const theme = req.params.theme;
  var query;
  switch (theme) {
    case "last_week":
      query = "SELECT * FROM posts WHERE fecha BETWEEN date_sub(now(), interval 1 week) and now() LIMIT 3"
      break;
    case "daily":
      query = "SELECT * FROM posts ORDER BY visitas LIMIT 1"
      break;
    case "recent":
      query = "SELECT * FROM posts ORDER BY fecha LIMIT 3"
    default:
      break;
  }
  connPool.query(query, (error, results) => {
    if(error) {
      res.status(500).send("Could not load posts");
    } else {
      res.status(200).send(results);
    }
  })
})



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
  connPool.query("UPDATE usuarios SET pfp = ?, descripcion = ?, nivel_cocina = ? where id_user = ?",
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
  connPool.query("CALL delete_post(?)", [id], (error, results) => {
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
  console.log(username);
  if(username){
      connPool.query("SELECT id_user, username, correo FROM usuarios WHERE username = ?", [username], (error, results) => {
        if(error){
          throw error;
        } else {
          req.user = results[0];
          next();
        }
      }
    )
  } else {
    res.status(401).send("Necesitas iniciar sesión, no se registra usuario")
  }
}