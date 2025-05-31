import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
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
import { useParams } from "react-router-dom";

export default function DetailRental() {
  const routeParams = useParams();
  //Datos a cargar en la tabla
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  React.useEffect(() => {
    //Llamar al API y obtener una pelicula
    RentalService.getRentalById(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        throw new Error("Respuesta no válida del servidor");
      });
  }, [routeParams.id]);
  //Formato de fecha
  const parseDate = (date) => {
    if (!date) return ""; // Manejo de fechas vacías o inválidas
    const pDate = parseISO(date);
    return format(pDate, "dd/MM/yyyy");
  };

  //Mensaje cargando
  if (!loaded) return <p>Cargando...</p>;
  //Mensaje de error
  if (error) return <p>Error: {error.message}</p>;
  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      {data && (
        <>
          <Typography variant="h5" color="primary" gutterBottom>
            Detalle de Alquiler {data.id}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={3}>
              <Typography variant="body1" gutterBottom>
                Fecha: {parseDate(data.rental_date)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Tienda: {data.shopRental.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Cliente: {data.customer.name}
              </Typography>
            </Grid>
            <Grid size={9}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Pelicula</TableCell>
                      <TableCell align="left">Precio</TableCell>
                      <TableCell align="left">Días</TableCell>
                      <TableCell align="left">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.movies.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left">{row.title}</TableCell>
                        <TableCell align="left">{row.price}</TableCell>
                        <TableCell align="left">{row.days}</TableCell>
                        <TableCell align="left">{row.subtotal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="body1"  align="right" gutterBottom>
                Total: {data.total}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      <Typography variant="caption" color="warning" gutterBottom sx={{ display: 'block' }}>
        Prohibido el uso del 100% de esta maquetación en el proyecto
      </Typography>
    </Container>
  );
}
