import * as React from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import RentalService from "../../services/RentalService";
import { format, parseISO } from "date-fns";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Link, useNavigate } from "react-router-dom";

export default function ListRentals() {
  //Enlaces o redireccionar
  const navigate = useNavigate();
  //Datos a cargar en la tabla
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  React.useEffect(() => {
    RentalService.getRentals()
      .then((response) => {
        console.log(response);
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          setError(error);
          console.log(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);
  //Formato de fecha
  const parseDate = (date) => {
    if (!date) return ""; // Manejo de fechas vacías o inválidas
    const pDate = parseISO(date);
    return format(pDate, "dd/MM/yyyy");
  };
  const detail = (id) => {
    return navigate(`/retal/${id}`);
  };
  //Mensaje cargando
  if (!loaded) return <p>Cargando...</p>;
  //Mensaje de error
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Listado de Alquileres
        <Tooltip title="Crear">
          <IconButton component={Link} to="/rental/crear/" color="success">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left"># Alquiler</TableCell>
              <TableCell align="left">Fecha</TableCell>
              <TableCell align="left">Tienda</TableCell>
              <TableCell align="left">Cliente</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{parseDate(row.rental_date)}</TableCell>
                <TableCell align="left">{row.shopRental.name}</TableCell>
                <TableCell align="left">{row.customer.name}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Actualizar">
                    {/* función anónima */}
                    <IconButton onClick={() => detail(row.id)} color="success">
                      <ZoomInIcon key={row.id} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
