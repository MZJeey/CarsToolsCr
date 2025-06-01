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
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsApp from "@mui/icons-material/WhatsApp";
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
          alignItems="flex-start" // <-- Aquí el cambio clave
        >
          {/* Columna 1 */}
          <Box textAlign="center">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Síguenos
            </Typography>
            <Box
              component="img"
              src="/logoCarsTools.jpg"
              alt="Logo o imagen"
              sx={{ width: 120, height: "auto", mb: 2 }}
            />
            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <IconButton aria-label="Facebook" color="inherit">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="Twitter" color="inherit">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="Instagram" color="inherit">
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Columna 2 */}
          <Box textAlign="left">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              CarsToolsCr
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">Soluciones automotrices</Typography>
              <Typography variant="body2">
                Gran variedad de repuestos
              </Typography>
              <Typography variant="body2">
                Soluciones al instante de verdad
              </Typography>
              <Typography variant="body2">Trabaje con nosotros</Typography>
            </Stack>
          </Box>

          {/* Columna 3 */}
          <Box textAlign="left">
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Contáctanos
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2">info@carstoolscr.com</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">tel:2538000</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <WhatsApp fontSize="small" />
                <Typography variant="body2">(506)71795695</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">
                  Costado del estadio morera soto, Alajuela
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/* Línea divisora */}
        <Divider sx={{ my: 2, borderColor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Copyright centrado */}
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} CarsToolsCr. Todos los derechos
          reservados.
        </Typography>
      </Container>
    </Box>
  );
}
