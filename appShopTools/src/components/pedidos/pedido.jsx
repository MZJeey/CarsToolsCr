import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Button,
  Paper,
  Tooltip,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add as AddIcon,
  Close as CloseIcon,
  Print as PrintIcon,
} from "@mui/icons-material";
import PedidoService from "../../services/PedidoService";
import CrearPedidoModal from "./crearPedido";
import { toast } from "react-hot-toast";

const FacturaDialog = ({ pedido, open, onClose }) => {
  if (!pedido) return null;

  const parseOpcionesPersonalizacion = (opciones) => {
    try {
      if (!opciones) return [];
      if (Array.isArray(opciones)) return opciones;
      if (typeof opciones === "string") {
        const parsed = JSON.parse(opciones);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      if (typeof opciones === "object") {
        if (opciones.color || opciones.estilo) {
          return Object.entries(opciones).map(([key, value]) => ({
            criterio: key,
            opcion: value.opcion,
            costo: value.costo,
          }));
        }
        return [opciones];
      }
      return [];
    } catch (e) {
      console.error("Error al parsear opciones:", e);
      return [];
    }
  };

  const calcularTotales = () => {
    let subtotal = 0;
    let impuestos = 0;

    if (pedido.detalles && pedido.detalles.nombre_producto) {
      const cantidad = Number(pedido.detalles.cantidad || 0);
      const precio = Number(pedido.detalles.precio_unitario || 0);
      const porcentaje = Number(pedido.detalles.porcentaje || 0);

      subtotal += cantidad * precio;
      impuestos += (cantidad * precio * porcentaje) / 100;
    }

    if (pedido.detalles && pedido.detalles.productos) {
      pedido.detalles.productos.forEach((producto) => {
        const cantidad = Number(producto.cantidad || 0);
        const precio = Number(
          producto.precio_unitario || producto.costo_base || 0
        );
        const porcentaje = Number(producto.porcentaje || 0);

        subtotal += cantidad * precio;
        impuestos += (cantidad * precio * porcentaje) / 100;
      });
    }

    return {
      subtotal,
      impuestos,
      total: subtotal + impuestos,
    };
  };

  const { subtotal, impuestos, total } = calcularTotales();

  const renderOpcionesPersonalizacion = (opciones) => {
    const parsed = parseOpcionesPersonalizacion(opciones);
    if (!parsed || parsed.length === 0) return "Sin personalización";

    return parsed.map((opcion, i) => (
      <div key={i}>
        <strong>{opcion.criterio || "Opción"}:</strong> {opcion.opcion}
        {opcion.costo && ` (+₡${Number(opcion.costo).toFixed(2)})`}
      </div>
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Factura del Pedido N° {pedido.id}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Paper elevation={0} sx={{ p: 3, fontFamily: "Arial, sans-serif" }}>
          <Box mb={4} textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              FACTURA COMERCIAL
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Número: #{pedido.id}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Fecha:{" "}
              {new Date(pedido.fecha_pedido).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>

          <Grid container spacing={4} mb={4}>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                DATOS DEL CLIENTE
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                <strong>Cliente:</strong> {pedido.nombre_usuario}
              </Typography>
              <Typography variant="body1">
                <strong>Dirección:</strong> {pedido.direccion_envio}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                INFORMACIÓN DEL PAGO
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                <strong>Método de pago:</strong>{" "}
                {pedido.metodo_pago || "No especificado"}
              </Typography>
              <Typography variant="body1">
                <strong>Estado:</strong>{" "}
                <Chip
                  label={(pedido.estado || "desconocido")
                    .replace("_", " ")
                    .toUpperCase()}
                  color={
                    pedido.estado === "entregado"
                      ? "success"
                      : pedido.estado === "pagado"
                        ? "info"
                        : "warning"
                  }
                  size="small"
                />
              </Typography>
            </Grid>
          </Grid>

          <Box mb={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              DETALLE DE PRODUCTOS
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Personalización
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Cantidad
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    P. Unitario
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Impuesto
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Subtotal
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedido.detalles && pedido.detalles.nombre_producto && (
                  <TableRow>
                    <TableCell>{pedido.detalles.nombre_producto}</TableCell>
                    <TableCell>Producto estándar</TableCell>
                    <TableCell align="right">
                      {pedido.detalles.cantidad || 0}
                    </TableCell>
                    <TableCell align="right">
                      ₡{Number(pedido.detalles.precio_unitario || 0).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {pedido.detalles.porcentaje || 0}%
                    </TableCell>
                    <TableCell align="right">
                      ₡
                      {(
                        Number(pedido.detalles.cantidad || 0) *
                        Number(pedido.detalles.precio_unitario || 0)
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}

                {pedido.detalles?.productos?.map((producto, index) => {
                  const precio = Number(
                    producto.precio_unitario || producto.costo_base || 0
                  );
                  const cantidad = Number(producto.cantidad || 0);
                  const porcentaje = Number(producto.porcentaje || 0);
                  const subtotal = precio * cantidad;
                  const impuesto = (subtotal * porcentaje) / 100;

                  return (
                    <TableRow key={`personalizado-${index}`}>
                      <TableCell>
                        {producto.nombre_personalizado ||
                          producto.nombre_producto_base ||
                          "Producto personalizado"}
                      </TableCell>
                      <TableCell>
                        {renderOpcionesPersonalizacion(
                          producto.opciones_personalizacion
                        )}
                      </TableCell>
                      <TableCell align="right">{cantidad}</TableCell>
                      <TableCell align="right">₡{precio.toFixed(2)}</TableCell>
                      <TableCell align="right">{porcentaje}%</TableCell>
                      <TableCell align="right">
                        ₡{subtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>

          <Box textAlign="right" mt={4}>
            <Typography variant="body1">
              <strong>Subtotal:</strong> ₡{subtotal.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              <strong>Impuestos:</strong> ₡{impuestos.toFixed(2)}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
              TOTAL: ₡{total.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          sx={{ mr: 2 }}
        >
          Imprimir Factura
        </Button>
        <Button variant="contained" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PedidoComponent = () => {
  const [pedidos, setPedidos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [openFactura, setOpenFactura] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const fetchTodosLosPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userFromStorage = localStorage.getItem("userData");
   
      if (!userFromStorage) {
        toast.error("Debes iniciar sesión para continuar");
        return;
      }
      

      const parsedUser = JSON.parse(userFromStorage);
       console.log("Datos del usuario---->", parsedUser);



      setUserInfo(parsedUser);
      const response = await PedidoService.listarTodosLosPedidos(parsedUser.id);

      const pedidosConEstado = response.data.map((pedido) => ({
        ...pedido,
        estado: pedido.estado || "en_proceso",
        nombre_usuario: pedido.nombre_usuario || "Cliente desconocido",
        direccion_envio: pedido.direccion_envio || "Dirección no especificada",
        detalles: pedido.detalles || {},
      }));
      setPedidos(pedidosConEstado);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      setError("Error al cargar los pedidos. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodosLosPedidos();
  }, [fetchTodosLosPedidos]);

  const handleVerFactura = (pedido) => {
    setSelectedPedido(pedido);
    setOpenFactura(true);
  };

  const estadoOrden = {
    en_proceso: 0,
    pagado: 1,
    entregado: 2,
  };
  const pedidosOrdenados = [...pedidos].sort(
    (a, b) => (estadoOrden[a.estado] ?? 99) - (estadoOrden[b.estado] ?? 99)
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchTodosLosPedidos}>
          Reintentar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <CrearPedidoModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        refreshPedidos={fetchTodosLosPedidos}
      />

      <FacturaDialog
        pedido={selectedPedido}
        open={openFactura}
        onClose={() => setOpenFactura(false)}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Gestión de Pedidos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          startIcon={<AddIcon />}
          sx={{ fontWeight: "bold" }}
        >
          Nuevo Pedido
        </Button>
      </Box>

      {pedidosOrdenados.length > 0 ? (
        <Paper elevation={3} sx={{ overflow: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>N° Pedido</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosOrdenados.map((pedido) => {
                const total = pedido.detalles
                  ? pedido.detalles.nombre_producto
                    ? Number(pedido.detalles.cantidad || 0) *
                      Number(pedido.detalles.precio_unitario || 0) *
                      (1 + Number(pedido.detalles.porcentaje || 0) / 100)
                    : pedido.detalles.productos?.reduce(
                        (sum, item) =>
                          sum +
                          Number(item.precio_unitario || item.costo_base || 0) *
                            Number(item.cantidad || 0) *
                            (1 + Number(item.porcentaje || 0) / 100),
                        0
                      ) || 0
                  : 0;

                return (
                  <TableRow
                    key={pedido.id}
                    hover
                    onClick={() => handleVerFactura(pedido)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{pedido.id}</TableCell>
                    <TableCell>
                      {new Date(pedido.fecha_pedido).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>{pedido.nombre_usuario}</TableCell>
                    <TableCell>
                      <Chip
                        label={(pedido.estado || "desconocido")
                          .replace("_", " ")
                          .toUpperCase()}
                        color={
                          pedido.estado === "entregado"
                            ? "success"
                            : pedido.estado === "pagado"
                              ? "info"
                              : "warning"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar pedido">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            // Lógica para editar
                          }}
                          color="primary"
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar pedido">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            // Lógica para eliminar
                          }}
                          color="error"
                          size="small"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No hay pedidos registrados
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            Crear primer pedido
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default PedidoComponent;
