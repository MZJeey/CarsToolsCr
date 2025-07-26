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
  ListItemText,
  Checkbox,
  Avatar,
  Stack,
  Paper,
  CircularProgress,
  Divider,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemAvatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

// Servicios
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import ProductoEtiquetaService from "../../services/ProductoEtiquetaService";
import ResenaService from "../../services/ResenaService";
import ImpuestoService from "../../services/ImpuestoService";
import ImageService from "../../services/ImageService";

export function EditarProducto() {
  const navigate = useNavigate();
  const routeParams = useParams();
  //Id de la pelicula a actualizar
  const id = routeParams.id || null;
  //Valores a precargar en el formulario, vienen del API
  const [values, setValores] = useState(null);

  // Estados
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [promedioValoraciones, setPromedioValoraciones] = useState(0);
  const [loadingValoraciones, setLoadingValoraciones] = useState(false);
  const [impuestos, setImpuestos] = useState([]);
  const [hover, setHover] = useState(-1);

  // Estado para el diálogo de confirmación
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    index: null,
  });

  // Esquema de validación
  const productoSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre del producto es obligatorio")
      .max(100, "Máximo 100 caracteres")
      .trim(),
    descripcion: yup.string().max(500, "Máximo 500 caracteres").trim(),
    precio: yup
      .number()
      .typeError("Debe ser un número válido")
      .required("El precio es obligatorio")
      .positive("El precio debe ser positivo")
      .max(10000000, "El precio no puede ser mayor a ₡10,000,000"),
    categoria_id: yup
      .number()
      .typeError("Selecciona una categoría válida")
      .required("La categoría es obligatoria"),
    IdImpuesto: yup
      .number()
      .typeError("Selecciona un impuesto válido")
      .required("El impuesto es obligatorio"),
    stock: yup
      .number()
      .typeError("Debe ser un número entero")
      .required("El stock es obligatorio")
      .integer("El stock debe ser un número entero")
      .min(0, "El stock no puede ser negativo")
      .max(10000, "El stock no puede ser mayor a 10,000"),
    ano_compatible: yup
      .number()
      .typeError("Ingresa un año válido")
      .min(1900, "El año debe ser posterior a 1900")
      .max(new Date().getFullYear() + 1, "El año no puede ser en el futuro")
      .nullable(),
    marca_compatible: yup.string().max(50, "Máximo 50 caracteres").trim(),
    modelo_compatible: yup.string().max(50, "Máximo 50 caracteres").trim(),
    motor_compatible: yup.string().max(50, "Máximo 50 caracteres").trim(),
    certificaciones: yup.string().max(200, "Máximo 200 caracteres").trim(),
    estado: yup.boolean(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(productoSchema),
  });

  // Textos de ayuda para los campos
  const fieldDescriptions = {
    nombre: "Nombre descriptivo del producto",
    descripcion: "Descripción detallada del producto",
    precio: "Precio de venta al público en colones",
    stock: "Cantidad disponible en inventario",
    ano_compatible: "Año del vehículo compatible (opcional)",
    marca_compatible: "Marca del vehículo compatible (opcional)",
    modelo_compatible: "Modelo del vehículo compatible (opcional)",
    motor_compatible: "Motor compatible (opcional)",
    certificaciones: "Certificaciones o estándares que cumple el producto",
  };

  // Cargar valoraciones
  useEffect(() => {
    const fetchValoraciones = async () => {
      setLoadingValoraciones(true);
      try {
        const response = await ResenaService.getResenasByProducto(id);
        const valoracionesData = response.data || [];
        setValoraciones(valoracionesData);

        // Calcular promedio
        if (valoracionesData.length > 0) {
          const suma = valoracionesData.reduce(
            (acc, curr) => acc + parseInt(curr.valoracion || 0),
            0
          );
          setPromedioValoraciones(suma / valoracionesData.length);
        }
      } catch (error) {
        console.error("Error al cargar valoraciones:", error);
        toast.error("Error al cargar las valoraciones");
      } finally {
        setLoadingValoraciones(false);
      }
    };

    fetchValoraciones();
  }, [id]);

  // Cargar datos iniciales del producto
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Cargar datos comunes
        const [categoriasRes, etiquetasRes, impuestosRes] = await Promise.all([
          CategoriaService.getCategorias(),
          ProductoEtiquetaService.getetiquetas(),
          ImpuestoService.getImpuesto(),
        ]);

        setCategorias(categoriasRes.data || []);
        setEtiquetasDisponibles(
          etiquetasRes.data?.map((etiqueta) => ({
            id: Number(etiqueta.id),
            nombre: etiqueta.nombre,
          })) || []
        );
        setImpuestos(impuestosRes.data || []);

        // Cargar datos del producto
        if (id != undefined && !isNaN(id)) {
          ProductoService.getProductobyId(id)
            .then((response) => {
              const producto = response.data;
              setValores(producto);

              // Formatear datos para el formulario
              reset({
                nombre: producto.nombre || "",
                descripcion: producto.descripcion || "",
                precio: producto.precio ? Number(producto.precio) : "",
                categoria_id: producto.categoria_id
                  ? Number(producto.categoria_id)
                  : "",
                IdImpuesto: producto.IdImpuesto
                  ? Number(producto.IdImpuesto)
                  : "",
                stock: producto.stock ? Number(producto.stock) : "",
                ano_compatible: producto.ano_compatible
                  ? Number(producto.ano_compatible)
                  : null,
                marca_compatible: producto.marca_compatible || "",
                modelo_compatible: producto.modelo_compatible || "",
                motor_compatible: producto.motor_compatible || "",
                certificaciones: producto.certificaciones || "",
                estado: producto.estado === "1",
              });

              // Manejar etiquetas
              setSelectedEtiquetas(
                producto.etiquetas?.map((e) => Number(e.id)) || []
              );

              // Manejar imágenes existentes
              const BASE_URL =
                import.meta.env.VITE_BASE_URL.replace(/\/$/, "") + "/uploads";

              const existingImages =
                producto.imagen?.map((img) => ({
                  id: img.id,
                  url: `${BASE_URL}/${img.imagen}`,
                  name: img.imagen,
                  isExisting: true,
                })) || [];

              setImagenes(existingImages);
              setPreviewURLs(existingImages.map((img) => img.url));
            })
            .catch((error) => {
              console.error("Error al cargar el producto:", error);
              toast.error("Error al cargar el producto");
            });
        }
      } catch (err) {
        toast.error("Error al cargar datos del producto");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, reset]);

  // Manejadores de eventos
  const handleEtiquetasChange = (event) => {
    setSelectedEtiquetas(event.target.value.map(Number));
  };

  const handleAddImage = () => {
    if (previewURLs.length < 3) {
      setImagenes([...imagenes, null]);
      setPreviewURLs([...previewURLs, null]);
    } else {
      toast.error("Máximo 3 imágenes por producto");
    }
  };

  const handleRemoveImageClick = (index) => {
    setDeleteDialog({
      open: true,
      index,
    });
  };

  const handleConfirmDelete = () => {
    const newImages = imagenes.filter((_, idx) => idx !== deleteDialog.index);
    const newPreviews = previewURLs.filter(
      (_, idx) => idx !== deleteDialog.index
    );

    setImagenes(newImages);
    setPreviewURLs(newPreviews);
    setDeleteDialog({ open: false, index: null });
  };

  const handleChangeImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen no debe exceder los 2MB");
      return;
    }

    const newImages = [...imagenes];
    const newPreviews = [...previewURLs];

    if (newImages[index]?.isExisting) {
      newImages[index] = {
        ...newImages[index],
        file,
        shouldUpdate: true,
      };
    } else {
      newImages[index] = file;
    }

    newPreviews[index] = URL.createObjectURL(file);
    setImagenes(newImages);
    setPreviewURLs(newPreviews);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (
        window.confirm("¿Estás seguro de que deseas descartar los cambios?")
      ) {
        navigate("/productos");
      }
    } else {
      navigate("/productos");
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      // Preparamos los datos exactamente como el backend los espera
      const productoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria_id: parseInt(formData.categoria_id),
        stock: parseInt(formData.stock),
        estado: formData.estado ? 1 : 0, // Asegurar valor numérico
        IdImpuesto: formData.IdImpuesto ? parseInt(formData.IdImpuesto) : null,
        ano_compatible: formData.ano_compatible
          ? parseInt(formData.ano_compatible)
          : null,
        marca_compatible: formData.marca_compatible || null,
        modelo_compatible: formData.modelo_compatible || null,
        motor_compatible: formData.motor_compatible || null,
        certificaciones: formData.certificaciones || null,
      };

      console.log("Datos a enviar:", productoData); // Para depuración

      const response = await ProductoService.updateProducto(id, productoData);

      // Manejo de imágenes nuevas

      toast.success("Producto actualizado exitosamente");
      navigate("/productos");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Error al actualizar el producto";
      console.error("Detalles del error:", {
        error: errorMessage,
        responseData: error.response?.data,
        status: error.response?.status,
      });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Labels para las valoraciones
  const labels = {
    0.5: "Pésimo",
    1: "Malo",
    1.5: "Deficiente",
    2: "Regular",
    2.5: "Aceptable",
    3: "Bueno",
    3.5: "Muy Bueno",
    4: "Excelente",
    4.5: "Fantástico",
    5: "Perfecto",
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, margin: "0 auto" }}>
      {/* Diálogo de confirmación para eliminar imagen */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, index: null })}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar esta imagen? Se eliminará cuando
            guardes los cambios.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, index: null })}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Encabezado */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Tooltip title="Volver a la lista de productos">
          <IconButton
            component={Link}
            to="/productos"
            sx={{
              mr: 2,
              color: "primary.main",
              "&:hover": { backgroundColor: "primary.light" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Editar Producto #{id}
        </Typography>
      </Box>

      {/* Formulario Principal */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardHeader
          title="Editar Producto"
          titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
          sx={{
            backgroundColor: "background.paper",
            color: "text.primary",
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        />

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Sección 1: Información Básica */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 3, mb: 3, backgroundColor: "background.paper" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}
                  >
                    Información Básica
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="nombre"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Nombre del Producto *"
                            variant="outlined"
                            error={!!errors.nombre}
                            helperText={
                              errors.nombre?.message || fieldDescriptions.nombre
                            }
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Tooltip title={fieldDescriptions.nombre}>
                                    <InfoIcon color="action" fontSize="small" />
                                  </Tooltip>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="categoria_id"
                        control={control}
                        defaultValue="" // Añade esto
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={!!errors.categoria_id}
                            size="small"
                          >
                            <InputLabel>Categoría *</InputLabel>
                            <Select
                              {...field}
                              label="Categoría *"
                              MenuProps={{
                                PaperProps: { style: { maxHeight: 300 } },
                              }}
                            >
                              {categorias.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                  {cat.nombre}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {errors.categoria_id?.message ||
                                "Selecciona la categoría principal del producto"}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="IdImpuesto"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            size="medium"
                            error={!!errors.IdImpuesto}
                          >
                            <InputLabel>Impuesto aplicable</InputLabel>
                            <Select
                              {...field}
                              label="Impuesto aplicable"
                              value={field.value || ""}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 400,
                                  },
                                },
                              }}
                            >
                              <MenuItem value="">
                                <em>Ninguno</em>
                              </MenuItem>
                              {impuestos.map((impuesto) => (
                                <MenuItem
                                  key={impuesto.IdImpuesto || impuesto.id}
                                  value={impuesto.IdImpuesto || impuesto.id}
                                >
                                  {impuesto.nombre} (
                                  {impuesto.Porcentaje || impuesto.porcentaje}
                                  %)
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.IdImpuesto && (
                              <FormHelperText>
                                {errors.IdImpuesto.message}
                              </FormHelperText>
                            )}
                            <FormHelperText>
                              Selecciona el impuesto que aplica a este producto
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="descripcion"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Descripción"
                            multiline
                            rows={4}
                            variant="outlined"
                            error={!!errors.descripcion}
                            helperText={`${field.value?.length || 0}/500 - ${fieldDescriptions.descripcion}`}
                            inputProps={{ maxLength: 500 }}
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Sección de Valoraciones */}
                <Paper
                  elevation={0}
                  sx={{ p: 3, mb: 3, backgroundColor: "background.paper" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}
                  >
                    Valoraciones de Clientes
                  </Typography>

                  {loadingValoraciones ? (
                    <Box display="flex" justifyContent="center">
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Box>
                          <Rating
                            value={promedioValoraciones}
                            precision={0.5}
                            readOnly
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {
                              labels[
                                hover !== -1 ? hover : promedioValoraciones
                              ]
                            }
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ ml: 2 }}>
                          {promedioValoraciones.toFixed(1)} de 5 (
                          {valoraciones.length} valoraciones)
                        </Typography>
                      </Box>

                      {valoraciones.length > 0 ? (
                        <List sx={{ maxHeight: 300, overflow: "auto" }}>
                          {valoraciones.map((resena, index) => (
                            <React.Fragment key={resena.id || index}>
                              <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                  <Avatar
                                    alt={resena.usuario_nombre}
                                    src={resena.usuario_imagen}
                                  >
                                    {resena.usuario_nombre?.charAt(0) || "U"}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <>
                                      <Typography fontWeight="bold">
                                        {resena.usuario_nombre ||
                                          "Usuario anónimo"}
                                      </Typography>
                                      <Rating
                                        value={parseInt(resena.valoracion) || 0}
                                        precision={0.5}
                                        readOnly
                                        size="small"
                                      />
                                    </>
                                  }
                                  secondary={
                                    <>
                                      <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                        display="block"
                                      >
                                        {resena.comentario}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {formatFecha(resena.fecha)}
                                      </Typography>
                                    </>
                                  }
                                />
                              </ListItem>
                              {index < valoraciones.length - 1 && (
                                <Divider variant="inset" component="li" />
                              )}
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Este producto no tiene valoraciones aún.
                        </Typography>
                      )}
                    </>
                  )}
                </Paper>
              </Grid>

              {/* Sección 2: Precio y Stock */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 3, mb: 3, backgroundColor: "background.paper" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}
                  >
                    Precio e Inventario
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="precio"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Precio (₡) *"
                            type="number"
                            variant="outlined"
                            inputProps={{ step: "0.01", min: "0" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₡
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Tooltip title={fieldDescriptions.precio}>
                                    <InfoIcon color="action" fontSize="small" />
                                  </Tooltip>
                                </InputAdornment>
                              ),
                            }}
                            error={!!errors.precio}
                            helperText={
                              errors.precio?.message || fieldDescriptions.precio
                            }
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
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
                            label="Stock Disponible *"
                            type="number"
                            variant="outlined"
                            inputProps={{ min: "0" }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Tooltip title={fieldDescriptions.stock}>
                                    <InfoIcon color="action" fontSize="small" />
                                  </Tooltip>
                                </InputAdornment>
                              ),
                            }}
                            error={!!errors.stock}
                            helperText={
                              errors.stock?.message || fieldDescriptions.stock
                            }
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
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
                                checked={field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                                color="primary"
                              />
                            )}
                          />
                        }
                        label={
                          <Box>
                            <Typography>Estado del Producto</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {watch("estado")
                                ? "Activo (visible en la tienda)"
                                : "Inactivo (no visible)"}
                            </Typography>
                          </Box>
                        }
                        sx={{
                          mt: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          p: 1,
                          width: "100%",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Sección 3: Compatibilidad */}
                <Paper
                  elevation={0}
                  sx={{ p: 3, mb: 3, backgroundColor: "background.paper" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}
                  >
                    Compatibilidad
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="ano_compatible"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Año"
                            type="number"
                            variant="outlined"
                            error={!!errors.ano_compatible}
                            helperText={
                              errors.ano_compatible?.message ||
                              fieldDescriptions.ano_compatible
                            }
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
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
                            label="Marca"
                            variant="outlined"
                            error={!!errors.marca_compatible}
                            helperText={
                              errors.marca_compatible?.message ||
                              fieldDescriptions.marca_compatible
                            }
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
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
                            label="Modelo"
                            variant="outlined"
                            error={!!errors.modelo_compatible}
                            helperText={
                              errors.modelo_compatible?.message ||
                              fieldDescriptions.modelo_compatible
                            }
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
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
                            label="Motor"
                            variant="outlined"
                            error={!!errors.motor_compatible}
                            helperText={
                              errors.motor_compatible?.message ||
                              fieldDescriptions.motor_compatible
                            }
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
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
                            variant="outlined"
                            multiline
                            rows={2}
                            error={!!errors.certificaciones}
                            helperText={`${field.value?.length || 0}/200 - ${fieldDescriptions.certificaciones}`}
                            inputProps={{ maxLength: 200 }}
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Sección 4: Etiquetas */}
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    height: "100%",
                    backgroundColor: "background.paper",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}
                  >
                    Etiquetas
                  </Typography>

                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.etiquetas}
                  >
                    <InputLabel>Etiquetas del producto</InputLabel>
                    <Select
                      multiple
                      value={selectedEtiquetas}
                      onChange={handleEtiquetasChange}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.length === 0 ? (
                            <Typography variant="caption" color="textSecondary">
                              Seleccione etiquetas...
                            </Typography>
                          ) : (
                            selected.map((id) => {
                              const etiqueta = etiquetasDisponibles.find(
                                (e) => e.id === id
                              );
                              return (
                                <Chip
                                  key={id}
                                  label={etiqueta?.nombre || `ID: ${id}`}
                                  size="small"
                                  sx={{ m: 0.5 }}
                                />
                              );
                            })
                          )}
                        </Box>
                      )}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                          },
                        },
                      }}
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
                    <FormHelperText>
                      Selecciona las etiquetas que describan tu producto
                    </FormHelperText>
                  </FormControl>
                </Paper>
              </Grid>

              {/* Sección 5: Imágenes */}
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={0}
                  sx={{ p: 3, mb: 3, backgroundColor: "background.paper" }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}
                  >
                    Imágenes del Producto
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    Puedes subir hasta 3 imágenes (JPEG, PNG, máximo 2MB cada
                    una)
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ flexWrap: "wrap", mt: 2 }}
                  >
                    {previewURLs.map((url, index) => {
                      const currentImage = imagenes[index];
                      const isExisting = currentImage?.isExisting;

                      return (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            width: 150,
                            height: 150,
                            border: "1px dashed",
                            borderColor: "divider",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            mb: 2,
                            "&:hover": {
                              borderColor: "primary.main",
                            },
                          }}
                        >
                          {url ? (
                            <>
                              <img
                                src={url}
                                alt={`Imagen ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                              <Tooltip title="Eliminar imagen">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveImageClick(index)}
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    backgroundColor: "error.main",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: "error.dark",
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleChangeImage(e, index)}
                                style={{
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  opacity: 0,
                                  cursor: "pointer",
                                }}
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  p: 1,
                                }}
                              >
                                <AddPhotoIcon color="action" />
                                <Typography
                                  variant="caption"
                                  textAlign="center"
                                >
                                  Agregar imagen
                                </Typography>
                              </Box>
                            </>
                          )}
                          {isExisting && (
                            <Chip
                              label="Existente"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 4,
                                left: 4,
                                backgroundColor: "success.main",
                                color: "white",
                              }}
                            />
                          )}
                        </Box>
                      );
                    })}

                    {previewURLs.length < 3 && (
                      <Tooltip title="Agregar nueva imagen">
                        <Button
                          variant="outlined"
                          onClick={handleAddImage}
                          sx={{
                            width: 150,
                            height: 150,
                            flexDirection: "column",
                            borderStyle: "dashed",
                            "&:hover": {
                              borderColor: "primary.main",
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          <AddPhotoIcon color="action" sx={{ mb: 1 }} />
                          <Typography variant="caption">
                            Agregar Imagen
                          </Typography>
                        </Button>
                      </Tooltip>
                    )}
                  </Stack>
                </Paper>
              </Grid>

              {/* Botones de acción */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    pt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      minWidth: 150,
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      minWidth: 200,
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress
                          size={24}
                          color="inherit"
                          sx={{ mr: 1 }}
                        />
                        Actualizando...
                      </>
                    ) : (
                      "Guardar Cambios"
                    )}
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
