import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Snackbar,
  Paper,
  IconButton,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import EtiquetaService from "../../services/EtiquetaService";



export function CrearProducto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
    stock: "",
    ano_compatible: "",
    marca_compatible: "",
    modelo_compatible: "",
    motor_compatible: "",
    certificaciones: "",
    estado: true,
  });

  // Obtener categorías y etiquetas al cargar el componente
  React.useEffect(() => {
    const fetchData = async () => {
      try {
  const [categoriasRes, etiquetasRes] = await Promise.all([
  CategoriaService.getCategorias(),
  EtiquetaService.getetiquetas()
]);

        setCategorias(categoriasRes.data || []);
        setEtiquetasDisponibles(etiquetasRes.data || []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos necesarios");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProducto((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Validación básica en tiempo real
    if (name === "nombre") {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, nombre: "El nombre es requerido" }));
      } else if (value.length > 100) {
        setErrors((prev) => ({ ...prev, nombre: "Máximo 100 caracteres" }));
      } else {
        const newErrors = { ...errors };
        delete newErrors.nombre;
        setErrors(newErrors);
      }
    }
  };

  const handleEtiquetasChange = (event) => {
    setSelectedEtiquetas(event.target.value);
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    setImagenes(files);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!producto.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (producto.nombre.length > 100) {
      newErrors.nombre = "Máximo 100 caracteres";
    }

    if (producto.descripcion.length > 500) {
      newErrors.descripcion = "Máximo 500 caracteres";
    }

    if (!producto.precio) {
      newErrors.precio = "El precio es requerido";
    } else if (isNaN(producto.precio)) {
      newErrors.precio = "Debe ser un número válido";
    } else if (Number(producto.precio) < 0) {
      newErrors.precio = "El precio no puede ser negativo";
    }

    if (!producto.stock) {
      newErrors.stock = "El stock es requerido";
    } else if (isNaN(producto.stock)) {
      newErrors.stock = "Debe ser un número válido";
    } else if (!Number.isInteger(Number(producto.stock))) {
      newErrors.stock = "Debe ser un número entero";
    } else if (Number(producto.stock) < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }

    if (!producto.categoria_id) {
      newErrors.categoria_id = "La categoría es requerida";
    }

    if (producto.marca_compatible && producto.marca_compatible.length > 50) {
      newErrors.marca_compatible = "Máximo 50 caracteres";
    }

    if (producto.modelo_compatible && producto.modelo_compatible.length > 50) {
      newErrors.modelo_compatible = "Máximo 50 caracteres";
    }

    if (producto.motor_compatible && producto.motor_compatible.length > 50) {
      newErrors.motor_compatible = "Máximo 50 caracteres";
    }

    if (
      producto.ano_compatible &&
      (isNaN(producto.ano_compatible) ||
        producto.ano_compatible < 1900 ||
        producto.ano_compatible > new Date().getFullYear() + 1)
    ) {
      newErrors.ano_compatible = `Año debe estar entre 1900 y ${new Date().getFullYear() + 1}`;
    }

    if (imagenes.length === 0) {
      newErrors.imagenes = "Debe seleccionar al menos una imagen";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setLoading(true);
    setError(null);

    const formData = new FormData();
 formData.append("data", JSON.stringify({
  ...producto,
  estado: producto.estado ? 1 : 0  
}));


    imagenes.forEach((img) => {
      formData.append("imagenes[]", img);
    });

    await ProductoService.createProducto(formData);

    setSuccess("Producto creado exitosamente");


    navigate("/productos");
  } catch (err) {
    console.error("Error al crear producto:", err);
    setError(err.response?.data?.message || "Error al crear el producto");
  } finally {
    setLoading(false);
  }
};


  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton component={Link} to="/productos" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Crear Nuevo Producto
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="Información del Producto" />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Sección de información básica */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="nombre"
                  name="nombre"
                  label="Nombre del Producto"
                  value={producto.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoria_id}>
                  <InputLabel id="categoria-label">Categoría</InputLabel>
                  <Select
                    labelId="categoria-label"
                    id="categoria_id"
                    name="categoria_id"
                    value={producto.categoria_id}
                    onChange={handleChange}
                    disabled={loading || categorias.length === 0}
                    label="Categoría"
                  >
                    {categorias.length === 0 && (
                      <MenuItem disabled value="">
                        {loading
                          ? "Cargando categorías..."
                          : "No hay categorías disponibles"}
                      </MenuItem>
                    )}
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoria_id && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {errors.categoria_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="etiquetas-label">Etiquetas</InputLabel>
                  <Select
                    labelId="etiquetas-label"
                    id="etiquetas"
                    multiple
                    value={selectedEtiquetas}
                    onChange={handleEtiquetasChange}
                    disabled={loading || etiquetasDisponibles.length === 0}
                    label="Etiquetas"
                    renderValue={(selected) => 
                      selected.map(id => 
                        etiquetasDisponibles.find(e => e.id === id)?.nombre
                      ).join(', ')
                    }
                  >
                    {etiquetasDisponibles.map((etiqueta) => (
                      <MenuItem key={etiqueta.id} value={etiqueta.id}>
                        <Checkbox checked={selectedEtiquetas.indexOf(etiqueta.id) > -1} />
                        <ListItemText primary={etiqueta.nombre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="descripcion"
                  name="descripcion"
                  label="Descripción"
                  multiline
                  rows={4}
                  value={producto.descripcion}
                  onChange={handleChange}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  id="precio"
                  name="precio"
                  label="Precio"
                  type="number"
                  inputProps={{ step: "0.01", min: "0" }}
                  value={producto.precio}
                  onChange={handleChange}
                  error={!!errors.precio}
                  helperText={errors.precio}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  id="stock"
                  name="stock"
                  label="Stock"
                  type="number"
                  inputProps={{ min: "0" }}
                  value={producto.stock}
                  onChange={handleChange}
                  error={!!errors.stock}
                  helperText={errors.stock}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  id="valoracion_promedio"
                  name="valoracion_promedio"
                  label="Valoración Promedio"
                  value="N/A"
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      name="estado"
                      checked={producto.estado}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Producto activo"
                  labelPlacement="start"
                />
              </Grid>

              {/* Sección de compatibilidad */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Información de Compatibilidad
                </Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  id="ano_compatible"
                  name="ano_compatible"
                  label="Año compatible"
                  type="number"
                  inputProps={{
                    min: "1900",
                    max: new Date().getFullYear() + 1,
                  }}
                  value={producto.ano_compatible}
                  onChange={handleChange}
                  error={!!errors.ano_compatible}
                  helperText={errors.ano_compatible}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  id="marca_compatible"
                  name="marca_compatible"
                  label="Marca compatible"
                  value={producto.marca_compatible}
                  onChange={handleChange}
                  error={!!errors.marca_compatible}
                  helperText={errors.marca_compatible}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  id="modelo_compatible"
                  name="modelo_compatible"
                  label="Modelo compatible"
                  value={producto.modelo_compatible}
                  onChange={handleChange}
                  error={!!errors.modelo_compatible}
                  helperText={errors.modelo_compatible}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  id="motor_compatible"
                  name="motor_compatible"
                  label="Motor compatible"
                  value={producto.motor_compatible}
                  onChange={handleChange}
                  error={!!errors.motor_compatible}
                  helperText={errors.motor_compatible}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="certificaciones"
                  name="certificaciones"
                  label="Certificaciones (separadas por comas)"
                  value={producto.certificaciones}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              {/* Sección de imágenes */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Imágenes del Producto
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="imagenes-upload"
                    type="file"
                    multiple
                    onChange={handleImagesChange}
                  />
                  <label htmlFor="imagenes-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      disabled={loading}
                    >
                      Seleccionar Imágenes
                    </Button>
                  </label>
                  {errors.imagenes && (
                    <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                      {errors.imagenes}
                    </Typography>
                  )}
                  {imagenes.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">Archivos seleccionados:</Typography>
                      <List dense>
                        {imagenes.map((img, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={img.name} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    component={Link}
                    to="/productos"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Guardar Producto"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
}