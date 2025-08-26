import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  CardActions,
  Button,
  Box,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  Rating,
  styled,
  useTheme,
  Container,
} from "@mui/material";
import {
  ShoppingCart,
  Straighten,
  Favorite,
  FavoriteBorder,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import CategoriaService from "../../services/CategoriaService";
import toast from "react-hot-toast";
import { useCart } from "../../hooks/useCart";
import { useTranslation } from "react-i18next";

// Estilos reutilizados
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
  },
}));

const ImageWrapper = styled(Box)({
  height: 350,
  position: "relative",
  overflow: "hidden",
  borderRadius: "16px 16px 0 0",
});

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
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.contrastText,
  boxShadow: `0 1px 6px ${theme.palette.success.light}`,
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: 0.5,
  border: `1.5px solid ${theme.palette.success.main}`,
  transition: "all 0.18s",
  "&:hover": {
    backgroundColor: theme.palette.success.main,
    color: "#fff",
    boxShadow: `0 2px 12px ${theme.palette.success.main}`,
    borderColor: theme.palette.success.dark,
  },
}));

const SecondaryActionButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.secondary.contrastText,
  boxShadow: `0 1px 6px ${theme.palette.secondary.light}`,
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: 0.5,
  border: `1.5px solid ${theme.palette.secondary.main}`,
  transition: "all 0.18s",
  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
    color: "#fff",
    boxShadow: `0 2px 12px ${theme.palette.secondary.main}`,
    borderColor: theme.palette.secondary.dark,
  },
}));

export default function ProductosPorCategoria() {
  const { addItem } = useCart();
  const { t } = useTranslation("lista");
  const navigate = useNavigate();
  const theme = useTheme();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const BASE_URL =
    import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") + "/uploads" || "";
  const { id } = useParams();

  const formatPrecio = (precio) => {
    if (precio === null || precio === undefined) return "₡0.00";
    const precioNum =
      typeof precio === "string"
        ? parseFloat(precio.replace(/[^0-9.-]/g, ""))
        : Number(precio);
    return isNaN(precioNum) ? "₡0.00" : `₡${precioNum.toFixed(2)}`;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [categoriasRes] = await Promise.all([
          CategoriaService.getProoductoCat(id),
        ]);

        console.log("datos", categoriasRes);
        setProductos(categoriasRes.data || []);

        // Cargar favoritos desde localStorage
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          try {
            const parsedFavorites = JSON.parse(savedFavorites);

            if (Array.isArray(parsedFavorites)) {
              setFavorites(parsedFavorites);
            } else if (
              typeof parsedFavorites === "object" &&
              parsedFavorites !== null
            ) {
              const favoritesArray = Object.keys(parsedFavorites).filter(
                (key) => parsedFavorites[key] === true
              );
              setFavorites(favoritesArray);
              localStorage.setItem("favorites", JSON.stringify(favoritesArray));
            } else {
              setFavorites([]);
              localStorage.setItem("favorites", JSON.stringify([]));
            }
          } catch (e) {
            console.error("Error parsing favorites:", e);
            setFavorites([]);
            localStorage.setItem("favorites", JSON.stringify([]));
          }
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los productos de la categoría");
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const toggleFavorite = (id) => {
    const idString = id.toString();
    const newFavorites = favorites.includes(idString)
      ? favorites.filter((favId) => favId !== idString)
      : [...favorites, idString];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleAddToCart = (producto) => {
    addItem(producto);
    setSuccess(`"${producto.nombre}" agregado al carrito`);
  };

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
      {/* Header con botón de volver */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            mr: 2,
            color: "primary.main",
            "&:hover": { backgroundColor: "primary.light" },
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography variant="h3" fontWeight="bold" color="primary">
          Productos de la Categoría
        </Typography>
      </Box>

      {/* Mostrar mensaje si no hay productos */}
      {productos.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            No hay productos en esta categoría
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/lista")}
            sx={{ mt: 2 }}
          >
            Ver todos los productos
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {productos.map((producto) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
            <ProductCard elevation={4}>
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
                {favorites.includes(producto.id.toString()) ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>

              <ImageWrapper>
                {producto.imagen?.length > 0 ? (
                  <CardMedia
                    component="img"
                    image={`${BASE_URL}/${producto.imagen[0].imagen}`}
                    alt={producto.nombre}
                    sx={{
                      height: 350,
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "16px 16px 0 0",
                    }}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    image="/placeholder-product.jpg"
                    alt="Producto sin imagen"
                    sx={{
                      height: 350,
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "16px 16px 0 0",
                    }}
                  />
                )}
              </ImageWrapper>

              <CardContent sx={{ flexGrow: 1, p: 2, pb: "8px!important" }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    minHeight: 48,
                    lineHeight: 1.2,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {producto.nombre}
                </Typography>

                <Rating
                  name={`product-rating-${producto.id}`}
                  value={
                    producto.promedio_valoraciones &&
                    parseFloat(producto.promedio_valoraciones) > 0
                      ? parseFloat(producto.promedio_valoraciones)
                      : producto.resena && producto.resena.length > 0
                        ? producto.resena.reduce(
                            (sum, resena) =>
                              sum + parseFloat(resena.valoracion),
                            0
                          ) / producto.resena.length
                        : 0
                  }
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ mb: 1 }}
                />

                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ lineHeight: 1.1 }}
                  >
                    {formatPrecio(producto.precio)} (IVA incluido)
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    minHeight: 36,
                    mb: 0,
                    fontSize: 15,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {producto.descripcion?.substring(0, 60)}...
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <PrimaryActionButton
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => handleAddToCart(producto)}
                >
                  {t("lista.comprar")}
                </PrimaryActionButton>

                <SecondaryActionButton
                  variant="contained"
                  startIcon={<Straighten />}
                  component={Link}
                  to={`/detalles/${producto.id}`}
                >
                  {t("lista.verDetalle")}
                </SecondaryActionButton>
              </CardActions>
            </ProductCard>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {error ? (
          <Alert severity="error" onClose={handleCloseSnackbar}>
            {error}
          </Alert>
        ) : (
          <Alert severity="success" onClose={handleCloseSnackbar}>
            {success}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}
