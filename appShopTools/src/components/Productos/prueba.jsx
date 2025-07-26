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
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import EtiquetaService from "../../services/EtiquetaService";
import ImageService from "../../services/ImageService";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

export function CrearProducto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //Gestion de errores
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);
  const MAX_IMAGENES = 5;

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
      .min(1900, `Año debe ser mayor a 1990`)
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
      imagenes: [],
    },
    //Asignación del esquema de validación
    resolver: yupResolver(productoSchema),
  });

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
        setError("Error al cargar los datos necesarios");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleEtiquetasChange = (event) => {
    setSelectedEtiquetas(event.target.value);
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (imagenes.length + files.length > MAX_IMAGENES) {
      toast.error(`Solo puedes subir un máximo de ${MAX_IMAGENES} imágenes`);
      return;
    }
    setImagenes((prevImagenes) => [...prevImagenes, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImagenes = [...imagenes];
    newImagenes.splice(index, 1);
    setImagenes(newImagenes);
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };
  //accion submit del formulario
  const onSubmit = async (DataForm) => {
    setLoading(true);
    try {
      DataForm.etiquetas = selectedEtiquetas;
      const response = await ProductoService.createProducto(DataForm);
      if (response.data !== null) {
        const formData = new FormData();
        imagenes.forEach((img) => formData.append("files", img));
        formData.append("producto_id", response.data.id);
        const imageResponse = await ImageService.createImage(formData);
        if (imageResponse.data !== null) {
          toast.success(imageResponse.data, {
            duration: 4000,
            position: "top-center",
          });
          navigate("/productos");
        }
      } else {
        toast.error("Error al crear el producto", {
          duration: 4000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al crear el producto",
        {
          duration: 4000,
          position: "top-center",
        }
      );
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
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
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
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
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.categoria_id}>
                  <InputLabel id="categoria-label">Categoría</InputLabel>
                  <Controller
                    name="categoria_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="categoria-label"
                        label="Categoría"
                        disabled={loading || categorias.length === 0}
                      >
                        {categorias.map((categoria) => (
                          <MenuItem
                            key={`categoria-${categoria.id ?? categoria.nombre}`}
                            value={categoria.id ?? ""}
                          >
                            {categoria.nombre ?? "Sin nombre"}
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="etiquetas-label">Etiquetas</InputLabel>
                  <Select
                    labelId="etiquetas-label"
                    multiple
                    value={selectedEtiquetas}
                    onChange={handleEtiquetasChange}
                    disabled={loading}
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
                      <MenuItem
                        key={`etiqueta-${etiqueta.id ?? etiqueta.nombre}`}
                        value={etiqueta.id ?? ""}
                      >
                        <Checkbox
                          checked={selectedEtiquetas.includes(
                            etiqueta.id ?? ""
                          )}
                        />
                        <ListItemText
                          primary={etiqueta.nombre ?? "Sin nombre"}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="precio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Precio"
                      type="number"
                      error={!!errors.precio}
                      helperText={errors.precio?.message}
                      disabled={loading}
                      inputProps={{ step: "0.01" }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Stock"
                      type="number"
                      error={!!errors.stock}
                      helperText={errors.stock?.message}
                      disabled={loading}
                      inputProps={{ min: 0, step: 1 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                      disabled={loading}
                      inputProps={{
                        min: 1900,
                        max: new Date().getFullYear() + 1,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
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
                      rows={3}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Controller
                      name="estado"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          disabled={loading}
                        />
                      )}
                    />
                  }
                  label={control._formValues?.estado ? "Activo" : "Inactivo"}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  id="imagenes-upload"
                  type="file"
                  multiple
                  onChange={handleImagesChange}
                  disabled={loading || imagenes.length >= MAX_IMAGENES}
                  style={{ display: "none" }}
                />
                <label htmlFor="imagenes-upload">
                  <Button
                    variant="contained"
                    component="span"
                    disabled={loading || imagenes.length >= MAX_IMAGENES}
                  >
                    Subir Imágenes ({imagenes.length}/{MAX_IMAGENES})
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12}>
                <List
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    p: 0,
                    listStyle: "none",
                  }}
                >
                  {previews.map((url, index) => (
                    <ListItem
                      key={`preview-${url}-${index}`}
                      sx={{
                        width: 120,
                        height: 120,
                        position: "relative",
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeImage(index)}
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          color: "red",
                          backgroundColor: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{ py: 1.5, minWidth: 180 }}
                  >
                    {loading ? "Creando..." : "Crear Producto"}
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

export default CrearProducto;
