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
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import PedidoService from "../../services/PedidoService";
import ProductoService from "../../services/ProductoService";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const CrearPedidoModal = ({ open, refreshPedidos, onClose }) => {
  const [userInfo, setUserInfo] = useState(null);
  const { t } = useTranslation("crearPedido");
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState({
    usuario_id: "",
    direccion_envio: "",
    estado: "en_proceso",
    detalles: [{ producto_id: "", cantidad: 1 }],
  });

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await ProductoService.getProductos();
        setProductos(res.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        toast.error("Error al cargar los productos");
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const loadUserData = () => {
      const userFromStorage = localStorage.getItem("userData");
      if (!userFromStorage) {
        toast.error("Debes iniciar sesión para continuar");
        return;
      }
      try {
        const userData = JSON.parse(userFromStorage);
        setUserInfo(userData);
        setPedido((prev) => ({
          ...prev,
          usuario_id: userData.id,
        }));
      } catch (error) {
        console.error("Error parsing user data", error);
        toast.error("Error al cargar la información del usuario");
      }
    };
    loadUserData();
  }, []);

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
    if (pedido.detalles.length <= 1) {
      toast.error("Debe haber al menos un producto en el pedido");
      return;
    }
    const detallesFiltrados = pedido.detalles.filter((_, i) => i !== index);
    setPedido({ ...pedido, detalles: detallesFiltrados });
  };

  const reiniciarFormulario = () => {
    setPedido({
      usuario_id: userInfo?.id || "",
      direccion_envio: "",
      estado: "en_proceso",
      detalles: [{ producto_id: "", cantidad: 1 }],
    });
  };

  const handleCancelar = () => {
    reiniciarFormulario();
    onClose(); // Esto asegura que el modal se cierre
  };

  const handleGuardar = async () => {
    try {
      if (!pedido.direccion_envio.trim()) {
        toast.error("Debe ingresar una dirección de envío válida");
        return;
      }

      const hasEmptyProducts = pedido.detalles.some(
        (detalle) => !detalle.producto_id || detalle.cantidad <= 0
      );
      if (hasEmptyProducts) {
        toast.error(
          "Todos los productos deben estar seleccionados con cantidades válidas"
        );
        return;
      }

      const pedidoData = {
        usuario_id: pedido.usuario_id,
        direccion_envio: pedido.direccion_envio.trim(),
        estado: pedido.estado,
        productos: pedido.detalles.map((detalle) => ({
          producto_id: detalle.producto_id,
          cantidad: parseInt(detalle.cantidad),
        })),
      };
      await PedidoService.crearPedido(pedidoData);

      toast.success("Pedido creado con éxito");
      refreshPedidos();

      reiniciarFormulario();
      onClose();
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      toast.error(error.response?.data?.message || "Error al crear el pedido");
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={handleCancelar}>
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
            required
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
            <Grid
              container
              spacing={2}
              key={index}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Producto"
                  value={detalle.producto_id}
                  onChange={(e) =>
                    handleDetalleChange(index, "producto_id", e.target.value)
                  }
                  required
                >
                  <MenuItem value="">
                    <em>Seleccione un producto</em>
                  </MenuItem>
                  {productos.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nombre} - ${p.precio}
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
                    handleDetalleChange(
                      index,
                      "cantidad",
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  }
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => eliminarProducto(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            startIcon={<AddCircleIcon />}
            sx={{ mt: 2 }}
            onClick={agregarProducto}
            variant="outlined"
          >
            {t("crearPedidoModal.botones.anadirProducto.texto")}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={reiniciarFormulario} color="secondary">
          Reiniciar
        </Button>
        <Button onClick={handleCancelar}>
          {t("crearPedidoModal.botones.cancelar")}
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          color="primary"
          disabled={!pedido.direccion_envio.trim()}
        >
          {t("crearPedidoModal.botones.crearPedido")}
        </Button>
        <Button
          component={Link}
          to={`/productos-personalizados/${pedido.id}`}
          variant="outlined"
          color="primary"
          sx={{ ml: 1 }}
        >
          Agregar Producto Personalizado
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CrearPedidoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshPedidos: PropTypes.func.isRequired,
};

export default CrearPedidoModal;
