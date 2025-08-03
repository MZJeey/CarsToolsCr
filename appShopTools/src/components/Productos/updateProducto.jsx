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
  Grid2,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { data, Link, useNavigate, useParams } from "react-router-dom";
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
  const id = routeParams.id || null;

  // Estados
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);
  //Imagenes

  const [valoraciones, setValoraciones] = useState([]);
  const [promedioValoraciones, setPromedioValoraciones] = useState(0);
  const [loadingValoraciones, setLoadingValoraciones] = useState(false);
  const [impuestos, setImpuestos] = useState([]);

  const [previewURLs, setPreviewURLs] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [imagenes, setImagenes] = useState({
    existentes: [], // {id: number, url: string}
    nuevas: [], // Array de File objects
    aEliminar: [], // Array de IDs de imágenes a eliminar
  });
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
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
      IdImpuesto: "",
      stock: "",
      ano_compatible: "",
      marca_compatible: "",
      modelo_compatible: "",
      motor_compatible: "",
      certificaciones: "",
      estado: "",
      imagesToDelete: [],
      etiquetasDisponibles: [],
    },
    resolver: yupResolver(productoSchema),
  });

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
        if (id) {
          const productoRes = await ProductoService.getProductobyId(id);
          const producto = productoRes.data;

          let valoraciones = [];
          try {
            const resenasRes = await ResenaService.getResenasPorProducto(id);
            valoraciones = resenasRes.data || [];
          } catch (error) {
            console.log("No se encontraron reseñas para este producto", error);
            valoraciones = [];
          }

          // Calcular promedio
          const promedio =
            valoraciones.length > 0
              ? valoraciones.reduce(
                  (sum, resena) => sum + resena.valoracion,
                  0
                ) / valoraciones.length
              : 0;

          setValoraciones(valoraciones);
          setPromedioValoraciones(promedio);

          // Formatear datos para el formulario
          reset({
            nombre: producto.nombre || "",
            descripcion: producto.descripcion || "",
            precio: producto.precio ? Number(producto.precio) : "",
            categoria_id: producto.categoria_id
              ? Number(producto.categoria_id)
              : "",
            IdImpuesto: producto.IdImpuesto ? Number(producto.IdImpuesto) : "",
            stock: producto.stock ? Number(producto.stock) : "",
            ano_compatible: producto.ano_compatible
              ? Number(producto.ano_compatible)
              : null,
            marca_compatible: producto.marca_compatible || "",
            modelo_compatible: producto.modelo_compatible || "",
            motor_compatible: producto.motor_compatible || "",
            certificaciones: producto.certificaciones || "",
            estado: producto.estado === 1 || producto.estado === "1",
          });

          // Manejar etiquetas
          setSelectedEtiquetas(
            producto.etiquetas?.map((e) => Number(e.id)) || []
          );

          // Manejar imágenes existentes
          const BASE_URL =
            import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") + "/uploads";

          const existingImages =
            producto.imagen?.map((img) => ({
              id: img.id,
              url: `${BASE_URL}/${img.imagen}`,
              name: img.imagen,
              isExisting: true,
            })) || [];

          setImagenes(existingImages);
          setPreviewURLs(existingImages.map((img) => img.url));
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
  //agregar imagenes
  const handleAddImage = () => {
    const MAX_IMAGES = 5;
    if (previewURLs.length < MAX_IMAGES) {
      setImagenes([...imagenes, null]);
      setPreviewURLs([...previewURLs, null]);
    } else {
      toast.error(`Máximo ${MAX_IMAGES} imágenes por producto`);
    }
  };

  const handleRemoveImageClick = (index) => {
    const imageToRemove = imagenes[index];

    if (imageToRemove?.isExisting) {
      // Verifica que imageToRemove.name exista antes de agregarlo
      if (imageToRemove.name) {
        setImagesToDelete((prev) => [
          ...prev,
          imageToRemove.name, // Solo el nombre del archivo
        ]);
      } else {
        console.error("La imagen a eliminar no tiene nombre:", imageToRemove);
      }
    }

    const newImages = imagenes.filter((_, idx) => idx !== index);
    const newPreviews = previewURLs.filter((_, idx) => idx !== index);

    setImagenes(newImages);
    setPreviewURLs(newPreviews);
    setDeleteDialog({ open: false, index: null });

    console.log("Imágenes a eliminar actualizadas:", imagesToDelete);
  };

  // Modifica handleChangeImage
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

    setImagenes((prev) => {
      const newImages = [...prev];
      newImages[index] = { file, isExisting: false };
      return newImages;
    });

    setPreviewURLs((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = URL.createObjectURL(file);
      return newPreviews;
    });
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
  const [error, setError] = useState("");
  const onSubmit = async (DataForm) => {
    try {
      // Validar el esquema antes de enviar
      const isValid = await productoSchema.isValid(DataForm);
      if (!isValid) {
        toast.error("Complete todos los campos requeridos correctamente");
        return;
      }

      const imagenesAEliminar = imagesToDelete.filter((img) => img);
      const productoData = {
        id: id,
        nombre: DataForm.nombre,
        descripcion: DataForm.descripcion,
        precio: DataForm.precio,
        categoria_id: DataForm.categoria_id,
        IdImpuesto: DataForm.IdImpuesto,
        stock: DataForm.stock,
        ano_compatible: DataForm.ano_compatible,
        marca_compatible: DataForm.marca_compatible,
        modelo_compatible: DataForm.modelo_compatible,
        motor_compatible: DataForm.motor_compatible,
        certificaciones: DataForm.certificaciones,
        estado: DataForm.estado ? 1 : 0,
        etiqueta: selectedEtiquetas,
        imagenes_a_eliminar:
          imagenesAEliminar.length > 0 ? imagenesAEliminar : undefined,
      };

      console.log("Datos finales a enviar:", productoData);

      // Llamada al servicio para actualizar
      const response = await ProductoService.updateProducto(productoData);

      // Subir imágenes si hay
      // const newProductId = response.data.id;

      // // Subir imágenes si hay
      // if (imagenes.length > 0) {
      //   await Promise.all(
      //     imagenes
      //       .filter((img) => img instanceof File)
      //       .map(async (img) => {
      //         const imgFormData = new FormData();
      //         imgFormData.append("file", img);
      //         imgFormData.append("producto_id", newProductId);
      //         return await ImageService.createImage(imgFormData);
      //       })
      //   );
      // }
      console.log("Respuesta del servicio de actualización:", response);

      if (response?.error) {
        toast.error(response.message || "Error al actualizar el producto---->");
        return;
      }

      console.log("Producto actualizado correctamente:", response);
      toast.success("Producto actualizado");

      setTimeout(() => {
        navigate("/productos");
      }, 1000);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message || error);
      toast.error("Error al actualizar el producto Producto Model");
    }
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
          <Button
            onClick={() => handleRemoveImageClick(deleteDialog.index)}
            color="error"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

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
                              errors.nombre?.message ||
                              "Nombre descriptivo del producto"
                            }
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="categoria_id"
                        control={control}
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
                            <InputLabel>Impuesto aplicable *</InputLabel>
                            <Select
                              {...field}
                              label="Impuesto aplicable *"
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
                            helperText={`${field.value?.length || 0}/500 - Descripción detallada del producto`}
                            inputProps={{ maxLength: 500 }}
                            FormHelperTextProps={{ sx: { ml: 0 } }}
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Valoración del Producto
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Rating
                        value={promedioValoraciones || 0}
                        precision={0.1}
                        readOnly
                        sx={{ mr: 2 }}
                      />
                      <Typography variant="body1">
                        {promedioValoraciones
                          ? `${promedioValoraciones.toFixed(1)}/5`
                          : "Sin valoraciones"}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {valoraciones.length > 0
                        ? `Basado en ${valoraciones.length} ${valoraciones.length === 1 ? "reseña" : "reseñas"}`
                        : "Aún no hay reseñas"}
                    </Typography>
                  </Grid>
                </Paper>
              </Grid>

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
                            }}
                            error={!!errors.precio}
                            helperText={
                              errors.precio?.message ||
                              "Precio de venta al público en colones"
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
                            error={!!errors.stock}
                            helperText={
                              errors.stock?.message ||
                              "Cantidad disponible en inventario"
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
                              "Año del vehículo compatible (opcional)"
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
                              "Marca del vehículo compatible (opcional)"
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
                              "Modelo del vehículo compatible (opcional)"
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
                              "Motor compatible (opcional)"
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
                            helperText={`${field.value?.length || 0}/200 - Certificaciones o estándares que cumple el producto`}
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

                  <FormControl fullWidth size="small">
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
                                  onClick={() =>
                                    setDeleteDialog({ open: true, index })
                                  }
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
