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
import { useTranslation } from "react-i18next";
const CrearResena = ({ productoId, onClose, onResenaCreada }) => {
  
   const { t } = useTranslation("crearResena");
  const [userInfo, setUserInfo] = useState(null);
  const [comentario, setComentario] = useState("");
  const [valoracion, setValoracion] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("userData");

    if (!userFromStorage) {
      toast.error(t("crearResena.messages.debeIniciarSesion"));
      onClose();
      return;
    }

    try {
      const parsedUser = JSON.parse(userFromStorage);
      setUserInfo(parsedUser);
    } catch (error) {
      console.error("Error leyendo usuario del localStorage:", error);
      toast.error(t("crearResena.messages.errorSesion"));
      onClose();
    }
  }, [onClose]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!userInfo?.id) {
      toast.error(t("crearResena.messages.sesionNoValida"));
      return;
    }

    if (!comentario || valoracion < 1 || valoracion > 5) {
      toast.error(t("crearResena.messages.completaCampos"));
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
        toast.success(t("crearResena.messages.exito"));

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
      toast.error(error.response?.data?.message || t("crearResena.messages.errorEnvio"));
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("crearResena.title")}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label={t("crearResena.fields.usuario")}
            value={userInfo.nombre_usuario || userInfo.correo}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <TextField
            label={t("crearResena.fields.comentario")}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            multiline
            rows={4}
            fullWidth
            required
            sx={{ mb: 2 }}
            variant="outlined"
            placeholder={t("crearResena.fields.comentarioPlaceholder")}
          />

          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
            <Typography variant="body1">{t("crearResena.fields.valoracion")}</Typography>
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
                : t("crearResena.fields.valoracionSeleccionar")}
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
          {t("crearResena.buttons.cancelar")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ minWidth: 100 }}
          disabled={loading || !comentario || valoracion === 0}
        >
          {loading ? t("crearResena.buttons.enviando") : t("crearResena.buttons.enviar")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearResena;
