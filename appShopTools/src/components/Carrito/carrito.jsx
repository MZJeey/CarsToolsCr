import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { useCart } from "../../hooks/useCart";

CartItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
};

// Estilos de Tabla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function CartItem({ item, removeItem }) {
  // Calcular valores para mostrar
  const precioUnitario = Number(item.precio || item.price || 0);

  const cantidad = item.cantidad || item.quantity || 0;
  const subtotalSinImpuesto = precioUnitario * cantidad;
  const montoImpuesto = (subtotalSinImpuesto * (item.impuesto || 0)) / 100;
  const subtotalConImpuesto = subtotalSinImpuesto + montoImpuesto;

  return (
    <StyledTableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <StyledTableCell component="th" scope="row">
        {item.nombre}
      </StyledTableCell>
      <StyledTableCell>
        ₡{precioUnitario.toFixed(2)}
        {item.impuesto > 0 && (
          <Typography variant="caption" display="block" color="text.secondary">
            Incluye {item.impuesto}% impuesto
          </Typography>
        )}
      </StyledTableCell>
      <StyledTableCell>{cantidad}</StyledTableCell>
      <StyledTableCell>
        ₡{subtotalConImpuesto.toFixed(2)}
        {item.impuesto > 0 && (
          <Typography variant="caption" display="block" color="text.secondary">
            (₡{subtotalSinImpuesto.toFixed(2)} + ₡{montoImpuesto.toFixed(2)}{" "}
            impuesto)
          </Typography>
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        <Tooltip title={"Borrar " + item.nombre}>
          <IconButton
            color="warning"
            onClick={() => removeItem(item)}
            aria-label={"Borrar " + item.nombre}
            sx={{ ml: "auto" }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}

export function Cart() {
  const { cart, removeItem, cleanCart, getTotal } = useCart();

  // Calcular total con impuestos
  const total = cart.reduce((sum, item) => {
    const precio = item.precio || item.price || 0;
    const cantidad = item.cantidad || item.quantity || 0;
    const impuesto = item.impuesto || 0;
    return sum + precio * cantidad * (1 + impuesto / 100);
  }, 0);

  return (
    <>
      <Tooltip title="Vaciar carrito">
        <IconButton
          color="error"
          onClick={() => cleanCart()}
          aria-label="Vaciar carrito"
          sx={{ ml: "auto" }}
        >
          <RemoveShoppingCartIcon />
        </IconButton>
      </Tooltip>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="carrito de compras">
          <TableHead>
            <TableRow>
              <StyledTableCell>Producto</StyledTableCell>
              <StyledTableCell>Precio Unitario</StyledTableCell>
              <StyledTableCell>Cantidad</StyledTableCell>
              <StyledTableCell>Subtotal</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} removeItem={removeItem} />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan={3} align="right">
                <Typography variant="subtitle1" gutterBottom>
                  Total
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={2}>
                <Typography variant="subtitle1" gutterBottom>
                  ₡{total.toFixed(2)}
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
