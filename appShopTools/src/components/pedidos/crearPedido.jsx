import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import PedidoService from "../../services/PedidoService";
import ProductoService from "../../services/ProductoService";
import { useTranslation } from "react-i18next";
const CrearPedidoModal = ({ open, handleClose, refreshPedidos }) => {
  const { t } = useTranslation("crearPedido");
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState({
    direccion_envio: "",
    estado: "en_proceso",
    detalles: [{ producto_id: "", cantidad: 1 }],
  });

  useEffect(() => {
    const fetchProductos = async () => {
      const res = await ProductoService.getProductos();
      setProductos(res.data);
    };
    fetchProductos();
  }, []);

  // Reiniciar el pedido cada vez que se abre el modal
  useEffect(() => {
    if (open) {
      setPedido({
        direccion_envio: "",
        estado: "en_proceso",
        detalles: [{ producto_id: "", cantidad: 1 }],
      });
    }
  }, [open]);

  const handleDetalleChange = (index, field, value) => {
    const updatedDetalles = [...pedido.detalles];
    updatedDetalles[index][field] = value;
    setPedido({ ...pedido, detalles: updatedDetalles });
  };

  const agregarProducto = () => {
    setPedido({
      ...pedido,
      detalles: [...pedido.detalles, { producto_id: "", cantidad: 1 }],
    });
  };

  const eliminarProducto = (index) => {
    const detallesFiltrados = pedido.detalles.filter((_, i) => i !== index);
    setPedido({ ...pedido, detalles: detallesFiltrados });
  };

  const handleGuardar = async () => {
    try {
      await PedidoService.crearPedido(pedido);
      refreshPedidos();
      handleClose();
    } catch (error) {
      console.error("Error al guardar el pedido", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: "#438892", color: "white" }}>
        {t("crearPedidoModal.titulo")}
      </DialogTitle>
      <DialogContent dividers>
        <Box>
          <TextField
            fullWidth
            label="Dirección de envío"
            margin="normal"
            value={pedido.direccion_envio}
            onChange={(e) =>
              setPedido({ ...pedido, direccion_envio: e.target.value })
            }
          />

          <TextField
            select
            fullWidth
            label="Estado"
            margin="normal"
            value={pedido.estado}
            onChange={(e) => setPedido({ ...pedido, estado: e.target.value })}
          >
            <MenuItem value="en_proceso">En proceso</MenuItem>
            <MenuItem value="pagado">Pagado</MenuItem>
            <MenuItem value="entregado">Entregado</MenuItem>
          </TextField>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            {t("crearPedidoModal.formulario.productos.tituloSeccion")}
          </Typography>

          {pedido.detalles.map((detalle, index) => (
            <Grid container spacing={2} key={index} alignItems="center">
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Producto"
                  value={detalle.producto_id}
                  onChange={(e) =>
                    handleDetalleChange(index, "producto_id", e.target.value)
                  }
                >
                  {productos.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  fullWidth
                  label="Cantidad"
                  value={detalle.cantidad}
                  onChange={(e) =>
                    handleDetalleChange(index, "cantidad", e.target.value)
                  }
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  onClick={() => eliminarProducto(index)}
                  disabled={pedido.detalles.length === 1}
                >
                  <DeleteIcon
                    color={pedido.detalles.length === 1 ? "disabled" : "error"}
                  />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            startIcon={<AddCircleIcon />}
            sx={{ mt: 2 }}
            onClick={agregarProducto}
          >
            {t("crearPedidoModal.botones.anadirProducto.texto")}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t("crearPedidoModal.botones.cancelar")}
        </Button>
        <Button onClick={handleGuardar} variant="contained" color="primary">
          {t("crearPedidoModal.botones.crearPedido")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearPedidoModal;
