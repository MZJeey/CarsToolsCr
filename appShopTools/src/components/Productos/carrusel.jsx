import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  MobileStepper,
  CircularProgress,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import ProductoService from "../../services/ProductoService";

export default function MuiCarousel() {
  const [productos, setProductos] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);

  // Define BASE_URL para las imágenes
  const BASE_URL =
    import.meta.env.VITE_BASE_URL.replace(/\/$/, "") + "/uploads";

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await ProductoService.getProductos();
        setProductos(res.data || []);
      } catch (e) {
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const maxSteps = productos.length;

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!productos.length) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography>No hay productos para mostrar.</Typography>
      </Box>
    );
  }

  // Manejo de imagen: si el producto tiene varias imágenes, toma la primera
  const producto = productos[activeStep];
  let imagenUrl = "/placeholder-product.jpg";
  if (producto.imagen) {
    if (Array.isArray(producto.imagen) && producto.imagen.length > 0) {
      imagenUrl = `${BASE_URL}/${producto.imagen[0].imagen}`;
    } else if (typeof producto.imagen === "string") {
      imagenUrl = `${BASE_URL}/${producto.imagen}`;
    }
  }

  return (
    <Box sx={{ maxWidth: 600, flexGrow: 1, mx: "auto", mt: 5 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={imagenUrl}
          alt={producto.nombre}
        />
        <CardContent>
          <Typography variant="h6">{producto.nombre}</Typography>
        </CardContent>

        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <IconButton
              size="small"
              onClick={handleNext}
              disabled={maxSteps <= 1}
            >
              <KeyboardArrowRight />
            </IconButton>
          }
          backButton={
            <IconButton
              size="small"
              onClick={handleBack}
              disabled={maxSteps <= 1}
            >
              <KeyboardArrowLeft />
            </IconButton>
          }
        />
      </Card>
    </Box>
  );
}
