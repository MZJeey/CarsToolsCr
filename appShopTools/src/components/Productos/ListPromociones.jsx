import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Snackbar,
  CardMedia,
  styled,
  useTheme,
  IconButton,
  Rating,
  Chip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  FavoriteBorder,
  Favorite,
  Straighten,
  Clear,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import ProductoService from "../../services/ProductoService";
import Carousel from "react-material-ui-carousel";
import { useCart } from "../../hooks/useCart";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Hook para obtener los parámetros de la URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

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

const ProductImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
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

export function ListaPromo() {
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
    import.meta.env.VITE_BASE_URL.replace(/\/$/, "") + "/uploads";

  // Obtener parámetro de búsqueda de la URL
  const query = useQuery();
  const searchTerm = query.get("search") || "";

  const formatPrecio = (precio) => {
    if (precio === null || precio === undefined) return "₡0.00";
    const precioNum =
      typeof precio === "string"
        ? parseFloat(precio.replace(/[^0-9.-]/g, ""))
        : Number(precio);
    return isNaN(precioNum) ? "₡0.00" : `₡${precioNum.toFixed(2)}`;
  };

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

  // Función para filtrar productos según el término de búsqueda
  const filtrarProductos = (productos) => {
    if (!searchTerm) return productos;

    const term = searchTerm.toLowerCase();
    return productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(term) ||
        (producto.descripcion &&
          producto.descripcion.toLowerCase().includes(term)) ||
        (producto.categoria_nombre &&
          producto.categoria_nombre.toLowerCase().includes(term)) ||
        (producto.marca_nombre &&
          producto.marca_nombre.toLowerCase().includes(term))
    );
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductoService.getProductos();

      if (response.data && Array.isArray(response.data)) {
        setProductos(response.data);

        // Cargar favoritos desde localStorage con verificación
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          try {
            const parsedFavorites = JSON.parse(savedFavorites);

            // Verificar si es un array, si no, convertirlo
            if (Array.isArray(parsedFavorites)) {
              setFavorites(parsedFavorites);
            } else if (
              typeof parsedFavorites === "object" &&
              parsedFavorites !== null
            ) {
              // Si es un objeto, convertirlo a array de claves
              const favoritesArray = Object.keys(parsedFavorites).filter(
                (key) => parsedFavorites[key] === true
              );
              setFavorites(favoritesArray);
              // Guardar la versión corregida
              localStorage.setItem("favorites", JSON.stringify(favoritesArray));
            } else {
              // Si no es ni array ni objeto, inicializar como array vacío
              setFavorites([]);
              localStorage.setItem("favorites", JSON.stringify([]));
            }
          } catch (e) {
            console.error("Error parsing favorites:", e);
            setFavorites([]);
            localStorage.setItem("favorites", JSON.stringify([]));
          }
        } else {
          setFavorites([]);
        }
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
  }, [searchTerm]); // Volver a cargar cuando cambie el término de búsqueda

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const fechaActual = new Date();

  // Función para determinar las promociones aplicables
  const productosConPromocionValida = productos.map((producto) => {
    // Buscar promoción específica para este producto
    const promocionProducto = producto.promociones?.find((promo) => {
      const fechaInicio = new Date(promo.FechaInicio);
      const fechaFin = new Date(promo.FechaFin);
      return (
        fechaActual >= fechaInicio &&
        fechaActual <= fechaFin &&
        promo.IdProducto &&
        promo.IdProducto.toString() === producto.id.toString()
      );
    });

    // Si no hay promoción por producto, buscar por categoría
    const promocionCategoria = !promocionProducto
      ? producto.promociones?.find((promo) => {
          const fechaInicio = new Date(promo.FechaInicio);
          const fechaFin = new Date(promo.FechaFin);
          return (
            fechaActual >= fechaInicio &&
            fechaActual <= fechaFin &&
            promo.IdCategoria &&
            promo.IdCategoria.toString() === producto.categoria_id.toString()
          );
        })
      : null;

    return {
      ...producto,
      promocion: promocionProducto || promocionCategoria,
      tipoPromocion: promocionProducto
        ? "producto"
        : promocionCategoria
          ? "categoria"
          : null,
    };
  });

  // Filtrar productos según el término de búsqueda y SOLO los que tienen promoción
  const productosFiltrados = filtrarProductos(
    productosConPromocionValida
  ).filter((producto) => producto.promocion && producto.promocion.Descuento);

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
      {/* Mostrar información de búsqueda si hay un término de búsqueda */}
      {searchTerm && (
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h3" fontWeight="bold" color="primary">
            Resultados de búsqueda para: {searchTerm}
          </Typography>

          <Chip
            icon={<Clear />}
            label="Limpiar búsqueda"
            onClick={() => (window.location.href = "/lista")}
            variant="outlined"
            color="primary"
            clickable
          />
        </Box>
      )}

      {/* Título para promociones */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, p: 3 }}>
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
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          🎯 Productos con descuentos exclusivos
        </Typography>
      </Box>

      {/* Mostrar mensaje si no hay productos con promoción */}
      {productosFiltrados.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            {searchTerm
              ? `No se encontraron productos con promoción que coincidan con "${searchTerm}"`
              : "No hay promociones disponibles en este momento"}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/lista"
              sx={{ mt: 2 }}
            >
              Ver todos los productos
            </Button>
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        {productosFiltrados.map((producto) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id}>
            <ProductCard elevation={4}>
              {producto.promocion && producto.promocion.Descuento && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: -8,
                    zIndex: 2,
                    backgroundColor:
                      producto.tipoPromocion === "producto"
                        ? theme.palette.error.main
                        : theme.palette.warning.main,
                    color: theme.palette.error.contrastText,
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    boxShadow: theme.shadows[2],
                    borderRadius: "4px 4px 4px 0",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      borderWidth: "0 8px 8px 0",
                      borderStyle: "solid",
                      borderColor: "transparent",
                      borderRightColor:
                        producto.tipoPromocion === "producto"
                          ? theme.palette.error.dark
                          : theme.palette.warning.dark,
                    },
                  }}
                >
                  {Math.round(producto.promocion.Descuento)}% Descuento
                  {producto.tipoPromocion === "producto" && " Exclusivo"}
                  {producto.tipoPromocion === "categoria" && " Por  Categorías"}
                </Box>
              )}

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
                  <Carousel
                    autoPlay={false}
                    navButtonsAlwaysVisible={true}
                    indicators={producto.imagen.length > 1}
                    indicatorContainerProps={{
                      style: {
                        position: "absolute",
                        bottom: "10px",
                        zIndex: 2,
                        textAlign: "center",
                        width: "100%",
                      },
                    }}
                    indicatorIconButtonProps={{
                      style: {
                        padding: "5px",
                        color: "rgba(90, 14, 14, 0.5)",
                      },
                    }}
                    activeIndicatorIconButtonProps={{
                      style: {
                        color: theme.palette.primary.main,
                      },
                    }}
                    sx={{
                      height: "100%",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "16px 16px 0 0",
                      position: "relative",
                    }}
                  >
                    {producto.imagen.map((imgObj, idx) => (
                      <CardMedia
                        key={idx}
                        component="img"
                        image={`${BASE_URL}/${imgObj.imagen}`}
                        alt={`${producto.nombre} - imagen ${idx + 1}`}
                        sx={{
                          height: 350,
                          width: "100%",
                          borderRadius: "16px 16px 0 0",
                        }}
                      />
                    ))}
                  </Carousel>
                ) : (
                  <ProductImage
                    src="/placeholder-product.jpg"
                    alt="Producto sin imagen"
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
                  {producto.promocion?.Descuento ? (
                    <>
                      <Typography
                        variant="body2"
                        color="text.disabled"
                        sx={{ textDecoration: "line-through", fontSize: 14 }}
                      >
                        {formatPrecio(producto.precio)}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="error"
                        fontWeight="bold"
                        sx={{ lineHeight: 1.1 }}
                      >
                        {formatPrecio(
                          producto.precio -
                            (producto.precio * producto.promocion.Descuento) /
                              100
                        )}{" "}
                        (IVA incluido)
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{ lineHeight: 1.1 }}
                    >
                      {formatPrecio(producto.precio)} (IVA incluido)
                    </Typography>
                  )}
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

export default ListaPromo;
