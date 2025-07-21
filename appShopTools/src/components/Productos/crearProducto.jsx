import React, { useState, useEffect } from "react";
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
  FormHelperText,
  IconButton,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

// Servicios (ajusta las importaciones según tu estructura)
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import EtiquetaService from "../../services/EtiquetaService";
import ImageService from "../../services/ImageService";

export function CrearProducto() {
  const navigate = useNavigate();
  let formData = new FormData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);

  // Esquema de validación
  const productoSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre es requerido")
      .max(100, "Máximo 100 caracteres"),
    descripcion: yup.string().max(500, "Máximo 500 caracteres"),
    precio: yup
      .number()
      .typeError("Debe ser un número válido")
      .required("El precio es requerido")
      .positive("El precio no puede ser negativo"),
    categoria_id: yup
      .number()
      .typeError("Seleccione una categoría")
      .required("La categoría es requerida"),
    stock: yup
      .number()
      .typeError("Debe ser un número válido")
      .required("El stock es requerido")
      .integer("Debe ser un número entero")
      .min(0, "El stock no puede ser negativo"),
    ano_compatible: yup
      .number()
      .typeError("Debe ser un número válido")
      .min(1900, "Año debe ser mayor a 1900")
      .max(
        new Date().getFullYear() + 1,
        `Año debe ser menor a ${new Date().getFullYear() + 1}`
      )
      .nullable(),
    marca_compatible: yup.string().max(50, "Máximo 50 caracteres"),
    modelo_compatible: yup.string().max(50, "Máximo 50 caracteres"),
    motor_compatible: yup.string().max(50, "Máximo 50 caracteres"),
    certificaciones: yup.string(),
    estado: yup.boolean(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
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
    },
    resolver: yupResolver(productoSchema),
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasRes, etiquetasRes] = await Promise.all([
          CategoriaService.getCategorias(),
          EtiquetaService.getetiquetas(),
        ]);
        setCategorias(categoriasRes.data || []);
        setEtiquetasDisponibles(etiquetasRes.data || []);
      } catch (err) {
        toast.error("Error al cargar categorías y etiquetas");
      }
    };
    fetchData();
  }, []);

  // Limpiar previews al desmontar

  // Submit del formulario
  const onSubmit = (DataForm) => {
    console.log("Formulario:");
    console.log(DataForm);
    //Llamar al API
    try {
      if (productoSchema.isValid()) {
        console.log("Mostrar datos del formulario-->", DataForm);
        //Crear producto
        ProductoService.createProducto(DataForm)
          .then((response) => {
            setError(response.error);
            //Respuesta al usuario
            if (response.data != null) {
              //Gestionar imagen
              formData.append("file", file);
              formData.append("producto_id", response.data.id);
              console.log("Datos del producto-->", response.data);
              ImageService.createImage(formData)
                .then((response) => {
                  setError(response.error);
                  if (response.data != null) {
                    toast.success(response.data, {
                      duration: 4000,
                      position: "top-center",
                    });
                  }
                })
                .catch((error) => {
                  if (error instanceof SyntaxError) {
                    console.log(error);
                    setError(error);
                    throw new Error("Respuesta no válida del servidor");
                  }
                });
              toast.success(
                `Producto creado #${response.data.id} - ${response.data.nombre}`,
                {
                  duration: 4000,
                  position: "top-center",
                }
              );
              //Redirección tabla de productos
              // return navigate('/product-table')
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error("Respuesta no válida del servidor");
            }
          });
      }
    } catch (error) {
      console.error(error);
    }
  };
  /* Gestion de imagen */
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  function handleChangeImage(e) {
    if (e.target.files) {
      setFileURL(
        URL.createObjectURL(e.target.files[0], e.target.files[0].name)
      );
      setFile(e.target.files[0], e.target.files[0].name);
      console.log("Ruta--->", fileURL);
    }
  }

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Campo Nombre */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre del Producto"
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                    />
                  )}
                />
              </Grid>

              {/* Campo Descripción */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="descripcion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Descripción"
                      multiline
                      rows={3}
                      error={!!errors.descripcion}
                      helperText={errors.descripcion?.message}
                    />
                  )}
                />
              </Grid>

              {/* Campo Categoría */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoria_id}>
                  <InputLabel>Categoría</InputLabel>
                  <Controller
                    name="categoria_id"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Categoría">
                        {categorias.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>
                    {errors.categoria_id?.message}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Campo Etiquetas */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Etiquetas</InputLabel>
                  <Select
                    multiple
                    value={selectedEtiquetas}
                    onChange={(e) => setSelectedEtiquetas(e.target.value)}
                    renderValue={(selected) =>
                      selected
                        .map(
                          (id) =>
                            etiquetasDisponibles.find((e) => e.id === id)
                              ?.nombre
                        )
                        .join(", ")
                    }
                  >
                    {etiquetasDisponibles.map((etiqueta) => (
                      <MenuItem key={etiqueta.id} value={etiqueta.id}>
                        <Checkbox
                          checked={selectedEtiquetas.includes(etiqueta.id)}
                        />
                        <ListItemText primary={etiqueta.nombre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Campos numéricos */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="precio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Precio"
                      type="number"
                      inputProps={{ step: "0.01" }}
                      error={!!errors.precio}
                      helperText={errors.precio?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Stock"
                      type="number"
                      inputProps={{ min: 0 }}
                      error={!!errors.stock}
                      helperText={errors.stock?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="ano_compatible"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Año Compatible"
                      type="number"
                      error={!!errors.ano_compatible}
                      helperText={errors.ano_compatible?.message}
                    />
                  )}
                />
              </Grid>

              {/* Campos compatibilidad */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="marca_compatible"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Marca Compatible"
                      error={!!errors.marca_compatible}
                      helperText={errors.marca_compatible?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="modelo_compatible"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Modelo Compatible"
                      error={!!errors.modelo_compatible}
                      helperText={errors.modelo_compatible?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="motor_compatible"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Motor Compatible"
                      error={!!errors.motor_compatible}
                      helperText={errors.motor_compatible?.message}
                    />
                  )}
                />
              </Grid>

              {/* Campo Certificaciones */}
              <Grid item xs={12}>
                <Controller
                  name="certificaciones"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Certificaciones"
                      multiline
                      rows={2}
                    />
                  )}
                />
              </Grid>

              {/* Switch Estado */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Controller
                      name="estado"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          color="primary"
                        />
                      )}
                    />
                  }
                  label="Producto activo"
                />
              </Grid>

              {/* Subida de imágenes */}
              <Grid item xs={12}>
                <Typography Typography variant="h6" gutterBottom>
                  Cargar Imagen
                </Typography>
                <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="file"
                        {...field}
                        onChange={handleChangeImage}
                      />
                    )}
                  />
                </FormControl>
                <img src={fileURL} width={300} />
              </Grid>

              {/* Botón de submit */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Crear Producto"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
