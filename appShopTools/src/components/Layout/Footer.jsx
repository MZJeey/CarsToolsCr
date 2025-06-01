import React from "react";
import {
  Container,
  Typography,
  Box,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
        color: "white",
        py: 2,
        px: 2,
        zIndex: 1300,
      }}
    >
      <Container maxWidth="lg">
        {/* Tres columnas */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Columna 1: Redes Sociales */}
          <Box textAlign="center">
            <Typography variant="subtitle1" fontWeight="bold">
              Síguenos
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
              <IconButton aria-label="Facebook" color="inherit">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" color="inherit">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="Instagram" color="inherit">
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Columna 2: Nombre */}
          <Box textAlign="center">
            <Typography variant="subtitle1" fontWeight="bold">
              CarsToolsCr
            </Typography>
            <Typography variant="body2">Soluciones automotrices</Typography>
          </Box>

          {/* Columna 3: Contacto u otra info */}
          <Box textAlign="center">
            <Typography variant="subtitle1" fontWeight="bold">
              Contáctanos
            </Typography>
            <Typography variant="body2">info@carstoolscr.com</Typography>
          </Box>
        </Stack>

        {/* Línea divisora */}
        <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Copyright centrado */}
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} CarsToolsCr. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
