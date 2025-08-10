import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Divider,
  Badge,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

const CarritoComponent = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Simulating API call - replace with actual fetch to your backend
        // const response = await fetch(`/api/carrito?usuario_id=${userId}`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockData = [
          {
            usuario_id: userId,
            producto_id: 1,
            cantidad: 2,
            guardado_en: "2023-05-15T10:30:00Z",
            producto: {
              id: 1,
              nombre: "Producto 1",
              precio: 19.99,
              imagen_url: "https://via.placeholder.com/80",
            },
          },
          {
            usuario_id: userId,
            producto_id: 2,
            cantidad: 1,
            guardado_en: "2023-05-16T11:20:00Z",
            producto: {
              id: 2,
              nombre: "Producto 2",
              precio: 29.99,
              imagen_url: "https://via.placeholder.com/80",
            },
          },
        ];

        setCartItems(mockData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.producto_id === productId
          ? { ...item, cantidad: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = async (productId) => {
    try {
      // Simulating API call - replace with actual fetch to your backend
      // await fetch(`/api/carrito?usuario_id=${userId}&producto_id=${productId}`, {
      //   method: 'DELETE'
      // });

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.producto_id !== productId)
      );
      showSnackbar("Producto eliminado del carrito", "success");
    } catch (err) {
      showSnackbar("Error al eliminar el producto", "error");
    }
  };

  const handleCheckout = async () => {
    try {
      // Simulating API call - replace with actual fetch to your backend
      // await fetch('/api/pedidos', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     usuario_id: userId,
      //     items: cartItems
      //   })
      // });

      showSnackbar("Compra realizada con éxito", "success");
      setCartItems([]);
    } catch (err) {
      showSnackbar("Error al procesar la compra", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.cantidad * item.producto.precio, 0)
      .toFixed(2);
  };

  if (loading) return <Typography>Cargando carrito...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <ShoppingCartIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        Mi Carrito de Compras
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Tu carrito está vacío
        </Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="center">Cantidad</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.producto_id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={item.producto.imagen_url}
                            alt={item.producto.nombre}
                            sx={{ width: 56, height: 56, mr: 2 }}
                          />
                          <Typography>{item.producto.nombre}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ${item.producto.precio.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                item.producto_id,
                                item.cantidad - 1
                              )
                            }
                            disabled={item.cantidad <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <TextField
                            value={item.cantidad}
                            size="small"
                            sx={{ width: 60, mx: 1 }}
                            inputProps={{ style: { textAlign: "center" } }}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value);
                              if (!isNaN(newValue)) {
                                handleQuantityChange(
                                  item.producto_id,
                                  newValue
                                );
                              }
                            }}
                          />
                          <IconButton
                            onClick={() =>
                              handleQuantityChange(
                                item.producto_id,
                                item.cantidad + 1
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ${(item.cantidad * item.producto.precio).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleRemoveItem(item.producto_id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resumen del Pedido
              </Typography>
              <Divider sx={{ my: 2 }} />

              {cartItems.map((item) => (
                <Box
                  key={item.producto_id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>
                    {item.producto.nombre} x {item.cantidad}
                  </Typography>
                  <Typography>
                    ${(item.cantidad * item.producto.precio).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${calculateTotal()}</Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handleCheckout}
              >
                Proceder al Pago
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CarritoComponent;
