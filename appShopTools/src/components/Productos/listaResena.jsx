import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Container,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import ResenaService from "../../services/ResenaService";

// URL base para subir imágenes si se necesitara en el futuro
const urlBase = import.meta.env.VITE_BASE_URL.replace(/\/$/, "") + "/uploads";

const ListaResenas = () => {
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ratingPromedio, setRatingPromedio] = useState(0);
  const [totalResenas, setTotalResenas] = useState(0);

  useEffect(() => {
    const fetchResenas = async () => {
      try {
        const response = await ResenaService.getResenas();
        const resenasData = response.data || [];
        setResenas(resenasData);

        // Calcular rating promedio
        if (resenasData.length > 0) {
          const sumaRatings = resenasData.reduce((acc, resena) => {
            return acc + parseFloat(resena.valoracion);
          }, 0);
          setRatingPromedio(sumaRatings / resenasData.length);
          setTotalResenas(resenasData.length);
        }
      } catch (error) {
        console.error("Error al cargar reseñas:", error);
        setError("Error al cargar las reseñas. Intente nuevamente más tarde.");
      } finally {
        setCargando(false);
      }
    };

    fetchResenas();
  }, []);

  if (cargando) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  if (resenas.length === 0) {
    return (
      <Typography variant="body1" align="center" mt={4}>
        No hay reseñas disponibles.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Encabezado con rating promedio */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reseñas de clientes a nuestros productos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          Lee las reseñas de otros clientes que han comprado este producto.
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Typography variant="h3" component="div" fontWeight="bold">
            {ratingPromedio.toFixed(1)}
          </Typography>
          <Rating
            value={ratingPromedio}
            readOnly
            precision={0.1}
            size="large"
            sx={{ my: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {totalResenas} reviews
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
      </Box>

      {/* Lista de reseñas */}
      <Box>
        {resenas
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .map((resena) => {
            const valoracion = parseFloat(resena.valoracion);
            const fechaFormateada = new Date(resena.fecha).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }
            );

            return (
              <Box
                key={resena.id}
                mb={4}
                pb={3}
                sx={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}
              >
                {/* Encabezado de la reseña */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: deepPurple[500],
                        mr: 2,
                        fontWeight: "bold",
                      }}
                    >
                      {resena.usuario_nombre?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {resena.usuario_nombre || "Usuario"}
                    </Typography>
                  </Box>
                  {/* Fecha */}
                  <Typography variant="body2" color="text.secondary">
                    {fechaFormateada}
                  </Typography>
                </Box>

                {/* Contenido principal: Comentario + Rating a la izquierda y imagen a la derecha */}
                <Box display="flex" alignItems="flex-start" gap={2}>
                  {/* Texto */}
                  <Box flex={1}>
                    <Rating
                      value={valoracion}
                      readOnly
                      precision={0.5}
                      sx={{ mb: 1.5 }}
                    />
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {resena.comentario || "Sin comentario."}
                    </Typography>
                  </Box>

                  {/* Imagen (si existe) */}
                  {resena.imagen && (
                    <Box
                      sx={{
                        width: 150,
                        height: 100,
                        overflow: "hidden",
                        borderRadius: 2,
                        boxShadow: 1,
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={`${urlBase}/${resena.imagen}`}
                        alt={resena.producto_nombre || "Producto"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Info adicional */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Chip
                    label={`Product: ${resena.producto_nombre || "Unknown"}`}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: "uppercase" }}
                  />

                  {resena.moderado === "1" && (
                    <Chip label="Moderated" size="small" color="warning" />
                  )}
                </Box>
              </Box>
            );
          })}
      </Box>
    </Container>
  );
};

export default ListaResenas;
