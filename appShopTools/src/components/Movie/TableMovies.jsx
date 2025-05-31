/* eslint-disable no-unused-vars */
//https://mui.com/material-ui/react-table/#sorting-amp-selecting
import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { useEffect } from "react";
import MovieService from "../../services/MovieService";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

//Componente tabla
export default function TableMovies() {
  //Enlaces o redireccionar
  const navigate = useNavigate();
  //Datos a cargar en la tabla
  const [data, setData] = useState({});

  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  //Obtener lista del API
  useEffect(() => {
    MovieService.getMovies()
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
  const update = (id) => {
    return navigate(`/movie/update/${id}`);
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
    <Typography variant="h5" gutterBottom>
       Listado de Peliculas 
       <Tooltip title="Crear">
        <IconButton component={Link} to="/movie/crear/" color="success">
          <AddIcon />
        </IconButton>
      </Tooltip>
      </Typography>
      
      {data && data.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Titulo
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Año
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Duración
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Acciones
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* Contenido de la tabla */}
                  <TableCell align="left">{row.title}</TableCell>
                  <TableCell align="left">{row.year}</TableCell>
                  <TableCell align="left">{row.time}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Actualizar">
                      {/* función anónima */}
                      <IconButton
                        onClick={() => update(row.id)}
                        color="success"
                      >
                        <EditIcon key={row.id} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  {/* Contenido de la tabla */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
