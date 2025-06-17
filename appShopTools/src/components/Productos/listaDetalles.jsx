import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Divider,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Rating,
  Button,
  useTheme,
  Grid,
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom"; // Asegúrate de importar useParams
import ProductoService from "../../services/ProductoService";
import { styled } from "@mui/system";

// Estilos personalizados
const ProductImage = styled("img")(({ theme }) => ({
  width: "100%",
  maxHeight: 500,
  objectFit: "contain",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  marginBottom: theme.spacing(2),
}));

const PriceText = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: "bold",
  margin: theme.spacing(2, 0),
}));

const DetailSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const DetalleProducto = () => {
  const { id } = useParams(); // Obtener el id desde la URL
  const theme = useTheme();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const BASE_URL =
    (import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "") + "/uploads";

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ProductoService.getDetalleProducto(id);
        if (!response.data) {
          throw new Error("Producto no encontrado");
        }
        const productData = response.data;

        // Imagen
        if (productData.imagen) {
          if (Array.isArray(productData.imagen)) {
            productData.imageUrl = `${BASE_URL}/${productData.imagen[0]?.imagen}`;
          } else if (
            typeof productData.imagen === "string" &&
            !productData.imagen.startsWith("data:image")
          ) {
            productData.imageUrl = `${BASE_URL}/${productData.imagen}`;
          } else {
            productData.imageUrl = productData.imagen;
          }
        }

        setProducto(productData);

        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.includes(productData.id));
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError(err.message || "Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProducto();
  }, [id]);

  const handleToggleFavorite = () => {
    if (!producto) return;
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const updatedFavorites = newFavoriteState
      ? [...favorites, producto.id]
      : favorites.filter((favId) => favId !== producto.id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleAddToCart = () => {
    if (!producto) return;
    console.log("Producto agregado al carrito:", producto);
    // Aquí puedes integrar con tu sistema de carrito
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ m: 3 }}
        action={
          <Button color="inherit" size="small" onClick={() => navigate(-1)}>
            Volver
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!producto) {
    return (
      <Alert severity="warning" sx={{ m: 3 }}>
        No se encontró el producto solicitado
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", p: { xs: 1, md: 3 } }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Volver a productos
      </Button>

      <Card elevation={3}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box position="relative">
                {imageLoading && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={300}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <ProductImage
                  src={producto.imageUrl}
                  alt={`Imagen de ${producto.nombre}`}
                  onLoad={() => setImageLoading(false)}
                  style={{ display: imageLoading ? "none" : "block" }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  }}
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" gutterBottom>
                {producto.nombre}
              </Typography>

              <Box display="flex" alignItems="center" mb={2}>
                <Rating
                  value={producto.promedio_valoraciones || 0}
                  precision={0.5}
                  readOnly
                />
                <Typography variant="body2" color="text.secondary" ml={1}>
                  ({producto.resenas?.length || 0} reseñas)
                </Typography>
              </Box>

              <PriceText variant="h4">
                {new Intl.NumberFormat("es-CR", {
                  style: "currency",
                  currency: "CRC",
                }).format(producto.precio)}
              </PriceText>

              <Typography variant="body1" paragraph>
                {producto.descripcion}
              </Typography>

              <Box mt={3} mb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  sx={{ mr: 2 }}
                >
                  Agregar al carrito
                </Button>
              </Box>

              <DetailSection>
                <Typography variant="h6" gutterBottom>
                  Detalles del producto
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Categoría:</strong> {producto.categoria}
                      {console.log(producto.categoria)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Marca:</strong>{" "}
                      {producto.marca_compatible || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </DetailSection>
            </Grid>
          </Grid>

          {producto.etiquetas && (
            <DetailSection>
              <Typography variant="h6" gutterBottom>
                Etiquetas
              </Typography>
              <Box>
                {producto.etiquetas.split(", ").map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    sx={{ mr: 1, mb: 1 }}
                    variant="outlined"
                  />
                ))}
              </Box>
            </DetailSection>
          )}

          <DetailSection>
            <Typography variant="h5" gutterBottom>
              Reseñas ({producto.resenas?.length || 0})
            </Typography>

            {producto.resenas?.length > 0 ? (
              <List>
                {producto.resenas.map((resena, idx) => (
                  <React.Fragment key={idx}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{resena.nombre_usuario.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography fontWeight="bold" mr={1}>
                              {resena.nombre_usuario}
                            </Typography>
                            <Rating
                              value={resena.valoracion}
                              precision={0.5}
                              readOnly
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(resena.fecha).toLocaleDateString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </Typography>
                            <Typography variant="body1" component="div">
                              {resena.comentario}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {idx < producto.comentario.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay reseñas disponibles para este producto.
              </Typography>
            )}
          </DetailSection>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DetalleProducto;
