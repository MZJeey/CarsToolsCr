import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MuiCarousel from "../Productos/carrusel";
export function Home() {
  return (
    <Container sx={{ p: 2 }} maxWidth="sm">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        CarsToolsCr
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary">
        Todo lo que tu vehiculo necesita hasta la puerta de tu garaje.
      </Typography>
      <MuiCarousel />
    </Container>
  );
}
