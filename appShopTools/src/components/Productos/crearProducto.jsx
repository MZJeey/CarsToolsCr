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
      .required(t("crearProducto.form.validations.nombre.required"))
      .max(100, t("crearProducto.form.validations.max")),
    descripcion: yup
      .string()
      .max(500, t("crearProducto.form.validations.descripcion.max")),
    precio: yup
      .number()
      .typeError(t("crearProducto.form.validations.precio.typeError"))
      .required(t("crearProducto.form.validations.precio.required"))
      .positive(t("crearProducto.form.validations.precio.positive")),
    categoria_id: yup
      .number()
      .typeError(t("crearProducto.form.validations.categoria_id.typeError"))
      .required(t("crearProducto.form.validations.categoria_id.required")),
    stock: yup
      .number()
      .typeError(t("crearProducto.form.validations.stock.typeError"))
      .required(t("crearProducto.form.validations.stock.required"))
      .integer(t("crearProducto.form.validations.stock.integer"))
      .min(0, t("crearProducto.form.validations.stock.min")),
    ano_compatible: yup
      .number()
      .typeError(t("crearProducto.form.validations.ano_compatible.typeError"))
      .min(1900, t("crearProducto.form.validations.ano_compatible.min"))
      .max(
        new Date().getFullYear() + 1,
        t("crearProducto.form.validations.ano_compatible.max")
      )
      .nullable(),
    marca_compatible: yup
      .string()
      .max(50, t("crearProducto.form.validations.marca_compatible.max")),
    modelo_compatible: yup
      .string()
      .max(50, t("crearProducto.form.validations.modelo_compatible.max")),
    motor_compatible: yup
      .string()
      .max(50, t("crearProducto.form.validations.motor_compatible.max")),
    certificaciones: yup.string(),
    estado: yup.boolean(),
    IdImpuesto: yup
      .number()
      .typeError(t("crearProducto.form.validations.idImpuesto.typeError"))
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
      toast.error(t("crearProducto.form.toasts.maxImages"));
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
      toast.error(t("crearProducto.form.toasts.invalidImage"));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("crearProducto.form.toasts.imageTooLarge"));
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

      toast.success(t("crearProducto.form.toasts.success"), {
        duration: 5000,
      });
      navigate("/productos");
    } catch (error) {
      console.error("Error al crear el producto:", error);
      let errorMessage = "Error desconocido";
      if (error.response) {
        errorMessage = error.response.data.message || "Error en el servidor";
      } else if (error.request) {
        errorMessage = {
          errorMessage: t("crearProducto.form.errors.errorMessage"),
        };
      }
      toast.error(
        `${errorMessage.errorMessage} ${t("crearProducto.form.errors.createError")}`
      );
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
                              <InputLabel>
                                {t("crearProducto.form.fields.tax")}
                              </InputLabel>
                              <Select
                                {...field}
                                label={t("crearProducto.form.fields.tax")}
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
                                {t("crearProducto.form.fields.productStatus")}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {watch("estado")
                                  ? t("crearProducto.form.fields.statusActive")
                                  : t(
                                      "crearProducto.form.fields.statusInactive"
                                    )}
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
                        {t("crearProducto.form.sections.compatibility")}
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
                        {t("crearProducto.form.sections.technicalSpecs")}
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
                                label={t("crearProducto.form.fields.year")}
                                type="number"
                                variant="outlined"
                                error={!!errors.ano_compatible}
                                helperText={errors.ano_compatible?.message}
                                size="medium"
                                InputProps={{}}
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
                                label={t("crearProducto.form.fields.brand")}
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
                                label={t("crearProducto.form.fields.model")}
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
                                label={t("crearProducto.form.fields.engine")}
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
                        {t("crearProducto.form.sections.certifications")}
                      </Typography>
                      <Controller
                        name="certificaciones"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t(
                              "crearProducto.form.fields.certificationsInput"
                            )}
                            variant="outlined"
                            multiline
                            rows={2}
                            size="medium"
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
                      {t("crearProducto.form.sections.labels")}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl fullWidth size="medium">
                      <InputLabel>
                        {t("crearProducto.form.fields.tagLabel")}
                      </InputLabel>
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
                                {t("crearProducto.form.fields.noNone")}
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
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Sección 5: Imágenes */}
              <Grid item xs={12}>
                <Accordion defaultExpanded elevation={0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {t("crearProducto.form.sections.images")}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mb: 3 }}
                    >
                      {t("crearProducto.form.fields.imageDescription")}
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
                                  {t(
                                    "crearProducto.form.fields.imagePlaceholder"
                                  )}
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
                            {t("crearProducto.form.fields.addImage")}
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
                    {t("crearProducto.form.buttons.cancel")}
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
                      {loading
                        ? t("crearProducto.form.buttons.saving")
                        : t("crearProducto.form.buttons.save")}
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
