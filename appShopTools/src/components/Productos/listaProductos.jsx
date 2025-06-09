import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  // Obtener productos desde la API
  const fetchProductos = async () => {
    try {
      const res = await fetch("/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
    // Aquí puedes abrir un modal o navegar al formulario con los datos del producto
    console.log("Editar producto:", producto);
  };

  const handleEliminar = (producto) => {
    setProductoSeleccionado(producto);
    setConfirmarEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      await fetch(`/api/productos/${productoSeleccionado.id}`, {
        method: "DELETE",
      });
      setConfirmarEliminar(false);
      fetchProductos(); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar producto", error);
    }
  };

  return (
    <>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Lista de Productos
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.nombre}</TableCell>
                <TableCell>₡{prod.precio.toFixed(2)}</TableCell>
                <TableCell>{prod.stock}</TableCell>
                <TableCell>{prod.categoria}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditar(prod)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleEliminar(prod)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={confirmarEliminar}
        onClose={() => setConfirmarEliminar(false)}
      >
        <DialogTitle>¿Eliminar producto?</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar{" "}
          <strong>{productoSeleccionado?.nombre}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmarEliminar(false)}>Cancelar</Button>
          <Button color="error" onClick={confirmarEliminacion}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
