import React, { useEffect, useState } from 'react';
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
  TextField,
  MenuItem,
  Paper,
  Tooltip,
  Chip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import PedidoService from '../../services/PedidoService';
import CrearPedidoModal from './crearPedido'; 

const PedidoComponent = () => {
  const [pedidos, setPedidos] = useState([]);
  const [rolUsuario, setRolUsuario] = useState('cliente'); 
  const [openModal, setOpenModal] = useState(false); 

  useEffect(() => {
    fetchTodosLosPedidos();
  }, []);

  const fetchTodosLosPedidos = async () => {
    try {
      const response = await PedidoService.listarTodosLosPedidos();
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  const handleActualizarPedido = async (pedidoActualizado) => {
    try {
      await PedidoService.actualizarPedido(pedidoActualizado.pedido_id, pedidoActualizado);
      fetchTodosLosPedidos();
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
    }
  };

  const handleEliminarPedido = async (pedidoId) => {
    try {
      await PedidoService.eliminarPedido(pedidoId);
      fetchTodosLosPedidos();
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  const groupedPedidos = pedidos.reduce((acc, pedido) => {
    if (!acc[pedido.pedido_id]) acc[pedido.pedido_id] = [];
    acc[pedido.pedido_id].push(pedido);
    return acc;
  }, {});

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {}
      <CrearPedidoModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        refreshPedidos={fetchTodosLosPedidos}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Gestión de Pedidos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          sx={{ fontWeight: 'bold', backgroundColor: '#438892' }}
        >
          + Nuevo Pedido
        </Button>
      </Box>

      {Object.keys(groupedPedidos).length > 0 ? (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pedido</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedPedidos).map(([pedidoId, detalles]) => {
                const pedido = detalles[0];
                const total = detalles.reduce(
                  (acc, item) => acc + item.cantidad * item.precio_unitario,
                  0
                );

                return (
                  <TableRow key={pedidoId}>
                    <TableCell># {pedidoId}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="standard"
                        value={pedido.direccion_envio}
                        onChange={(e) => {
                          pedido.direccion_envio = e.target.value;
                          setPedidos([...pedidos]);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {rolUsuario === 'admin' ? (
                        <TextField
                          select
                          variant="standard"
                          value={pedido.estado}
                          onChange={(e) => {
                            pedido.estado = e.target.value;
                            setPedidos([...pedidos]);
                          }}
                        >
                          <MenuItem value="en_proceso">En proceso</MenuItem>
                          <MenuItem value="pagado">Pagado</MenuItem>
                          <MenuItem value="entregado">Entregado</MenuItem>
                        </TextField>
                      ) : (
                        <Chip
                          label={pedido.estado}
                          color={
                            pedido.estado === 'entregado'
                              ? 'success'
                              : pedido.estado === 'pagado'
                              ? 'info'
                              : 'warning'
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell>{new Date(pedido.fecha_pedido).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {detalles.map((d, i) => (
                        <Box key={i} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            {d.nombre_producto} - ₡{parseFloat(d.precio_unitario).toFixed(2)} x
                            <TextField
                              value={d.cantidad}
                              onChange={(e) => {
                                d.cantidad = parseInt(e.target.value);
                                setPedidos([...pedidos]);
                              }}
                              type="number"
                              size="small"
                              sx={{ width: 60, ml: 1 }}
                              inputProps={{ min: 1 }}
                            />
                          </Typography>
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#0284c7' }}>
                      ₡{total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Guardar Cambios">
                        <IconButton
                          onClick={() => handleActualizarPedido(pedido)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar Pedido">
                        <IconButton
                          onClick={() => handleEliminarPedido(pedido.pedido_id)}
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
        <Typography>No hay pedidos registrados.</Typography>
      )}
    </Container>
  );
};

export default PedidoComponent;
