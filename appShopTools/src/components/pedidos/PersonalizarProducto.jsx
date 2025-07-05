import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Componentes estilizados
const SummaryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(1, 0),
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const PersonalizarProductoModal = ({
  open,
  onClose,
  productoPersonalizado,
}) => {
  // Función segura para parsear las opciones
  const getOpcionesPersonalizacion = () => {
    try {
      if (!productoPersonalizado?.opciones_personalizacion) return [];

      const parsed = JSON.parse(productoPersonalizado.opciones_personalizacion);

      if (Array.isArray(parsed)) return parsed;

      return Object.entries(parsed || {}).map(([key, value]) => ({
        criterio: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
        ...value,
      }));
    } catch (error) {
      console.error("Error parsing opciones_personalizacion:", error);
      return [];
    }
  };

  const opcionesArray = getOpcionesPersonalizacion();

  // Cálculos
  const costoBase = parseFloat(productoPersonalizado?.costo_base || 0);
  const costoAdicional = parseFloat(
    productoPersonalizado?.costo_adicional || 0
  );
  const cantidad = parseInt(productoPersonalizado?.cantidad || 1);
  const precioUnitario = productoPersonalizado?.precio_unitario
    ? parseFloat(productoPersonalizado.precio_unitario)
    : costoBase + costoAdicional;
  const subtotal = productoPersonalizado?.subtotal
    ? parseFloat(productoPersonalizado.subtotal)
    : precioUnitario * cantidad;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 2,
        }}
      >
        Detalles del Producto Personalizado
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Encabezado */}
          <CustomPaper elevation={0}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {productoPersonalizado?.nombre_personalizado ||
                "Producto Personalizado"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Producto base: {productoPersonalizado?.nombre_producto_base}
            </Typography>
          </CustomPaper>

          {/* Opciones de personalización */}
          {opcionesArray.length > 0 && (
            <CustomPaper elevation={0}>
              <SectionTitle variant="subtitle1">
                Opciones de Personalización
              </SectionTitle>
              <List dense disablePadding>
                {opcionesArray.map((opcion, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemText
                      primary={`${opcion.criterio}: ${opcion.opcion}`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondary={`+ ₡${parseFloat(opcion.costo || 0).toLocaleString("es-CR")}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CustomPaper>
          )}

          {/* Costos */}
          <CustomPaper elevation={0}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SummaryItem>
                  <Typography>Costo base:</Typography>
                  <PriceText>₡{costoBase.toLocaleString("es-CR")}</PriceText>
                </SummaryItem>
              </Grid>
              <Grid item xs={6}>
                <SummaryItem>
                  <Typography>Adicionales:</Typography>
                  <PriceText>
                    ₡{costoAdicional.toLocaleString("es-CR")}
                  </PriceText>
                </SummaryItem>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12}>
                <SummaryItem>
                  <Typography>Cantidad:</Typography>
                  <Chip
                    label={cantidad}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </SummaryItem>
              </Grid>
            </Grid>
          </CustomPaper>

          {/* Resumen financiero */}
          <CustomPaper elevation={0}>
            <SectionTitle variant="subtitle1">Resumen Financiero</SectionTitle>

            <Stack spacing={1}>
              <SummaryItem>
                <Typography>Precio unitario:</Typography>
                <PriceText>₡{precioUnitario.toLocaleString("es-CR")}</PriceText>
              </SummaryItem>

              <SummaryItem sx={{ pt: 2 }}>
                <Typography variant="subtitle2">
                  Subtotal ({cantidad} {cantidad > 1 ? "unidades" : "unidad"}):
                </Typography>
                <PriceText variant="subtitle1">
                  ₡{subtotal.toLocaleString("es-CR")}
                </PriceText>
              </SummaryItem>

              <Divider sx={{ my: 1 }} />

              <SummaryItem>
                <Typography variant="h6">Total:</Typography>
                <PriceText variant="h6" sx={{ color: "primary.main" }}>
                  ₡{subtotal.toLocaleString("es-CR")}
                </PriceText>
              </SummaryItem>
            </Stack>
          </CustomPaper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 2 }}>
          Cerrar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Lógica para guardar/confirmar
            onClose();
          }}
        >
          Confirmar Pedido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonalizarProductoModal;
