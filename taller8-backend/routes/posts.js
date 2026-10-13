const express = require("express");

const router = express.Router();

// Arreglo de publicaciones en memoria (trasladado desde servidor.js - Paso 6)
let posts = [
  {
    userId: 1,
    id: 1,
    title: "Bienvenidos al Taller 8",
    body: "En este taller completaremos las operaciones CRUD de nuestra API y construiremos una aplicación con Ionic que las utilice."
  },
  {
    userId: 1,
    id: 2,
    title: "¿Qué es un backend?",
    body: "Es la parte de la aplicación que se ejecuta en el servidor y responde a las peticiones de los clientes."
  },
  {
    userId: 2,
    id: 3,
    title: "Métodos HTTP",
    body: "GET permite obtener datos, POST crear, PUT actualizar y DELETE eliminar."
  },
  {
    userId: 2,
    id: 4,
    title: "Formato JSON",
    body: "Los clientes y el servidor se comunican enviando y recibiendo datos en formato JSON."
  },
  {
    userId: 3,
    id: 5,
    title: "Postman",
    body: "Postman es una herramienta que permite enviar peticiones HTTP y revisar las respuestas del servidor."
  }
];

// GET /api/posts - Obtener todas las publicaciones (opcionalmente filtradas por userId)
router.get("/", (req, res) => {
  const { userId } = req.query;

  if (userId !== undefined) {
    const publicacionesFiltradas = posts.filter(
      (p) => p.userId === Number(userId)
    );
    return res.json(publicacionesFiltradas);
  }

  res.json(posts);
});

// GET /api/posts/:id - Obtener una publicación específica por su ID
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: "Publicación no encontrada" });
  }

  res.json(post);
});

// POST /api/posts - Crear una nueva publicación
router.post("/", (req, res) => {
  const datos = req.body;

  if (!datos || !datos.title || !datos.body) {
    return res.status(400).json({ error: "Debes enviar title y body" });
  }

  const nuevoPost = {
    userId: datos.userId || 1,
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    title: datos.title,
    body: datos.body
  };

  posts.push(nuevoPost);
  res.status(201).json(nuevoPost);
});

// Paso 1: DELETE /api/posts/:id - Eliminar una publicación
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existe = posts.some((p) => p.id === id);

  if (!existe) {
    return res.status(404).json({ error: "Publicación no encontrada" });
  }

  posts = posts.filter((p) => p.id !== id);
  res.status(204).end();
});

// Paso 2: PUT /api/posts/:id - Actualizar (reemplazar) una publicación completa
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: "Publicación no encontrada" });
  }

  const datos = req.body;
  if (!datos || !datos.title || !datos.body) {
    return res.status(400).json({ error: "Debes enviar title y body" });
  }

  const postActualizado = {
    userId: datos.userId || post.userId,
    id: post.id,
    title: datos.title,
    body: datos.body
  };

  posts = posts.map((p) => (p.id === id ? postActualizado : p));
  res.json(postActualizado);
});

// Desafío 1: PATCH /api/posts/:id - Actualización parcial de una publicación
// A diferencia de PUT (que reemplaza el recurso entero requiriendo title y body),
// PATCH modifica solo los campos presentes en el cuerpo, conservando los demás intactos.
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: "Publicación no encontrada" });
  }

  const datos = req.body;
  if (
    !datos ||
    (datos.title === undefined &&
      datos.body === undefined &&
      datos.userId === undefined)
  ) {
    return res
      .status(400)
      .json({ error: "Debes enviar al menos un campo a modificar" });
  }

  const postParcial = {
    ...post,
    ...(datos.title !== undefined && { title: datos.title }),
    ...(datos.body !== undefined && { body: datos.body }),
    ...(datos.userId !== undefined && { userId: datos.userId })
  };

  posts = posts.map((p) => (p.id === id ? postParcial : p));
  res.json(postParcial);
});

module.exports = router;
