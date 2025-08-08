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
  Stack,
  Paper,
  CircularProgress,
  Divider,
  Chip,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

// Servicios
import ProductoService from "../../services/ProductoService";
import CategoriaService from "../../services/CategoriaService";
import ProductoEtiquetaService from "../../services/ProductoEtiquetaService";
import ImageService from "../../services/ImageService";
import ImpuestoService from "../../services/ImpuestoService";

export function CrearProducto() {
  const { t } = useTranslation("crearProducto");

  const navigate = useNavigate();

  // Estados
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [impuestos, setImpuestos] = useState([]);

  // Esquema de validación
  const productoSchema = yup.object({
    nombre: yup
      .string()
      .required("Por favor ingresa un nombre para el producto")
      .max(100, "El nombre no puede exceder los 100 caracteres"),
    descripcion: yup.string().max(500, "La descripción es demasiado larga"),
    precio: yup
      .number()
      .typeError("Debe ser un valor numérico")
      .required("El precio es obligatorio")
      .positive("El precio debe ser positivo"),
    categoria_id: yup
      .number()
      .typeError("Selecciona una categoría válida")
      .required("La categoría es obligatoria"),
    stock: yup
      .number()
      .typeError("Debe ser un número entero")
      .required("El stock es obligatorio")
      .integer("El stock debe ser un número entero")
      .min(0, "El stock no puede ser negativo"),
    ano_compatible: yup
      .number()
      .typeError("Ingresa un año válido")
      .min(1900, "El año debe ser posterior a 1900")
      .max(new Date().getFullYear() + 1, "El año no puede ser en el futuro")
      .nullable(),
    marca_compatible: yup.string().max(50, "Máximo 50 caracteres"),
    modelo_compatible: yup.string().max(50, "Máximo 50 caracteres"),
    motor_compatible: yup.string().max(50, "Máximo 50 caracteres"),
    certificaciones: yup.string(),
    estado: yup.boolean(),
    IdImpuesto: yup
      .number()
      .typeError("Selecciona un impuesto válido")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      ),
  });

  const defaultValues = {
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
    IdImpuesto: null,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(productoSchema),
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

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

        console.log("Datos de impuestos recibidos:", impuestosRes.data);
        setImpuestos(impuestosRes.data || []);
      } catch (err) {
        toast.error(t("crearProducto.form.errors.loadInitialData"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleEtiquetasChange = (event) => {
    setSelectedEtiquetas(event.target.value.map(Number));
  };

  const handleAddImage = () => {
    if (previewURLs.length < 3) {
      setImagenes([...imagenes, null]);
      setPreviewURLs([...previewURLs, null]);
    } else {
      toast.error("Solo puedes subir hasta 3 imágenes por producto");
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...imagenes];
    const newPreviews = [...previewURLs];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImagenes(newImages);
    setPreviewURLs(newPreviews);
  };

  const handleChangeImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen no debe exceder los 2MB");
      return;
    }

    const newImages = [...imagenes];
    const newPreviews = [...previewURLs];

    newImages[index] = file;
    newPreviews[index] = URL.createObjectURL(file);

    setImagenes(newImages);
    setPreviewURLs(newPreviews);
  };

  const handleCancel = () => {
    navigate("/productos");
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      console.log("Datos a enviar:", {
        ...formData,
        estado: formData.estado ? "1" : "0",
        etiquetas: selectedEtiquetas,
        IdImpuesto: formData.IdImpuesto,
      });

      const productoData = {
        ...formData,
        estado: formData.estado ? "1" : "0",
        etiquetas: selectedEtiquetas,
        IdImpuesto: formData.IdImpuesto || null,
      };

      // Crear producto
      const response = await ProductoService.createProducto(productoData);
      const newProductId = response.data.id;

      // Subir imágenes si hay
      if (imagenes.length > 0) {
        await Promise.all(
          imagenes
            .filter((img) => img instanceof File)
            .map(async (img) => {
              const imgFormData = new FormData();
              imgFormData.append("file", img);
              imgFormData.append("producto_id", newProductId);
              return await ImageService.createImage(imgFormData);
            })
        );
      }

      toast.success("Producto creado exitosamente!", { duration: 5000 });
      navigate("/productos");
    } catch (error) {
      console.error("Error al crear el producto:", error);
      let errorMessage = "Error desconocido";
      if (error.response) {
        errorMessage = error.response.data.message || "Error en el servidor";
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor";
      }
      toast.error(`${errorMessage} al crear el producto`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Encabezado */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton
          component={Link}
          to="/productos"
          sx={{
            mr: 2,
            color: "primary.main",
            "&:hover": { backgroundColor: "primary.light" },
          }}
        >
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography variant="h3" fontWeight="bold" color="primary">
          {/*Asi debe ponerse para que agarre la traducción*/}
          {t("crearProducto.title")}
        </Typography>
      </Box>

      {/* Formulario Principal */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardHeader
          title={t("crearProducto.form.sections.details")}
          titleTypographyProps={{
            variant: "h4",
            fontWeight: 600,
            color: "text.primary",
          }}
          sx={{
            backgroundColor: "background.paper",
            py: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        />

        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              {/* Sección 1: Información Básica */}
              <Grid item xs={12} md={6}>
                <Accordion defaultExpanded elevation={0} sx={{ mb: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {/*Prueba de traducción*/}
                      {t("crearProducto.form.sections.basicInfo")}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Controller
                          name="nombre"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label={t("crearProducto.form.fields.productName")}
                              variant="outlined"
                              error={!!errors.nombre}
                              helperText={errors.nombre?.message}
                              size="medium"
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
                              size="medium"
                            >
                              <InputLabel>
                                {t("crearProducto.form.fields.category")}
                              </InputLabel>
                              <Select
                                {...field}
                                label={t("crearProducto.form.fields.category")}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 400,
                                    },
                                  },
                                }}
                              >
                                {categorias.map((cat) => (
                                  <MenuItem key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {errors.categoria_id?.message}
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
                              label={t("crearProducto.form.fields.description")}
                              multiline
                              rows={4}
                              variant="outlined"
                              error={!!errors.descripcion}
                              helperText={errors.descripcion?.message}
                              size="medium"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Sección 2: Precio y Stock */}
                <Accordion defaultExpanded elevation={0} sx={{ mb: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {t("crearProducto.form.sections.priceStock")}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="precio"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label={t("crearProducto.form.fields.price")}
                              type="number"
                              variant="outlined"
                              inputProps={{ step: "0.01", min: "0" }}
                              InputProps={{
                                startAdornment: (
                                  <Typography sx={{ mr: 1, fontWeight: 500 }}>
                                    ₡
                                  </Typography>
                                ),
                              }}
                              error={!!errors.precio}
                              helperText={errors.precio?.message}
                              size="medium"
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
                              label={t("crearProducto.form.fields.stock")}
                              type="number"
                              variant="outlined"
                              error={!!errors.stock}
                              helperText={errors.stock?.message}
                              size="medium"
                            />
                          )}
                        />
                      </Grid>

                      {/* Select de Impuesto */}
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
                                Selecciona el impuesto que aplica a este
                                producto
                              </FormHelperText>
                            </FormControl>
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
                                  size="medium"
                                />
                              )}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="h6">
                                Estado del Producto
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
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
                            borderRadius: 2,
                            p: 2,
                            width: "100%",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Sección 3: Compatibilidad */}
              <Grid item xs={12} md={6}>
                <Accordion defaultExpanded elevation={0} sx={{ mb: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center">
                      <CarIcon sx={{ mr: 2, color: "primary.main" }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Compatibilidad del Producto
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        backgroundColor: "background.default",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ mb: 2 }}
                      >
                        <BuildIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Especificaciones Técnicas
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name="ano_compatible"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Año Compatible"
                                type="number"
                                variant="outlined"
                                error={!!errors.ano_compatible}
                                helperText={errors.ano_compatible?.message}
                                size="medium"
                                InputProps={{
                                  startAdornment: (
                                    <Typography sx={{ mr: 1 }}>Año:</Typography>
                                  ),
                                }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name="marca_compatible"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Marca Compatible"
                                variant="outlined"
                                error={!!errors.marca_compatible}
                                helperText={errors.marca_compatible?.message}
                                size="medium"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name="modelo_compatible"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Modelo Compatible"
                                variant="outlined"
                                error={!!errors.modelo_compatible}
                                helperText={errors.modelo_compatible?.message}
                                size="medium"
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name="motor_compatible"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Motor Compatible"
                                variant="outlined"
                                error={!!errors.motor_compatible}
                                helperText={errors.motor_compatible?.message}
                                size="medium"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        backgroundColor: "background.default",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ mb: 2 }}
                      >
                        <VerifiedIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Certificaciones y Estándares
                      </Typography>
                      <Controller
                        name="certificaciones"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Certificaciones (separadas por comas)"
                            variant="outlined"
                            multiline
                            rows={2}
                            size="medium"
                            placeholder="Ej: ISO 9001, CE, RoHS"
                          />
                        )}
                      />
                    </Paper>
                  </AccordionDetails>
                </Accordion>

                {/* Sección 4: Etiquetas */}
                <Accordion defaultExpanded elevation={0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Etiquetas y Categorización
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth size="medium">
                      <InputLabel>Seleccione etiquetas</InputLabel>
                      <Select
                        multiple
                        value={selectedEtiquetas}
                        onChange={handleEtiquetasChange}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.length === 0 ? (
                              <Typography variant="body2" color="textSecondary">
                                Ninguna etiqueta seleccionada
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
                                    sx={{ m: 0.25 }}
                                  />
                                );
                              })
                            )}
                          </Box>
                        )}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 400,
                            },
                          },
                        }}
                      >
                        {etiquetasDisponibles.map((etiqueta) => (
                          <MenuItem key={etiqueta.id} value={etiqueta.id}>
                            <Checkbox
                              checked={selectedEtiquetas.includes(etiqueta.id)}
                              size="small"
                            />
                            <ListItemText primary={etiqueta.nombre} />
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText sx={{ mt: 1 }}>
                        Selecciona las etiquetas que describan tu producto
                      </FormHelperText>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Sección 5: Imágenes */}
              <Grid item xs={12}>
                <Accordion defaultExpanded elevation={0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Imágenes del Producto
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mb: 3 }}
                    >
                      Agrega imágenes del producto (máximo 3). Las imágenes
                      deben ser en formato JPG o PNG y no exceder los 2MB.
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={3}
                      sx={{
                        flexWrap: "wrap",
                        mt: 2,
                        "& > *": {
                          flex: "1 1 200px",
                          maxWidth: "300px",
                        },
                      }}
                    >
                      {previewURLs.map((url, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: 200,
                            border: "2px dashed",
                            borderColor: "divider",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            mb: 2,
                            bgcolor: "background.default",
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
                              />
                              <IconButton
                                size="large"
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  backgroundColor: "error.main",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "error.dark",
                                    transform: "scale(1.1)",
                                  },
                                }}
                              >
                                ✕
                              </IconButton>
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
                              <Stack
                                alignItems="center"
                                justifyContent="center"
                                spacing={1}
                                sx={{ p: 2, textAlign: "center" }}
                              >
                                <AddPhotoIcon fontSize="large" color="action" />
                                <Typography variant="body1">
                                  Haz clic para seleccionar una imagen
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  (JPG/PNG, max 2MB)
                                </Typography>
                              </Stack>
                            </>
                          )}
                        </Box>
                      ))}

                      {previewURLs.length < 3 && (
                        <Button
                          variant="outlined"
                          onClick={handleAddImage}
                          startIcon={<AddPhotoIcon />}
                          sx={{
                            height: 200,
                            flexDirection: "column",
                            borderStyle: "dashed",
                            borderWidth: 2,
                            borderRadius: 2,
                            "& .MuiButton-startIcon": {
                              margin: 0,
                              mb: 1,
                              fontSize: "2rem",
                            },
                          }}
                        >
                          <Typography variant="body1" fontWeight={500}>
                            Agregar Imagen
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ({3 - previewURLs.length} restantes)
                          </Typography>
                        </Button>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Botones de acción */}
              <Grid item xs={12}>
                <Divider sx={{ my: 4 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                      fontWeight: "bold",
                    }}
                  >
                    Cancelar
                  </Button>

                  <Box display="flex" alignItems="center">
                    {loading && <CircularProgress size={24} sx={{ mr: 2 }} />}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        px: 6,
                        py: 1.5,
                        fontWeight: "bold",
                        minWidth: 200,
                      }}
                    >
                      {loading ? "Creando..." : "Guardar Producto"}
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
