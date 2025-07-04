import React from "react";
import Container from "@mui/material/Container";
import MuiCarousel from "../Productos/carrusel";

export function Home() {
  return (
    <Container sx={{ pt: 2, pb: 2, mt: 0 }} maxWidth="md">
      <MuiCarousel sx={{ maxWidth: "100%" }} />
    </Container>
  );
}
