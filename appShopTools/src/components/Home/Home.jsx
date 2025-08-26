import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  styled,
  CardActions,
  Snackbar,
  Alert,
  IconButton,
  useTheme,
  CircularProgress,
  Rating,
} from "@mui/material";
import {
  LocalShipping,
  Security,
  SupportAgent,
  Build,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Straighten,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import { useCart } from "../../hooks/useCart";

// Componentes estilizados - HeroSection SIN MÁRGENES
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage:
    "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  color: "white",
  padding: theme.spacing(10, 0),
  textAlign: "center",
  width: "100%",
  margin: 0,
}));

const HeroContainer = styled(Container)(({ theme }) => ({
  maxWidth: "md",
  padding: theme.spacing(0, 2),
  margin: "0 auto",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0, 3),
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  transition: "transform 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const CategoryButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 3),
  borderRadius: theme.spacing(3),
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

// Componente principal
export function Home() {
  const theme = useTheme();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [favorites, setFavorites] = useState([]);
  const BASE_URL =
    import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") + "/uploads" || "";

  const formatPrecio = (precio) => {
    if (precio === null || precio === undefined) return "₡0.00";
    const precioNum =
      typeof precio === "string"
        ? parseFloat(precio.replace(/[^0-9.-]/g, ""))
        : Number(precio);
    return isNaN(precioNum) ? "₡0.00" : `₡${precioNum.toFixed(2)}`;
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriasRes, productoRes] = await Promise.all([
          CategoriaService.getCategorias(),
          ProductoService.getProductos(),
        ]);

        setCategorias(categoriasRes.data || []);
        setProductos(productoRes.data || []);

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
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

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
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Sección Hero - SIN ESPACIOS EN BLANCO ALREDEDOR */}
      <Box
        sx={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        <HeroSection>
          <HeroContainer>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{ fontSize: { xs: "2rem", sm: "3rem", md: "4rem" } }}
            >
              CarsToolsCr
            </Typography>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                mb: 3,
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              }}
            >
              Todo lo que tu vehículo necesita hasta la puerta de tu garaje
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                color="primary"
                component={Link}
                to="/lista"
                sx={{ minWidth: { xs: "200px", sm: "auto" } }}
              >
                Ver Catálogo
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: "white",
                  borderColor: "white",
                  minWidth: { xs: "200px", sm: "auto" },
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
                component={Link}
                to="/ListaPromo"
              >
                Ofertas Especiales
              </Button>
            </Box>
          </HeroContainer>
        </HeroSection>
      </Box>

      {/* Contenido principal */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 }, mt: 4 }}>
        {/* Categorías */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Explora por Categoría
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              mt: 3,
            }}
          >
            {categorias.slice(0, 4).map((category, index) => (
              <CategoryButton
                key={index}
                variant="outlined"
                color="primary"
                startIcon={<Build />}
                size="large"
                component={Link}
                to={`/ProductoCategoria/${category.id}`}
              >
                {category.nombre}
              </CategoryButton>
            ))}
          </Box>
        </Box>

        {/* Resto del contenido... */}
        {/* Productos Destacados */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            textAlign="center"
          >
            Productos Destacados
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {productos.slice(0, 4).map((producto) => (
              <Grid item key={producto.id} xs={12} sm={6} md={4} lg={3}>
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

                  <CardMedia
                    component="img"
                    height="250"
                    image={
                      producto.imagen?.[0]?.imagen
                        ? `${BASE_URL}/${producto.imagen[0].imagen}`
                        : "/placeholder-product.jpg"
                    }
                    alt={producto.nombre}
                    sx={{ objectFit: "cover" }}
                  />

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Chip
                      label={producto.categoria_nombre || "Sin categoría"}
                      size="small"
                      sx={{ mb: 1 }}
                    />

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

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        minHeight: 48,
                        lineHeight: 1.2,
                        mb: 0.5,
                      }}
                    >
                      {producto.nombre}
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatPrecio(producto.precio)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(producto)}
                      size="small"
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Comprar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Straighten />}
                      component={Link}
                      to={`/detalles/${producto.id}`}
                      size="small"
                      fullWidth
                    >
                      Detalles
                    </Button>
                  </CardActions>
                </ProductCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/lista"
            >
              Ver Todos los Productos
            </Button>
          </Box>
        </Box>

        {/* Beneficios */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            textAlign="center"
          >
            ¿Por qué elegirnos?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <LocalShipping color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Envío Rápido
                </Typography>
                <Typography textAlign="center">
                  Entregamos en todo el país en 24-48 horas. Garantizado.
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <Security color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Calidad Garantizada
                </Typography>
                <Typography textAlign="center">
                  Todos nuestros productos tienen garantía del fabricante.
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard>
                <SupportAgent color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Soporte Expertos
                </Typography>
                <Typography textAlign="center">
                  Nuestros mecánicos te asesoran en la compra correcta.
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Box>

        {/* Llamada a la acción */}
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "primary.main",
            color: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            ¿Necesitas ayuda para encontrar el repuesto correcto?
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Nuestros expertos están listos para ayudarte a encontrar exactamente
            lo que necesitas.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: "white", color: "primary.main" }}
            component={Link}
            to="/contacto"
          >
            Contactar a un Experto
          </Button>
        </Paper>
      </Container>

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
