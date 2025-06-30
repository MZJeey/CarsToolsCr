import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  Tooltip,
  CardMedia,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart as ShoppingCartIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import ProductoService from "../../services/ProductoService";
import Carousel from "react-material-ui-carousel";

export function ListaProductos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const BASE_URL =
    import.meta.env.VITE_BASE_URL.replace(/\/$/, "") + "/uploads";

  const formatPrecio = (precio) => {
    if (precio === null || precio === undefined) return "₡0.00";
    const precioNum =
      typeof precio === "string"
        ? parseFloat(precio.replace(/[^0-9.-]/g, ""))
        : Number(precio);
    return isNaN(precioNum) ? "₡0.00" : `₡${precioNum.toFixed(2)}`;
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductoService.getProductos();

      if (response.data && Array.isArray(response.data)) {
        const productosNormalizados = response.data.map((producto) => ({
          ...producto,
          precio:
            typeof producto.precio === "string"
              ? parseFloat(producto.precio)
              : Number(producto.precio),
        }));
        setProductos(productosNormalizados);
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError(err.message || "Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
    // Aquí podrías redirigir a la página de edición o abrir un modal
  };

  const handleEliminar = (producto) => {
    setProductoSeleccionado(producto);
    setConfirmarEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      await ProductoService.deleteProducto(productoSeleccionado.id);
      setConfirmarEliminar(false);
      setSuccess(
        `Producto "${productoSeleccionado.nombre}" eliminado correctamente`
      );
      fetchProductos();
    } catch (error) {
      console.error("Error al eliminar producto", error);
      setError("Error al eliminar el producto. Por favor, intente nuevamente.");
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const handleAgregarProducto = () => {
    navigate("/crear");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Box sx={{ mt: 1, fontSize: "0.8rem" }}>
          <div>Endpoint: {import.meta.env.VITE_BASE_URL}producto</div>
          <div>Verifica que el servidor esté disponible</div>
        </Box>
      </Alert>
    );
  }

  if (productos.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          No hay productos disponibles
        </Alert>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAgregarProducto}
        >
          Agregar Producto
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Catálogo de Productos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAgregarProducto}
        >
          Nuevo Producto
        </Button>
      </Box>

      <Grid container spacing={3}>
        {productos.map((producto) => (
          <Grid item xs={12} sm={6} md={4} key={producto.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 2,
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.3s ease",
                },
              }}
            >
              <CardHeader
                title={producto.nombre}
                subheader={producto.categoria_nombre || "Sin categoría"}
                titleTypographyProps={{
                  variant: "h6",
                  fontWeight: "bold",
                }}
              />

              {/* Carrusel de imágenes */}
              {producto.imagen && producto.imagen.length > 0 ? (
                <Carousel
                  autoPlay={false}
                  navButtonsAlwaysVisible={true}
                  indicators={producto.imagen.length > 1}
                  sx={{ height: 180, backgroundColor: "#f5f5f5" }}
                >
                  {producto.imagen.map((imgObj, idx) => (
                    <CardMedia
                      key={idx}
                      component="img"
                      image={`${BASE_URL}/${imgObj.imagen}`}
                      alt={`${producto.nombre} - imagen ${idx + 1}`}
                      sx={{ height: 180, width: "100%", objectFit: "contain" }}
                    />
                  ))}
                </Carousel>
              ) : (
                <CardMedia
                  component="img"
                  image="placeholder-image-url"
                  alt="Imagen no disponible"
                  height="180"
                  sx={{ objectFit: "contain", background: "#f5f5f5" }}
                />
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {producto.nombre.substring(0, 100)}
                  {producto.descripcion?.length > 100 ? "..." : ""}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrecio(producto.precio)}
                  </Typography>

                  {producto.promocion && producto.promocion.Descuento && (
                    <Chip
                      label={`Promoción ${Math.round(producto.promocion.Descuento)}% Descuento`}
                      color="secondary"
                      size="small"
                      sx={{ ml: 2, fontWeight: "bold" }}
                    />
                  )}

                  <Chip
                    label={`Stock: ${producto.stock || 0}`}
                    size="small"
                    sx={{ ml: "auto" }}
                    color={producto.stock > 0 ? "success" : "error"}
                  />
                </Box>

                {producto.marca_compatible && (
                  <Chip
                    label={producto.marca_compatible}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/detalles/${producto.id}`}
                  startIcon={<ShoppingCartIcon />}
                  sx={{ borderRadius: 1 }}
                >
                  Ver Detalles
                </Button>

                <Box>
                  <Tooltip title="Editar">
                    <IconButton
                      aria-label="editar"
                      color="primary"
                      onClick={() => handleEditar(producto)}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Eliminar">
                    <IconButton
                      aria-label="eliminar"
                      color="error"
                      onClick={() => handleEliminar(producto)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={confirmarEliminar}
        onClose={() => setConfirmarEliminar(false)}
      >
        <DialogTitle>¿Eliminar producto?</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar{" "}
          <strong>{productoSeleccionado?.nombre}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmarEliminar(false)}>Cancelar</Button>
          <Button color="error" onClick={confirmarEliminacion}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
