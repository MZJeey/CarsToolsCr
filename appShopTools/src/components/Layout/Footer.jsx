import React from "react";
import {
  Container,
  Typography,
  Box,
  IconButton,
  Stack,
  Divider,
  Link,
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
        width: "100%",
        backgroundColor: "rgb(12, 12, 12)",
        color: "#f5f5f5",
        py: 4,
        px: 2,
        zIndex: 1300,
      }}
    >
      <Container maxWidth="lg">
        {/* Tres columnas */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          {/* Columna 1 - Redes Sociales */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              color="primary.main"
            >
              Síguenos
            </Typography>
            <Box
              component="img"
              src="/logoCarsTools.jpg"
              alt="Logo CarsToolsCr"
              sx={{
                width: 140,
                height: "auto",
                mb: 2,
                borderRadius: 1,
                boxShadow: 3,
              }}
            />
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              <IconButton
                aria-label="Facebook"
                sx={{
                  color: "#f5f5f5",
                  "&:hover": {
                    color: "#4267B2",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <FacebookIcon fontSize="medium" />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{
                  color: "#f5f5f5",
                  "&:hover": {
                    color: "#1DA1F2",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <TwitterIcon fontSize="medium" />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                sx={{
                  color: "#f5f5f5",
                  "&:hover": {
                    background:
                      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                    bgcolor: "transparent",
                  },
                }}
              >
                <InstagramIcon fontSize="medium" />
              </IconButton>
            </Stack>
          </Box>

          {/* Columna 2 - Información */}
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              color="primary.main"
            >
              CarsToolsCr
            </Typography>
            <Stack spacing={1.5}>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Soluciones automotrices
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Gran variedad de repuestos
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Soluciones al instante
              </Link>
              <Link
                href="#"
                color="inherit"
                underline="hover"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Trabaje con nosotros
              </Link>
            </Stack>
          </Box>

          {/* Columna 3 - Contacto */}
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              color="primary.main"
            >
              Contáctanos
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <EmailIcon fontSize="small" color="primary" />
                <Link
                  href="mailto:info@carstoolscr.com"
                  color="inherit"
                  underline="hover"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  info@carstoolscr.com
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <PhoneIcon fontSize="small" color="primary" />
                <Link
                  href="tel:+50625380000"
                  color="inherit"
                  underline="hover"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  Tel: 2538-0000
                </Link>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <WhatsApp fontSize="small" color="primary" />
                <Link
                  href="https://wa.me/50671795695"
                  target="_blank"
                  color="inherit"
                  underline="hover"
                  sx={{ "&:hover": { color: "primary.main" } }}
                >
                  (506) 7179-5695
                </Link>
              </Stack>
              <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                <LocationOnIcon
                  fontSize="small"
                  color="primary"
                  sx={{ mt: 0.5 }}
                />
                <Typography variant="body2">
                  Costado del estadio Morera Soto, Alajuela, Costa Rica
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/* Línea divisora */}
        <Divider
          sx={{
            my: 3,
            borderColor: "rgba(255, 255, 255, 0.12)",
            borderWidth: 1,
          }}
        />

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            opacity: 0.8,
            fontSize: "0.8rem",
          }}
        >
          © {new Date().getFullYear()} CarsToolsCr. Todos los derechos
          reservados | Desarrollado por Jeeyson, Berny, Felipe
        </Typography>
      </Container>
    </Box>
  );
}
