import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Rating,
  Typography,
} from "@mui/material";
import ResenaService from "../../services/ResenaService";
import toast from "react-hot-toast";

const CrearResena = ({ productoId, onClose, onResenaCreada }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [comentario, setComentario] = useState("");
  const [valoracion, setValoracion] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("userData");

    if (!userFromStorage) {
      toast.error("Debes iniciar sesión para dejar una reseña");
      onClose();
      return;
    }

    try {
      const parsedUser = JSON.parse(userFromStorage);
      setUserInfo(parsedUser);
    } catch (error) {
      console.error("Error leyendo usuario del localStorage:", error);
      toast.error("Error al verificar la sesión");
      onClose();
    }
  }, [onClose]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!userInfo?.id) {
      toast.error("Sesión no válida. Por favor, vuelve a iniciar sesión");
      return;
    }

    if (!comentario || valoracion < 1 || valoracion > 5) {
      toast.error("Completa el comentario y la valoración (1 a 5)");
      return;
    }

    setLoading(true);

    const data = {
      usuario_id: userInfo.id,
      producto_id: parseInt(productoId),
      comentario,
      valoracion,
    };

    try {
      const response = await ResenaService.create(data);

      if (response.data?.status === "error") {
        toast.error(response.data.message);
      } else {
        toast.success("¡Reseña enviada con éxito!");

        // ✅ Creamos el objeto reseña para actualizar el padre
        const nuevaResena = {
          id: response.data.id || Date.now(), // por si no viene id
          usuario_nombre: userInfo.nombre_usuario || userInfo.correo,
          comentario,
          valoracion,
          fecha: new Date().toISOString(), // usamos fecha actual
        };

        // ✅ Llamamos al padre para actualizar la lista
        if (onResenaCreada) {
          onResenaCreada(nuevaResena);
        }

        handleClose(); // Cerramos el modal
      }
    } catch (error) {
      console.error("Error al enviar reseña:", error);
      toast.error(error.response?.data?.message || "Error al enviar la reseña");
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Reseña</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Usuario"
            value={userInfo.nombre_usuario || userInfo.correo}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <TextField
            label="Comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            sx={{ mb: 2 }}
            variant="outlined"
            placeholder="Escribe tu opinión sobre el producto..."
          />

          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
            <Typography variant="body1">Valoración:</Typography>
            <Rating
              name="valoracion"
              value={valoracion}
              onChange={(event, newValue) => setValoracion(newValue)}
              size="large"
              precision={1}
              required
            />
            <Typography variant="body2">
              {valoracion > 0
                ? `${valoracion} estrella${valoracion !== 1 ? "s" : ""}`
                : "Selecciona una valoración"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ minWidth: 100 }}
          disabled={loading || !comentario || valoracion === 0}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearResena;
