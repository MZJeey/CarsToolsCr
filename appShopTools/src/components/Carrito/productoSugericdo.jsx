import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../../hooks/useCart";

function ProductoSugerido({ producto, onAgregar, onCerrar }) {
  const baseUrl = import.meta.env.VITE_BASE_URL.replace(/\/$/, "") + "/uploads";

  return (
    <Card sx={{ maxWidth: 300, m: 1 }}>
      <Box sx={{ position: "relative" }}>
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
          onClick={onCerrar}
          size="small"
        >
          <CloseIcon />
        </IconButton>
        <CardMedia
          component="img"
          height="140"
          image={
            producto.imagen
              ? `${baseUrl}/${producto.imagen}`
              : "/placeholder.png"
          }
          alt={producto.nombre}
        />
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {producto.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {producto.descripcion}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          &cent;{Number(producto.precio).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="success.main">
          Ahorras: {producto.porcentaje_ahorro}%
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onAgregar(producto)}
          sx={{ mt: 2 }}
          fullWidth
        >
          Agregar al carrito
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SugerenciasModal({ open, onClose, sugerencias }) {
  const { addItem } = useCart();
  const [productosSugeridos, setProductosSugeridos] = useState([]);

  useEffect(() => {
    if (sugerencias && sugerencias.length > 0) {
      setProductosSugeridos(sugerencias);
    }
  }, [sugerencias]);

  const handleAgregarProducto = (producto) => {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen: producto.imagen ? [{ imagen: producto.imagen }] : [],
    });

    // Eliminar el producto de las sugerencias después de agregarlo
    setProductosSugeridos((prev) => prev.filter((p) => p.id !== producto.id));
  };

  const handleCerrar = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCerrar} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">
            Productos similares que te pueden interesar
          </Typography>
          <IconButton onClick={handleCerrar}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container justifyContent="center">
          {productosSugeridos.length > 0 ? (
            productosSugeridos.map((producto) => (
              <Grid item key={producto.id}>
                <ProductoSugerido
                  producto={producto}
                  onAgregar={handleAgregarProducto}
                  onCerrar={() => {
                    setProductosSugeridos((prev) =>
                      prev.filter((p) => p.id !== producto.id)
                    );
                  }}
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ py: 4 }}>
              No hay más productos sugeridos disponibles.
            </Typography>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCerrar} color="primary">
          Continuar al carrito
        </Button>
      </DialogActions>
    </Dialog>
  );
}
