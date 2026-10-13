// Taller 8: Pasos 7, 8 y 9 completados.
// Funciones para interactuar con la API REST de publicaciones desde el frontend.

export interface Publicacion {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface DatosPublicacion {
  userId: number;
  title: string;
  body: string;
}

// Dirección del backend Express
export const API_URL = "http://localhost:3000";

// Procesa la respuesta de la API controlando status y errores HTTP (response.ok)
const procesarRespuesta = async (response: Response) => {
  if (response.status === 204) {
    return null;
  }
  const texto = await response.text();
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch {
    datos = null;
  }
  if (!response.ok) {
    throw new Error(datos?.error ?? `El servidor respondió con el código ${response.status}`);
  }
  return datos;
};

// Paso 7: GET /api/posts con filtro opcional de usuario mediante query param
export const obtenerPublicaciones = async (userId?: number): Promise<Publicacion[]> => {
  const url = userId !== undefined ? `${API_URL}/api/posts?userId=${userId}` : `${API_URL}/api/posts`;
  const response = await fetch(url);
  return procesarRespuesta(response);
};

// POST /api/posts: Crear publicación
export const crearPublicacion = async (datos: DatosPublicacion): Promise<Publicacion> => {
  const response = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  return procesarRespuesta(response);
};

// Paso 8: PUT /api/posts/:id - Actualizar / reemplazar publicación
export const actualizarPublicacion = async (id: number, datos: DatosPublicacion): Promise<Publicacion> => {
  const response = await fetch(`${API_URL}/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  return procesarRespuesta(response);
};

// Paso 9: DELETE /api/posts/:id - Eliminar publicación
export const eliminarPublicacion = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/posts/${id}`, {
    method: "DELETE"
  });
  await procesarRespuesta(response);
};
