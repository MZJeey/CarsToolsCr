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

const PedidoComponent = () => {
  const [pedidos, setPedidos] = useState([]);
  const [rolUsuario, setRolUsuario] = useState("admin");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [openFactura, setOpenFactura] = useState(false);

  // Obtener pedidos
  const fetchTodosLosPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PedidoService.listarTodosLosPedidos();
      setPedidos(response.data);
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

  // Manejar selección de pedido para ver factura
  const handleVerFactura = (pedido) => {
    setSelectedPedido(pedido);
    setOpenFactura(true);
  };

  // Componente de Factura
  const FacturaDialog = ({ pedido, onClose }) => {
    if (!pedido || !pedido.detalles) return null;

    // Calcular subtotales y total
    const productosConSubtotal = pedido.detalles.map((detalle) => ({
      ...detalle,
      subtotal: Number(detalle.cantidad) * Number(detalle.precio_unitario),
    }));

    const total = productosConSubtotal.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    return (
      <Dialog open={openFactura} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Factura del Pedido N°{""} {pedido.id}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Paper elevation={0} sx={{ p: 3, fontFamily: "Arial, sans-serif" }}>
            {/* Encabezado de la Factura */}
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
              {/* Información del Cliente */}
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

              {/* Estado del Pedido */}
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  ESTADO DEL PEDIDO
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Chip
                  label={pedido.estado.replace("_", " ").toUpperCase()}
                  color={
                    pedido.estado === "entregado"
                      ? "success"
                      : pedido.estado === "pagado"
                        ? "info"
                        : "warning"
                  }
                  sx={{ fontSize: "1rem", padding: "8px 12px" }}
                />
              </Grid>
            </Grid>

            {/* Detalle de Productos */}
            <Box mb={4}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                DETALLE DE PRODUCTOS
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Producto</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Cantidad
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      P. Unitario
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Subtotal
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosConSubtotal.map((producto, index) => (
                    <TableRow key={index}>
                      <TableCell>Producto {producto.nombre_producto}</TableCell>
                      <TableCell align="right">{producto.cantidad}</TableCell>
                      <TableCell align="right">
                        ₡{Number(producto.precio_unitario).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ₡{producto.subtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* Totales */}
            <Box textAlign="right" mt={4}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
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

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <CrearPedidoModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        refreshPedidos={fetchTodosLosPedidos}
      />

      <FacturaDialog
        pedido={selectedPedido}
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

      {pedidos.length > 0 ? (
        <Paper elevation={3} sx={{ overflow: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Número pedido</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>

                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => {
                // Calcular el total del pedido
                const total = pedido.detalles
                  ? pedido.detalles.reduce(
                      (sum, item) =>
                        sum +
                        Number(item.cantidad) * Number(item.precio_unitario),
                      0
                    )
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
                    <TableCell> {pedido.nombre_usuario}</TableCell>

                    <TableCell>
                      <Tooltip title="Editar pedido">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            // Lógica para editar
                          }}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar pedido">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            // Lógica para eliminar
                          }}
                          color="error"
                        >
                          <Delete />
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
