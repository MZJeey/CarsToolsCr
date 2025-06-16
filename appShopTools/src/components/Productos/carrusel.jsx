// components/MuiCarousel.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  MobileStepper,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const repuestos = [
  {
    titulo: "Filtro de Aceite",
    descripcion: "Compatible con Toyota y Nissan.",
    imagen: "../uploads/Llantas.jpg",
  },
  {
    titulo: "Pastillas de Freno",
    descripcion: "Alta duración, para sedán y SUV.",
    imagen: "../uploads/Pieza-carburador.jpg",
  },
  {
    titulo: "Amortiguador",
    descripcion: "Diseño reforzado, ideal para 4x4.",
    imagen: "../uploads/Llantas.jpg",
  },
];

export default function MuiCarousel() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = repuestos.length;

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  return (
    <Box sx={{ maxWidth: 600, flexGrow: 1, mx: "auto", mt: 5 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={repuestos[activeStep].imagen}
          alt={repuestos[activeStep].titulo}
        />
        <CardContent>
          <Typography variant="h6">{repuestos[activeStep].titulo}</Typography>
          <Typography variant="body2" color="text.secondary">
            {repuestos[activeStep].descripcion}
          </Typography>
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
