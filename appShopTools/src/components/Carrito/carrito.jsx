// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import TableFooter from "@mui/material/TableFooter";
// import Paper from "@mui/material/Paper";
// import IconButton from "@mui/material/IconButton";
// import DeleteIcon from "@mui/icons-material/Delete";
// import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
// import Tooltip from "@mui/material/Tooltip";
// import Typography from "@mui/material/Typography";
// import PropTypes from "prop-types";
// import { styled } from "@mui/material/styles";
// import { useCart } from "../../hooks/useCart";
// import TextField from "@mui/material/TextField";
// import { Box } from "@mui/material";
// import Button from "@mui/material/Button";
// import { useState } from "react";
// import { ProcesarPago } from "../Carrito/Pagar";



// CartItem.propTypes = {
//   item: PropTypes.object,
//   removeItem: PropTypes.func,
//   updateQuantity: PropTypes.func,
// };
// //Estilo de Tabla
// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.primary.light,
//     color: theme.palette.common.white,
//     fontSize: 16,
//     // Forzar estilo incluso con align="right"
//     '&[align="right"]': {
//       backgroundColor: theme.palette.primary.light,
//       color: theme.palette.common.white,
//     },
//   },
//   [`&.${tableCellClasses.footer}`]: {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.white,
//     fontSize: 16,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));
// function CartItem({ item, removeItem, updateQuantity }) {
//   const baseUrl = import.meta.env.VITE_BASE_URL.replace(/\/$/, "") + "/uploads";

//   console.log("Imagenes disponibles:", item.imagen);
//   return (
//     <StyledTableRow
//       key={item.id}
//       sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//     >
//       <StyledTableCell component="th" scope="row">
//         {item.nombre}
//       </StyledTableCell>
//       <StyledTableCell>
//         <img
//           src={
//             item.imagen && item.imagen.length > 0
//               ? `${baseUrl}/${item.imagen[0].imagen}`
//               : "/placeholder.png"
//           }
//           alt={item.nombre}
//           style={{ width: 100 }}
//         />
//       </StyledTableCell>
//       <StyledTableCell>
//         {Number(item.precio).toFixed(2)} {/* Muestra 2 decimales */}
//       </StyledTableCell>
//       <StyledTableCell>
//         <TextField
//           value={item.cantidad}
//           fullWidth
//           type="number"
//           variant="outlined"
//           size="medium"
//           inputProps={{ min: 1, step: 1 }}
//           onChange={(e) => {
//             const newQuantity = parseInt(e.target.value);
//             if (!isNaN(newQuantity)) {
//               updateQuantity(item, newQuantity);
//             }
//           }}
//         />
//       </StyledTableCell>
//       <StyledTableCell>&cent;{item.subtotal}</StyledTableCell>
//       <StyledTableCell align="right">
//         <Tooltip title={"Borrar " + item.nombre}>
//           <IconButton
//             color="warning"
//             onClick={() => removeItem(item)}
//             aria-label={"Borrar " + item.nombre}
//             sx={{ ml: "auto" }}
//           >
//             <DeleteIcon />
//           </IconButton>
//         </Tooltip>
//       </StyledTableCell>
//     </StyledTableRow>
//   );
// }

// //Detalle Compra
// export function Cart() {
//   const { cart, removeItem, cleanCart, getTotal, updateQuantity } = useCart();
//   const [openDialog, setOpenDialog] = useState(false);
//   const [userInfo, setUserInfo] = useState(() => {
//     // Obtener info del usuario desde localStorage al cargar el componente
//     const storedUser = localStorage.getItem("userInfo");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const handleOpenDialog = () => setOpenDialog(true);
//   const handleCloseDialog = () => setOpenDialog(false);
//   return (
//     <>
//       <Tooltip title="Eliminar producto">
//         <IconButton
//           color="error"
//           /*  Onclick para eliminar */
//           onClick={() => cleanCart()}
//           aria-label="Eliminar"
//           sx={{ ml: "auto" }}
//         >
//           <RemoveShoppingCartIcon />
//         </IconButton>
//       </Tooltip>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <StyledTableCell>Producto</StyledTableCell>
//               <StyledTableCell>Imagen</StyledTableCell>
//               <StyledTableCell>Precio</StyledTableCell>
//               <StyledTableCell>Cantidad</StyledTableCell>
//               <StyledTableCell>Subtotal</StyledTableCell>
//               <StyledTableCell sx={{ textAlign: "right" }}>
//                 Acciones
//               </StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {/* Lista de lineas de detalle de la compra */}
//             {cart.map((row) => (
//               <CartItem
//                 key={row.id}
//                 item={row}
//                 removeItem={() => removeItem(row)}
//                 updateQuantity={(item, qty) => updateQuantity(item, qty)}
//               />
//             ))}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <StyledTableCell colSpan={4} align="right">
//                 <Typography variant="subtitle1" gutterBottom>
//                   Total
//                 </Typography>
//               </StyledTableCell>
//               <StyledTableCell colSpan={2}>
//                 <Typography variant="subtitle1" gutterBottom>
//                   &cent;{getTotal(cart)}
//                 </Typography>
//               </StyledTableCell>
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </TableContainer>
//       <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpenDialog}
//           disabled={cart.length === 0}
//         >
//           Procesar Pago
//         </Button>
//       </Box>

//       {/* **Diálogo de Procesar Pago** */}
//       <ProcesarPago
//         open={openDialog}
//         onClose={handleCloseDialog}
//         userInfo={userInfo} // Pasamos userInfo desde localStorage
//       />
//     </>
//   );
// }



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
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";

// ✅ Reactiva el confirm
import { ProcesarPago } from "../Carrito/Pagar";

// ✅ Modal de forma de pago (deja tu ruta tal cual)
import FormaPagoModal from "../pedidos/fomaPagoModal";

CartItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
  updateQuantity: PropTypes.func,
};

// Estilos de la tabla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontSize: 16,
    '&[align="right"]': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
  },
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

function CartItem({ item, removeItem, updateQuantity }) {
  const baseUrl = import.meta.env.VITE_BASE_URL.replace(/\/$/, "") + "/uploads";

  return (
    <StyledTableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <StyledTableCell component="th" scope="row">
        {item.nombre}
      </StyledTableCell>
      <StyledTableCell>
        <img
          src={
            item.imagen && item.imagen.length > 0
              ? `${baseUrl}/${item.imagen[0].imagen}`
              : "/placeholder.png"
          }
          alt={item.nombre}
          style={{ width: 100 }}
        />
      </StyledTableCell>
      <StyledTableCell>{Number(item.precio).toFixed(2)}</StyledTableCell>
      <StyledTableCell>
        <TextField
          value={item.cantidad}
          fullWidth
          type="number"
          variant="outlined"
          size="medium"
          inputProps={{ min: 1, step: 1 }}
          onChange={(e) => {
            const newQuantity = parseInt(e.target.value);
            if (!isNaN(newQuantity)) updateQuantity(item, newQuantity);
          }}
        />
      </StyledTableCell>
      <StyledTableCell>&cent;{item.subtotal}</StyledTableCell>
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

// --------- Detalle Compra ----------
export function Cart() {
  const { cart, removeItem, cleanCart, getTotal, updateQuantity } = useCart();

  // 🔑 Estados: confirm y forma de pago
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openFormaPago, setOpenFormaPago] = useState(false);

  // (Opcional) Usuario si lo necesitas
  const [userInfo] = useState(() => {
    const storedUser = localStorage.getItem("userData"); // unificado
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Total y pedidoId (si ya lo guardas en localStorage)
  const total = Number(getTotal(cart));
  const [pedidoId, setPedidoId] = useState(() =>
    Number(localStorage.getItem("pedidoId") || 0)
  );

  return (
    <>
      <Tooltip title="Eliminar producto">
        <IconButton
          color="error"
          onClick={() => cleanCart()}
          aria-label="Eliminar"
          sx={{ ml: "auto" }}
        >
          <RemoveShoppingCartIcon />
        </IconButton>
      </Tooltip>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Producto</StyledTableCell>
              <StyledTableCell>Imagen</StyledTableCell>
              <StyledTableCell>Precio</StyledTableCell>
              <StyledTableCell>Cantidad</StyledTableCell>
              <StyledTableCell>Subtotal</StyledTableCell>
              <StyledTableCell sx={{ textAlign: "right" }}>
                Acciones
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((row) => (
              <CartItem
                key={row.id}
                item={row}
                removeItem={() => removeItem(row)}
                updateQuantity={(item, qty) => updateQuantity(item, qty)}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan={4} align="right">
                <Typography variant="subtitle1" gutterBottom>
                  Total
                </Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={2}>
                <Typography variant="subtitle1" gutterBottom>
                  &cent;{total}
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenConfirm(true)}   // ← abre el CONFIRM primero
          disabled={cart.length === 0}
        >
          Procesar Pago
        </Button>
      </Box>

      {/* 1) Confirmar registro de productos en carrito */}
      <ProcesarPago
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onSuccess={() => {
          setOpenConfirm(false);
          setOpenFormaPago(true);  // ← abre FormaPagoModal al terminar OK
        }}
      />

      {/* 2) Modal de forma de pago */}
      <FormaPagoModal
        open={openFormaPago}
        onClose={() => setOpenFormaPago(false)}
        total={total}
        pedidoId={pedidoId}    // si es 0, el botón de pagar del modal queda deshabilitado
        onSuccess={() => {
          cleanCart();
          localStorage.removeItem("pedidoId");
          setPedidoId(0);
          setOpenFormaPago(false);
        }}
      />
    </>
  );
}
