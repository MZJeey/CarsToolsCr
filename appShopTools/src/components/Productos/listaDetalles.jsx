import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductoService from "../../services/ProductoService";

import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Typography,
  IconButton,
  Rating,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  Paper,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ProductoService.getDetalleProducto(id);
        if (!response.data) throw new Error("Producto no encontrado");
        setProducto(response.data);

        // Procesar imágenes
        const BASE_URL =
          (import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "") + "/uploads";
        let productImages = [];

        if (response.data.imagen) {
          if (Array.isArray(response.data.imagen)) {
            productImages = response.data.imagen.map((img) => ({
              url: `${BASE_URL}/${img.imagen}`,
              name: img.imagen,
            }));
          } else if (
            typeof response.data.imagen === "string" &&
            !response.data.imagen.startsWith("data:image")
          ) {
            productImages = [
              {
                url: `${BASE_URL}/${response.data.imagen}`,
                name: response.data.imagen,
              },
            ];
          } else {
            productImages = [
              {
                url: response.data.imagen,
                name: "Imagen del producto",
              },
            ];
          }
        }

        setImages(productImages);

        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.includes(response.data.id));
      } catch (err) {
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
    console.log("Agregado al carrito:", producto);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % images.length);
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + images.length) % images.length
    );
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
        action={<Button onClick={() => navigate(-1)}>Volver</Button>}
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

  const precioOriginal = parseFloat(producto.precio);
  const precioConDescuento = producto.promocion
    ? precioOriginal * (1 - parseFloat(producto.promocion.Descuento) / 100)
    : null;

  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto", p: 2 }}>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        ⬅ Volver
      </Button>

      <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
        <Grid container spacing={4}>
          {/* Columna 1: Imágenes */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: "relative", width: "100%" }}>
              {images.length > 0 ? (
                <>
                  {imageLoading && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height={300}
                    >
                      <Typography>Cargando imágenes...</Typography>
                    </Box>
                  )}

                  <Box
                    component="img"
                    src={images[activeStep].url}
                    alt={`Imagen ${activeStep + 1} de ${producto.nombre}`}
                    sx={{
                      width: "100%",
                      maxHeight: 400,
                      objectFit: "contain",
                      display: imageLoading ? "none" : "block",
                      backgroundColor: "#fafafa",
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                    onLoad={() => setImageLoading(false)}
                  />

                  {/* Controles del carrusel */}
                  {images.length > 1 && (
                    <>
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: 8,
                          backgroundColor: "rgba(255,255,255,0.7)",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.9)",
                          },
                        }}
                        onClick={handleBack}
                      >
                        <ChevronLeft />
                      </IconButton>

                      <IconButton
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: 8,
                          backgroundColor: "rgba(255,255,255,0.7)",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.9)",
                          },
                        }}
                        onClick={handleNext}
                      >
                        <ChevronRight />
                      </IconButton>

                      <MobileStepper
                        steps={images.length}
                        position="static"
                        activeStep={activeStep}
                        sx={{
                          justifyContent: "center",
                          backgroundColor: "transparent",
                          mt: 1,
                        }}
                        nextButton={null}
                        backButton={null}
                      />
                    </>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 300,
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 2,
                  }}
                >
                  <Typography>No hay imágenes disponibles</Typography>
                </Box>
              )}

              <IconButton
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  backgroundColor: "white",
                  boxShadow: 1,
                }}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Box>
          </Grid>

          {/* Columna 2: Información principal */}
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight={700}>
                {producto.nombre}
              </Typography>

              {producto.promocion ? (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{ color: "error.main", textDecoration: "line-through" }}
                  >
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                    }).format(precioOriginal)}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ color: "success.main", fontWeight: "bold" }}
                  >
                    {new Intl.NumberFormat("es-CR", {
                      style: "currency",
                      currency: "CRC",
                    }).format(precioConDescuento)}
                  </Typography>
                  <Chip
                    label={`${Math.round(producto.promocion.Descuento)}% Descuento`}
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    Promoción válida hasta:{" "}
                    {new Date(producto.promocion.FechaFin).toLocaleDateString(
                      "es-CR"
                    )}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="h4"
                  sx={{ color: "success.main", fontWeight: "bold", mb: 2 }}
                >
                  {new Intl.NumberFormat("es-CR", {
                    style: "currency",
                    currency: "CRC",
                  }).format(precioOriginal)}
                </Typography>
              )}

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {producto.categoria_nombre && (
                  <Chip label={`Categoría: ${producto.categoria_nombre}`} />
                )}
              </Box>

              <Typography variant="body1" sx={{ color: "#444", mb: 3 }}>
                {producto.descripcion}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Compatibilidad */}
              <Typography variant="subtitle1" gutterBottom>
                Compatibilidad:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {producto.ano_compatible && (
                  <Chip
                    label={`Año: ${producto.ano_compatible}`}
                    variant="outlined"
                  />
                )}
                {producto.marca_compatible && (
                  <Chip
                    label={`Marca: ${producto.marca_compatible}`}
                    variant="outlined"
                  />
                )}
                {producto.modelo_compatible && (
                  <Chip
                    label={`Modelo: ${producto.modelo_compatible}`}
                    variant="outlined"
                  />
                )}
                {producto.motor_compatible && (
                  <Chip
                    label={`Motor: ${producto.motor_compatible}`}
                    variant="outlined"
                  />
                )}
                {producto.certificaciones && (
                  <Chip
                    label={`Certificación: ${producto.certificaciones}`}
                    variant="outlined"
                    color="success"
                  />
                )}
              </Box>
            </Box>
          </Grid>

          {/* Columna 3: Etiquetas y reseñas con botón fijo */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
              {/* Etiquetas */}
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Etiquetas
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {producto.etiquetas ? (
                  Array.isArray(producto.etiquetas) ? (
                    producto.etiquetas.length > 0 ? (
                      producto.etiquetas.map((et, idx) => (
                        <Chip
                          key={idx}
                          label={et.nombre || et}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin etiquetas
                      </Typography>
                    )
                  ) : (
                    <Chip
                      label={producto.etiquetas.nombre || producto.etiquetas}
                      color="primary"
                      variant="outlined"
                    />
                  )
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Sin etiquetas
                  </Typography>
                )}
              </Box>

              {/* Reseñas */}
              <Typography variant="h6" gutterBottom fontWeight={700}>
                Últimas reseñas
              </Typography>
              {producto.resena && producto.resena.length > 0 ? (
                <List sx={{ maxHeight: 300, overflow: "auto" }}>
                  {producto.resena.slice(0, 3).map((resena) => (
                    <React.Fragment key={resena.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            alt={resena.usuario_nombre}
                            src={resena.imagen}
                            sx={{ width: 48, height: 48 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <>
                              <Typography fontWeight="bold">
                                {resena.usuario_nombre}
                              </Typography>
                              <Rating
                                value={parseInt(resena.valoracion)}
                                readOnly
                                size="small"
                              />
                            </>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {resena.comentario}
                              </Typography>
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                              >
                                {formatFecha(resena.fecha)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Este producto aún no tiene reseñas.
                </Typography>
              )}
            </Box>

            {/* Botón fijo en la parte inferior */}
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "background.paper",
                pt: 1,
                borderTop: "1px solid #eee",
                zIndex: 1,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={parseInt(producto.stock) <= 0}
              >
                {parseInt(producto.stock) > 0
                  ? "Agregar al carrito"
                  : "No disponible"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DetalleProducto;
