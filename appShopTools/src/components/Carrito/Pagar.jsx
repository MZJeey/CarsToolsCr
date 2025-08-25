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

export const ProcesarPago = ({ open, onClose, onSuccess }) => {
  const { cart } = useCart();
  const [userInfo, setUserInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("userData");
    if (!userFromStorage) {
      toast.error("Debes iniciar sesión para continuar");
      onClose?.();
      return;
    }
    try {
      const parsedUser = JSON.parse(userFromStorage);
      setUserInfo(parsedUser);
    } catch (error) {
      console.error("Error leyendo usuario del localStorage:", error);
      toast.error("Error con la sesión, inicia sesión nuevamente");
      onClose?.();
    }
  }, [onClose]);

  const formatCurrency = (value) => {
    // Primero formateamos el número
    const formattedNumber = new Intl.NumberFormat("es-CR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    // Devolvemos el número formateado con el símbolo separado
    // Esto ayuda a que el backend pueda manejar el símbolo por separado
    return {
      number: formattedNumber,
      symbol: "₡",
      full: `₡${formattedNumber}`,
    };
  };

  const prepareCartDataForPDF = () => {
    return cart.map((item) => {
      const precioFormateado = formatCurrency(item.precio);
      const subtotal = formatCurrency(item.precio * item.cantidad);

      return {
        ...item,
        precioRaw: item.precio, // Mantenemos el valor numérico original
        precioFormateado: precioFormateado,
        subtotal: subtotal,
        // Datos separados para el PDF
        pdfData: {
          cantidad: item.cantidad.toString(),
          descripcion: item.descripcion || item.nombre,
          precioUnitario: precioFormateado.number,
          subtotal: subtotal.number,
          simboloMoneda: precioFormateado.symbol,
        },
      };
    });
  };

  const procesarItems = async () => {
    if (!userInfo?.id) {
      toast.error("Debes iniciar sesión para continuar");
      return;
    }
    if (!cart?.length) {
      toast.error("Tu carrito está vacío");
      return;
    }

    setIsProcessing(true);
    try {
      const cartForPDF = prepareCartDataForPDF();
      const totals = {
        subtotal: formatCurrency(
          cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
        ),
        iva: formatCurrency(
          cart.reduce(
            (sum, item) => sum + item.precio * item.cantidad * 0.13,
            0
          )
        ),
        total: formatCurrency(
          cart.reduce(
            (sum, item) => sum + item.precio * item.cantidad * 1.13,
            0
          )
        ),
      };

      await Promise.all(
        cart.map((item) =>
          CarritoService.crearCarrito({
            usuario_id: userInfo.id,
            producto_id: item.id,
            cantidad: item.cantidad,
            datos_pdf: JSON.stringify({
              ...item.pdfData,
              totals: {
                subtotal: totals.subtotal.number,
                iva: totals.iva.number,
                total: totals.total.number,
                simboloMoneda: totals.subtotal.symbol,
              },
            }),
          })
        )
      );
      console.log("Datos carrito", cart);

      toast.success("Productos registrados en tu carrito");
      onSuccess?.({
        items: cartForPDF,
        totals: totals,
      });
      onClose?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.message || "Error al procesar los productos");
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
          Total a pagar:{" "}
          {
            formatCurrency(
              cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
            ).full
          }
        </Typography>
        <Typography variant="caption" display="block" color="textSecondary">
          Se generará un PDF con los detalles de tu compra.
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
