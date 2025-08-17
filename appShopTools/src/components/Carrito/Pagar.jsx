import React, { useState, useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import CarritoService from "../../services/CarritoService";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";

export const ProcesarPago = ({ open, onClose }) => {
  const { cart, cleanCart } = useCart();
  const [userInfo, setUserInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ Leemos la info del usuario desde localStorage al montar el componente
  useEffect(() => {
    const userFromStorage = localStorage.getItem("userData");
    if (!userFromStorage) {
      toast.error("Debes iniciar sesión para continuar");
      onClose();
      return;
    }

    try {
      const parsedUser = JSON.parse(userFromStorage);
      setUserInfo(parsedUser);
    } catch (error) {
      console.error("Error leyendo usuario del localStorage:", error);
      toast.error("Error con la sesión, inicia sesión nuevamente");
      onClose();
    }
  }, [onClose]);

  const procesarItems = async () => {
    if (!userInfo?.id) {
      toast.error("Debes iniciar sesión para continuar");
      return;
    }

    setIsProcessing(true);

    try {
      for (const item of cart) {
        const payload = {
          usuario_id: userInfo.id,
          producto_id: item.id,
          cantidad: item.cantidad,
        };
        await CarritoService.crearCarrito(payload);
      }

      toast.success("Compra realizada con éxito");
      cleanCart();
      onClose();
    } catch (error) {
      toast.error(error.message || "Error al procesar los productos");
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirmar Compra</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          ¿Estás seguro que deseas procesar {cart.length} productos?
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Se registrará cada producto individualmente en tu carrito.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isProcessing}>
          Cancelar
        </Button>
        <Button
          onClick={procesarItems}
          color="primary"
          variant="contained"
          disabled={isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} /> : null}
        >
          {isProcessing ? "Procesando..." : "Confirmar Compra"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
