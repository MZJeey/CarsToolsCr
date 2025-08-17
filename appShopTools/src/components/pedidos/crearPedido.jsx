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

const CrearPedidoModal = ({ open, handleClose, refreshPedidos }) => {
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
      const res = await ProductoService.getProductos();
      setProductos(res.data);
    };
    fetchProductos();
  }, []);

  // Reiniciar el pedido cada vez que se abre el modal y obtener usuario
  useEffect(() => {
    if (open) {
      const userFromStorage = localStorage.getItem("userData");
      if (!userFromStorage) {
        toast.error("Debes iniciar sesión para continuar");
        handleClose();
        return;
      }

      try {
        const userData = JSON.parse(userFromStorage);
        setUserInfo(userData);
        setPedido({
          usuario_id: userData.id, // Asegúrate de que el objeto userData tenga el id
          direccion_envio: "",
          estado: "en_proceso",
          detalles: [{ producto_id: "", cantidad: 1 }],
        });
      } catch (error) {
        console.error("Error parsing user data", error);
        toast.error("Error al cargar la información del usuario");
        handleClose();
      }
    }
  }, [open, handleClose]);

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
      // Validar que todos los campos estén completos
      if (!pedido.direccion_envio) {
        toast.error("Debe ingresar una dirección de envío");
        return;
      }

      // Validar que todos los productos tengan un producto seleccionado
      const hasEmptyProducts = pedido.detalles.some(
        (detalle) => !detalle.producto_id
      );
      if (hasEmptyProducts) {
        toast.error("Todos los productos deben estar seleccionados");
        return;
      }

      // Preparar los datos para enviar al backend
      const pedidoData = {
        usuario_id: pedido.usuario_id,
        direccion_envio: pedido.direccion_envio,
        estado: pedido.estado,
        productos: pedido.detalles.map((detalle) => ({
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
        })),
      };

      const response = await PedidoService.crearPedido(pedidoData);
      
      localStorage.setItem("ultimoPedidoId", response.data.id);
      console.log("Último pedido creado:", response.data.id);
      toast.success("Pedido creado con éxito");
      refreshPedidos();
      handleClose();
    } catch (error) {
      console.error("Error al guardar el pedido", error);
      toast.error("Error al crear el pedido");
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
                  required
                >
                  <MenuItem value="">
                    <em>Seleccione un producto</em>
                  </MenuItem>
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
                  required
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
