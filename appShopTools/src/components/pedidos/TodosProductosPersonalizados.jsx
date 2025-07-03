import React, { useEffect, useState } from "react";
import ProductoPersonalizadoService from "../../services/ProductoPersonalizadoService";
import PersonalizarProductoModal from "../../components/pedidos/PersonalizarProducto";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableHeader = styled(TableCell)({
  fontWeight: "bold",
  backgroundColor: "#1976d2",
  color: "#fff",
});

const Label = styled("span")({
  fontWeight: "bold",
  display: "inline-block",
  minWidth: 140,
});

const TodosProductosPersonalizados = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openPersonalizarModal, setOpenPersonalizarModal] = useState(false);
  const [formValues, setFormValues] = useState({
    nombre_personalizado: "",
    producto_base: "",
    color: "",
    estilo: "",
    marca: "",
    cantidad: 1,
    costo_base: 0,
    metodo_pago: "",
  });

  useEffect(() => {
    ProductoPersonalizadoService.obtenerTodos()
      .then((res) => {
        setProductos(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar productos personalizados", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleRowClick = (producto) => {
    setSelectedProduct(producto);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const handleOpenPersonalizar = () => {
    setOpenPersonalizarModal(true);
  };

  const handleClosePersonalizar = () => {
    setOpenPersonalizarModal(false);
    setSelectedProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    console.log("Formulario enviado:", formValues);
    // Lógica de guardado
    handleClosePersonalizar();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Todos los Productos Personalizados
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#468B94", '&:hover': { backgroundColor: "#3b747c" } }}
          onClick={handleOpenPersonalizar}
        >
          + PERSONALIZAR PRODUCTO
        </Button>
      </Box>

      <Paper elevation={4} sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableHeader>Pedido</StyledTableHeader>
              <StyledTableHeader>Nombre Personalizado</StyledTableHeader>
              <StyledTableHeader>Producto Base</StyledTableHeader>
              <StyledTableHeader>Base ₡</StyledTableHeader>
              <StyledTableHeader>Personalizaciones</StyledTableHeader>
              <StyledTableHeader>Adicional ₡</StyledTableHeader>
              <StyledTableHeader>Unitario ₡</StyledTableHeader>
              <StyledTableHeader>Cantidad</StyledTableHeader>
              <StyledTableHeader>Subtotal ₡</StyledTableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((item) => (
              <TableRow key={item.id_personalizado} hover onClick={() => handleRowClick(item)}>
                <TableCell>{item.pedido_id ?? "-"}</TableCell>
                <TableCell>{item.nombre_personalizado ?? "-"}</TableCell>
                <TableCell>{item.nombre_producto_base ?? "-"}</TableCell>
                <TableCell>
                  {item.costo_base != null ? `₡${item.costo_base.toLocaleString()}` : "-"}
                </TableCell>
                <TableCell>
                  {item.opciones_personalizacion ? (
                    Object.entries(
                      typeof item.opciones_personalizacion === "string"
                        ? JSON.parse(item.opciones_personalizacion)
                        : item.opciones_personalizacion
                    ).map(([criterio, opcion], idx) => (
                      <Chip
                        key={idx}
                        label={`${criterio}: ${opcion.opcion ?? "?"} (+₡${opcion.costo ?? 0})`}
                        sx={{ m: 0.3 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Chip label="Sin personalizaciones" color="warning" />
                  )}
                </TableCell>
                <TableCell>
                  {item.costo_adicional != null ? `₡${item.costo_adicional.toLocaleString()}` : "-"}
                </TableCell>
                <TableCell>
                  {item.precio_unitario != null ? `₡${item.precio_unitario.toLocaleString()}` : "-"}
                </TableCell>
                <TableCell>{item.cantidad ?? "-"}</TableCell>
                <TableCell>
                  {item.subtotal != null ? `₡${item.subtotal.toLocaleString()}` : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Detalle del Producto Personalizado
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Box sx={{ lineHeight: 1.8 }}>
              <Typography><Label>Nombre:</Label> {selectedProduct.nombre_personalizado}</Typography>
              <Typography><Label>Producto Base:</Label> {selectedProduct.nombre_producto_base}</Typography>
              <Typography><Label>Base ₡:</Label> ₡{selectedProduct.costo_base?.toLocaleString() ?? '-'}</Typography>
              <Typography><Label>Adicional ₡:</Label> ₡{selectedProduct.costo_adicional?.toLocaleString() ?? '-'}</Typography>
              <Typography><Label>Precio Unitario ₡:</Label> ₡{selectedProduct.precio_unitario?.toLocaleString() ?? '-'}</Typography>
              <Typography><Label>Cantidad:</Label> {selectedProduct.cantidad}</Typography>
              <Typography><Label>Subtotal ₡:</Label> ₡{selectedProduct.subtotal?.toLocaleString() ?? '-'}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold">Personalizaciones:</Typography>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap' }}>
                {selectedProduct.opciones_personalizacion && Object.entries(
                  typeof selectedProduct.opciones_personalizacion === 'string'
                    ? JSON.parse(selectedProduct.opciones_personalizacion)
                    : selectedProduct.opciones_personalizacion
                ).map(([criterio, opcion], idx) => (
                  <Chip
                    key={idx}
                    label={`${criterio}: ${opcion.opcion ?? '?'} (+₡${opcion.costo ?? 0})`}
                    sx={{ m: 0.3 }}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained">CERRAR</Button>
        </DialogActions>
      </Dialog>

      <PersonalizarProductoModal
        open={openPersonalizarModal}
        onClose={handleClosePersonalizar}
        formValues={formValues}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      />
    </Box>
  );
};

export default TodosProductosPersonalizados;
