import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Rating,
  CircularProgress,
  Alert,
} from "@mui/material";
import ResenaService from "../../services/ResenaService";

const Resenas = ({ idProducto }) => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idProducto) return;

    const fetchResenas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ResenaService.getResenasPorProducto(idProducto);

        // Ajuste para manejar estructura de datos y campos
        const data = response.data || [];
        const resenasList = Array.isArray(data) ? data : data.resenas || [];

        setResenas(resenasList);
      } catch (err) {
        setError("Error al cargar las reseñas");
      } finally {
        setLoading(false);
      }
    };

    fetchResenas();
  }, [idProducto]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  if (resenas.length === 0)
    return (
      <Box sx={{ p: 2, backgroundColor: "background.paper", borderRadius: 1 }}>
        <Typography variant="h5" gutterBottom>
          Reseñas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No hay reseñas disponibles para este producto.
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 2, backgroundColor: "background.paper", borderRadius: 1 }}>
      <Typography variant="h5" gutterBottom>
        Reseñas ({resenas.length})
      </Typography>

      <List>
        {resenas.map((resena, idx) => (
          <React.Fragment key={resena.id || idx}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>
                  {resena.usuario_nombre?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center">
                    <Typography fontWeight="bold" mr={1}>
                      {resena.usuario_nombre || "Usuario"}
                    </Typography>
                    <Rating
                      value={Number(resena.valoracion) || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(resena.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                    <Typography variant="body1" component="div">
                      {resena.comentario}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {idx < resenas.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Resenas;
