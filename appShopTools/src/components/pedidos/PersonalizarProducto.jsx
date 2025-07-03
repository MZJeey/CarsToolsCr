// src/components/PersonalizarProductoModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Divider,
  Typography,
  InputAdornment,
  Box
} from "@mui/material";

const PersonalizarProductoModal = ({ open, onClose, formValues, onChange, onSubmit }) => {
  const calcularResumen = () => {
    const base = parseInt(formValues.costo_base || 0);
    const colorCost =
      formValues.color === "Rojo" ? 500 :
      formValues.color === "Negro Mate" ? 2000 :
      formValues.color === "Azul" ? 800 : 0;

    const estiloCost =
      formValues.estilo === "Deportivo" ? 3500 :
      formValues.estilo === "Clásico" ? 1000 :
      formValues.estilo === "Minimalista" ? 1200 : 0;

    const totalUnitario = base + colorCost + estiloCost;
    const cantidad = parseInt(formValues.cantidad || 1);
    const subtotal = totalUnitario * cantidad;
    const impuestos = Math.round(subtotal * 0.13);
    const total = subtotal + impuestos;

    return { totalUnitario, subtotal, impuestos, total };
  };

  const resumen = calcularResumen();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        Personalizar Producto
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Nombre Personalizado" name="nombre_personalizado" value={formValues.nombre_personalizado} onChange={onChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Producto Base" name="producto_base" value={formValues.producto_base} onChange={onChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="number" label="Costo Base" name="costo_base" value={formValues.costo_base} onChange={onChange} InputProps={{ startAdornment: <InputAdornment position="start">₡</InputAdornment> }} />
          </Grid>
          <Grid item xs={6}>
            <TextField type="number" fullWidth label="Cantidad" name="cantidad" value={formValues.cantidad} onChange={onChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField select fullWidth label="Color" name="color" value={formValues.color} onChange={onChange}>
              <MenuItem value="Rojo">Rojo (+₡500)</MenuItem>
              <MenuItem value="Negro Mate">Negro Mate (+₡2000)</MenuItem>
              <MenuItem value="Azul">Azul (+₡800)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField select fullWidth label="Estilo" name="estilo" value={formValues.estilo} onChange={onChange}>
              <MenuItem value="Deportivo">Deportivo (+₡3500)</MenuItem>
              <MenuItem value="Clásico">Clásico (+₡1000)</MenuItem>
              <MenuItem value="Minimalista">Minimalista (+₡1200)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Marca" name="marca" value={formValues.marca} onChange={onChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField select fullWidth label="Método de Pago" name="metodo_pago" value={formValues.metodo_pago} onChange={onChange}>
              <MenuItem value="Efectivo">Efectivo</MenuItem>
              <MenuItem value="Tarjeta de Crédito">Tarjeta de Crédito</MenuItem>
              <MenuItem value="Tarjeta de Débito">Tarjeta de Débito</MenuItem>
            </TextField>
          </Grid>

          {/* Resumen visual */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight="bold">Resumen del Pedido</Typography>
            <Box mt={2}>
              <Typography>Total Unitario: <strong>₡{resumen.totalUnitario.toLocaleString()}</strong></Typography>
              <Typography>Subtotal: <strong>₡{resumen.subtotal.toLocaleString()}</strong></Typography>
              <Typography>Impuestos (13%): <strong>₡{resumen.impuestos.toLocaleString()}</strong></Typography>
              <Typography>Total Final: <strong style={{ color: "#1976d2" }}>₡{resumen.total.toLocaleString()}</strong></Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonalizarProductoModal;
