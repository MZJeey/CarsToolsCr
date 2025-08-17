import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const formatCRC = (n) =>
  n != null ? `₡${Number(n).toLocaleString("es-CR")}` : "-";

// Soporta JSON string o array
// const parseOpciones = (raw) => {
//   if (!raw) return [];
//   const data = typeof raw === "string" ? JSON.parse(raw) : raw;
//   if (Array.isArray(data)) return data; // [{criterio, opcion, costo, ...}]
//   // Si viniera como objeto legacy {criterio:{opcion,costo}}
//   return Object.entries(data).map(([criterio, v]) => ({
//     criterio,
//     opcion: v?.opcion ?? "?",
//     costo: Number(v?.costo || 0),
//   }));
// };

// Soporta JSON string, array y objetos legacy.
// Convierte {grupo,label,costo} a {criterio,opcion,costo}.
// Reemplaza tu parseOpciones por este:
const parseOpciones = (raw) => {
  if (!raw) return [];

  let data = raw;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }

  if (data == null) return [];

  const norm = (o = {}) => ({
    criterio: o.criterio ?? o.grupo ?? "Opción",
    opcion: o.opcion ?? o.label ?? "",
    costo: Number(o.costo ?? 0),
  });

  // Caso ideal: ya es array
  if (Array.isArray(data)) return data.map(norm);

  // Si viene como objeto:
  if (typeof data === "object") {
    // a) { opciones: [...] }
    if (Array.isArray(data.opciones)) return data.opciones.map(norm);

    // b) legacy: { "Color": {opcion,costo}, "Material": {...} }
    return Object.entries(data).map(([criterio, v]) =>
      norm({ criterio, ...v })
    );
  }

  return [];
};

const TodosProductosPersonalizados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openPersonalizarModal, setOpenPersonalizarModal] = useState(false);

  const cargarLista = useCallback(() => {
    setLoading(true);
    ProductoPersonalizadoService.obtenerTodos()
      .then((res) => setProductos(res.data || []))
      .catch((err) => {
        console.error("Error al cargar productos personalizados", err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cargarLista();
  }, [cargarLista]);

  const handleRowClick = (producto) => {
    setSelectedProduct(producto);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const handleOpenPersonalizar = () => setOpenPersonalizarModal(true);
  const handleClosePersonalizar = () => setOpenPersonalizarModal(false);

  // 👉 Recibe la "línea" desde el modal y guarda
  const handleConfirmPersonalizado = async (linea) => {
    try {
      await ProductoPersonalizadoService.crearProductosPersonalizados(id, [
        linea,
      ]);

      console.log("Personalizado guardado", id, linea);
      handleClosePersonalizar();
      cargarLista();
    } catch (e) {
      console.error("No se pudo guardar el personalizado", e);
      alert("No se pudo guardar el personalizado");
    }
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Todos los Productos Personalizados
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#468B94",
            "&:hover": { backgroundColor: "#3b747c" },
          }}
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
            {productos.map((item) => {
              const opciones = parseOpciones(
                item.opciones_personalizacion ??
                  item.opciones_personalizacion_json
              );

              return (
                <TableRow
                  key={item.id_personalizado}
                  hover
                  onClick={() => handleRowClick(item)}
                >
                  <TableCell>{item.pedido_id ?? "-"}</TableCell>
                  <TableCell>{item.nombre_personalizado ?? "-"}</TableCell>
                  <TableCell>{item.nombre_producto_base ?? "-"}</TableCell>
                  <TableCell>{formatCRC(item.costo_base)}</TableCell>
                  <TableCell>
                    {opciones.length ? (
                      opciones.map((o, idx) => (
                        <Chip
                          key={idx}
                          label={`${o.criterio}: ${o.opcion} (+${formatCRC(o.costo)})`}
                          sx={{ m: 0.3 }}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Chip label="Sin personalizaciones" color="warning" />
                    )}
                  </TableCell>
                  <TableCell>{formatCRC(item.costo_adicional)}</TableCell>
                  <TableCell>{formatCRC(item.precio_unitario)}</TableCell>
                  <TableCell>{item.cantidad ?? "-"}</TableCell>
                  <TableCell>{formatCRC(item.subtotal)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* Detalle fila */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          Detalle del Producto Personalizado
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Box sx={{ lineHeight: 1.8 }}>
              <Typography>
                <Label>Nombre:</Label> {selectedProduct.nombre_personalizado}
              </Typography>
              <Typography>
                <Label>Producto Base:</Label>{" "}
                {selectedProduct.nombre_producto_base}
              </Typography>
              <Typography>
                <Label>Base ₡:</Label> {formatCRC(selectedProduct.costo_base)}
              </Typography>
              <Typography>
                <Label>Adicional ₡:</Label>{" "}
                {formatCRC(selectedProduct.costo_adicional)}
              </Typography>
              <Typography>
                <Label>Precio Unitario ₡:</Label>{" "}
                {formatCRC(selectedProduct.precio_unitario)}
              </Typography>
              <Typography>
                <Label>Cantidad:</Label> {selectedProduct.cantidad}
              </Typography>
              <Typography>
                <Label>Subtotal ₡:</Label> {formatCRC(selectedProduct.subtotal)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Personalizaciones:
              </Typography>
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap" }}>
                {parseOpciones(selectedProduct.opciones_personalizacion).map(
                  (o, idx) => (
                    <Chip
                      key={idx}
                      label={`${o.criterio}: ${o.opcion} (+${formatCRC(o.costo)})`}
                      sx={{ m: 0.3 }}
                      color="secondary"
                      variant="outlined"
                    />
                  )
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained">
            CERRAR
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para crear */}
      <PersonalizarProductoModal
        open={openPersonalizarModal}
        onClose={handleClosePersonalizar}
        onConfirm={handleConfirmPersonalizado}
        pedidoId={id}
      />
    </Box>
  );
};

export default TodosProductosPersonalizados;
