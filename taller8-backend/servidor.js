// Taller 8: CRUD completo + middlewares + express.Router
// Servidor Express configurado con morgan, CORS, router modular y manejadores de error.

const express = require("express");
const cors = require("cors");
// Paso 3: Importar morgan
const morgan = require("morgan");

// Paso 6: Importar el router de publicaciones
const postsRouter = require("./routes/posts");

const app = express();

// Paso 3: Registrar morgan en formato "tiny" (debe ser el primer middleware para registrar todas las peticiones, incluso las que fallen al parsear JSON)
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// Rutas informativas del Taller 6 (permanecen en servidor.js porque no pertenecen al recurso posts)
app.get("/", (req, res) => {
  res.send("¡Hola desde mi primer servidor con Express!");
});

app.get("/saludo/:nombre", (req, res) => {
  res.send(`¡Hola, ${req.params.nombre}!`);
});

// Paso 6: Conectar las rutas del recurso /api/posts mediante express.Router
app.use("/api/posts", postsRouter);

// Paso 4: Middleware con nombre para capturar rutas inexistentes (404)
const endpointDesconocido = (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
};

app.use(endpointDesconocido);

// Paso 5: Middleware para el manejo centralizado de errores (debe tener exactamente 4 parámetros)
const manejadorErrores = (error, req, res, next) => {
  console.error(error.message);

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "El cuerpo de la petición no es un JSON válido"
    });
  }

  res.status(500).json({
    error: "Error interno del servidor"
  });
};

app.use(manejadorErrores);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
