import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,{ tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useCart } from '../../hooks/useCart';
CartItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
};
//Estilo de Tabla
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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
function CartItem({ item, removeItem }) {
  return (
    <StyledTableRow
      key={item.id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <StyledTableCell component="th" scope="row">
        {item.title}
      </StyledTableCell>
      <StyledTableCell>{item.price}</StyledTableCell>
      <StyledTableCell>{item.days}</StyledTableCell>
      <StyledTableCell>&cent;{item.subtotal}</StyledTableCell>
      <StyledTableCell align="right">
        <Tooltip title={'Borrar ' + item.title}>
          <IconButton
            color="warning"
            onClick={() => removeItem(item)}
            aria-label={'Borrar ' + item.title}
            sx={{ ml: 'auto' }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}

//Detalle Compra
export function Cart() {
  const {cart, removeItem, cleanCart, getTotal}=useCart()
  return (
    <>
      <Tooltip title="Eliminar Alquiler">
        <IconButton
          color="error"
         /*  Onclick para eliminar */
         onClick={()=>cleanCart()}

          aria-label="Eliminar"
          sx={{ ml: 'auto' }}
        >
          <RemoveShoppingCartIcon />
        </IconButton>
      </Tooltip>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
          >
            <TableRow>
              <StyledTableCell>Pelicula</StyledTableCell>
              <StyledTableCell>Precio</StyledTableCell>
              <StyledTableCell>Días</StyledTableCell>
              <StyledTableCell>Subtotal</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Lista de lineas de detalle de la compra */}
            {cart.map((row)=>(
              <CartItem key={row.id}
                item={row}
                removeItem={()=>removeItem(row)}
                {...row}
              />
            ))}

          </TableBody>
          <TableFooter
          >
            <TableRow>
              <StyledTableCell colSpan={3} align="right">
                <Typography variant="subtitle1" gutterBottom>
                  Total
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={2}>
                <Typography variant="subtitle1" gutterBottom>
                  {/* Mostrar total */}
                 &cent;{getTotal(cart)}
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
