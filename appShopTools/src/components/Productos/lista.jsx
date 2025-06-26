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
  Snackbar,
  CardMedia,
  styled,
  useTheme,
  Paper,
  IconButton,
  Rating,
  Badge,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Straighten,
  AddShoppingCart,
} from "@mui/icons-material";
import ProductoService from "../../services/ProductoService";
import Carousel from "react-material-ui-carousel";

// Componentes estilizados
const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 2,
  transition: "all 0.3s ease",
  position: "relative",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
    "& .product-actions": {
      opacity: 1,
    },
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 220,
  objectFit: "cover",
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[100],
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: "none",
  fontWeight: "bold",
  padding: theme.spacing(1, 2),
  flexGrow: 1,
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const PrimaryActionButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SecondaryActionButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export function Lista() {
  const theme = useTheme();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [favorites, setFavorites] = useState({});
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

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    setSuccess(
      `Producto ${favorites[id] ? "removido de" : "agregado a"} favoritos`
    );
  };

  const handleAddToCart = (producto) => {
    setSuccess(`"${producto.nombre}" agregado al carrito`);
    // Lógica para agregar al carrito aquí
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductoService.getProductos();

      if (response.data && Array.isArray(response.data)) {
        setProductos(response.data);
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

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Grid container spacing={3}>
        {productos.map((producto) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
            <ProductCard elevation={4}>
              {/* Botón de favoritos */}
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.9)",
                  },
                }}
                onClick={() => toggleFavorite(producto.id)}
              >
                {favorites[producto.id] ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>

              {/* Imagen del producto */}
              {producto.imagen?.length > 0 ? (
                <Carousel
                  autoPlay={false}
                  navButtonsAlwaysVisible
                  indicators={producto.imagen.length > 1}
                >
                  {producto.imagen.map((img, idx) => (
                    <ProductImage
                      key={idx}
                      image={`${BASE_URL}/${img.imagen}`}
                      alt={`${producto.nombre} - Imagen ${idx + 1}`}
                    />
                  ))}
                </Carousel>
              ) : (
                <ProductImage
                  image="/placeholder-product.jpg"
                  alt="Producto sin imagen"
                />
              )}

              {/* Contenido de la tarjeta */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {producto.nombre}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {producto.descripcion?.substring(0, 100)}...
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrecio(producto.precio)}
                  </Typography>
                  <Rating value={4} precision={0.5} readOnly size="small" />
                </Box>

                {producto.marca_compatible && (
                  <Chip
                    label={producto.marca_compatible}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>

              {/* Acciones - Botones principales */}
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                  <SecondaryActionButton
                    variant="contained"
                    startIcon={<Straighten />}
                    component={Link}
                    to={`/detalles/${producto.id}?tab=talles`}
                  >
                    Detalles
                  </SecondaryActionButton>

                  <PrimaryActionButton
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => handleAddToCart(producto)}
                  >
                    Comprar
                  </PrimaryActionButton>
                </Stack>
              </CardActions>
            </ProductCard>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
