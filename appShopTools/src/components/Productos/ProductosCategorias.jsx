import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
} from "@mui/material";
import CategoriaService from "../../services/CategoriaService";
import toast from "react-hot-toast";
import { useCart } from "../../hooks/useCart";
import { ShoppingCart, Straighten } from "@mui/icons-material";

export default function ProductosPorCategoria() {
  const { addItem } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL =
    import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") + "/uploads" || "";
  const { id } = useParams();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriasRes] = await Promise.all([
          CategoriaService.getProoductoCat(id),
        ]);

        console.log("datos", categoriasRes);
        setProductos(categoriasRes.data || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const formatPrecio = (precio) => {
    if (precio === null || precio === undefined) return "₡0.00";
    const precioNum =
      typeof precio === "string"
        ? parseFloat(precio.replace(/[^0-9.-]/g, ""))
        : Number(precio);
    return isNaN(precioNum) ? "₡0.00" : `₡${precioNum.toFixed(2)}`;
  };
  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ p: 4, width: "100%" }}
      >
        <CircularProgress size={40} />
      </Box>
    );

  return (
    <Grid container spacing={3}>
      {productos.map((prod) => (
        <Grid item xs={12} sm={6} md={4} key={prod.id}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: 6,
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              height="220"
              image={
                prod.imagen?.[0]?.imagen
                  ? `${BASE_URL}/${prod.imagen[0].imagen}`
                  : "/placeholder-product.jpg"
              }
              alt={prod.nombre}
              sx={{
                objectFit: "cover",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {prod.nombre}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
                {prod.categoria_nombre && (
                  <Chip label={`Categoria ${prod.categoria_nombre}`} />
                )}
              </Box>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold", mt: 1 }}
              >
                {formatPrecio(prod.precio)}
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 2,
                pt: 0,
              }}
            >
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={() => addItem(prod)}
                size="medium"
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Comprar
              </Button>
              <Button
                variant="outlined"
                startIcon={<Straighten />}
                component={Link}
                to={`/detalles/${prod.id}`}
                size="medium"
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Detalles
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
