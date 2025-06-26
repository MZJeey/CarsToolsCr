import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductoService from "../../services/ProductoService";
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Rating,
  Grid,
  Divider,
} from "@mui/material";
import { Favorite, FavoriteBorder, ShoppingCart } from "@mui/icons-material";
import Etiquetas from "../Productos/Etiqueta";
import Resenas from "../Productos/resena";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ProductoService.getDetalleProducto(id);
        if (!response.data) throw new Error("Producto no encontrado");
        setProducto(response.data);

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

  const BASE_URL =
    (import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "") + "/uploads";
  let imageUrl = "";
  if (producto.imagen) {
    if (Array.isArray(producto.imagen)) {
      imageUrl = `${BASE_URL}/${producto.imagen[0]?.imagen}`;
    } else if (
      typeof producto.imagen === "string" &&
      !producto.imagen.startsWith("data:image")
    ) {
      imageUrl = `${BASE_URL}/${producto.imagen}`;
    } else {
      imageUrl = producto.imagen;
    }
  }

  return (
    <Box sx={{ maxWidth: 1300, margin: "auto", p: 3 }}>
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate(-1)}>
        ⬅ Volver
      </Button>

      <Grid container spacing={4}>
        {/* Columna Izquierda: Producto */}
        <Grid item xs={12} md={7}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                {imageLoading && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={300}
                  >
                    <Typography>Cargando imagen...</Typography>
                  </Box>
                )}
                <Box
                  component="img"
                  src={imageUrl}
                  alt={`Imagen de ${producto.nombre}`}
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

              <Typography variant="h4" gutterBottom fontWeight={700}>
                {producto.nombre}
              </Typography>

              <Typography
                variant="h5"
                sx={{ color: "success.main", fontWeight: "bold", mb: 2 }}
              >
                {new Intl.NumberFormat("es-CR", {
                  style: "currency",
                  currency: "CRC",
                }).format(producto.precio)}
              </Typography>

              <Typography variant="body1" paragraph sx={{ color: "#444" }}>
                {producto.descripcion}
              </Typography>
              {producto.motor_compatible && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Motor compatible:</strong> {producto.motor_compatible}
                </Typography>
              )}

              {/* 🗂️ Categorías */}

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                {producto.categoria_nombre && (
                  <Typography variant="body2">
                    <strong>Categoría:</strong> {producto.categoria_nombre}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                >
                  Agregar al carrito
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna Derecha: Etiquetas y Reseñas */}
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Etiquetas del Producto
              </Typography>
              <Etiquetas idProducto={producto.id} />
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Reseñas de Clientes
              </Typography>
              <Resenas idProducto={producto.id} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetalleProducto;
