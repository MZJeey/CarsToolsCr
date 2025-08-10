import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Autocomplete,
  TextField,
  Typography,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import toast from "react-hot-toast";
import * as yup from "yup";
import ProductoService from "../../services/ProductoService";
import ProductosSimilaresService from "../../services/ProductoSimilarService";

const validationSchema = yup.object({
  productoBase: yup
    .object()
    .required("Debe seleccionar un producto base")
    .nullable(),
  productosSimilares: yup
    .array()
    .min(1, "Debe seleccionar al menos un producto similar")
    .required("Debe seleccionar productos similares"),
  tipoRelacion: yup
    .string()
    .oneOf(["generico", "homologado", "similar"], "Tipo de relación inválido")
    .required("Debe seleccionar un tipo de relación"),
});

const CrearProductosSimilares = () => {
  const [productos, setProductos] = useState([]);
  const [productoBase, setProductoBase] = useState(null);
  const [productosSimilares, setProductosSimilares] = useState([]);
  const [tipoRelacion, setTipoRelacion] = useState("similar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      try {
        const response = await ProductoService.getProductos();

        if (Array.isArray(response)) {
          setProductos(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setProductos(response.data);
        } else if (
          response?.data?.productos &&
          Array.isArray(response.data.productos)
        ) {
          setProductos(response.data.productos);
        } else {
          console.error("Formato inesperado:", response);
          setError("Formato de datos inválido");
        }
      } catch (error) {
        console.error("Error en la carga:", error);
        setError(`Error al cargar productos: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const validateForm = async () => {
    try {
      await validationSchema.validate(
        { productoBase, productosSimilares, tipoRelacion },
        { abortEarly: false }
      );
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const onSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      toast.error("Por favor corrija los errores en el formulario");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      for (const producto of productosSimilares) {
        await ProductosSimilaresService.createProductoSimilar({
          producto_id: productoBase.id,
          producto_similar_id: producto.id,
          tipo_relacion: tipoRelacion,
        });
      }

      toast.success("Productos similares creados exitosamente");
      setProductoBase(null);
      setProductosSimilares([]);
      setTipoRelacion("similar");
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error("Error al crear relaciones:", err);
      setError(err.response?.data?.message || "Error al crear las relaciones");
      toast.error("Error al guardar las relaciones");
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar la compatibilidad de un producto
  const renderCompatibilidad = (producto) => {
    const compatibilidad = [
      { label: "Año", value: producto.año_compatible },
      { label: "Marca", value: producto.marca_compatible },
      { label: "Modelo", value: producto.modelo_compatible },
      { label: "Motor", value: producto.motor_compatible },
    ].filter((item) => item.value);

    if (compatibilidad.length === 0) return null;

    return (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {compatibilidad.map((item, index) => (
          <Chip
            key={index}
            label={`${item.label}: ${item.value}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Crear Relaciones de Productos Similares
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Producto Base */}
        <Grid item xs={12}>
          <Autocomplete
            options={productos}
            loading={loading}
            getOptionLabel={(option) => option.nombre || ""}
            value={productoBase}
            onChange={(_, newValue) => {
              setProductoBase(newValue);
              if (touched.productoBase) validateForm();
            }}
            onBlur={() => handleBlur("productoBase")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccione el producto base"
                required
                error={touched.productoBase && Boolean(errors.productoBase)}
                helperText={touched.productoBase && errors.productoBase}
              />
            )}
            disabled={loading}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Grid>

        {/* Compatibilidad del Producto Base */}
        {productoBase && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Compatibilidad del Producto Base:
              </Typography>
              {renderCompatibilidad(productoBase)}
              {!productoBase.año_compatible &&
                !productoBase.marca_compatible &&
                !productoBase.modelo_compatible &&
                !productoBase.motor_compatible && (
                  <Typography variant="body2" color="text.secondary">
                    Este producto no tiene información de compatibilidad
                    definida.
                  </Typography>
                )}
            </Paper>
          </Grid>
        )}

        {/* Productos Similares */}
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={productos.filter((p) => p.id !== productoBase?.id)}
            getOptionLabel={(option) => option.nombre || ""}
            value={productosSimilares}
            onChange={(_, newValue) => {
              setProductosSimilares(newValue);
              if (touched.productosSimilares) validateForm();
            }}
            onBlur={() => handleBlur("productosSimilares")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccione productos similares"
                required
                error={
                  touched.productosSimilares &&
                  Boolean(errors.productosSimilares)
                }
                helperText={
                  touched.productosSimilares && errors.productosSimilares
                }
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.nombre}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
            disabled={loading || !productoBase}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Grid>

        {/* Compatibilidad de Productos Similares */}
        {productosSimilares.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Compatibilidad de Productos Similares:
              </Typography>
              <Grid container spacing={2}>
                {productosSimilares.map((producto) => (
                  <Grid item xs={12} key={producto.id}>
                    <Typography variant="body2" fontWeight="bold">
                      {producto.nombre}
                    </Typography>
                    {renderCompatibilidad(producto)}
                    {!producto.año_compatible &&
                      !producto.marca_compatible &&
                      !producto.modelo_compatible &&
                      !producto.motor_compatible && (
                        <Typography variant="body2" color="text.secondary">
                          Sin información de compatibilidad.
                        </Typography>
                      )}
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Tipo de Relación */}
        <Grid item xs={12}>
          <Select
            fullWidth
            value={tipoRelacion}
            onChange={(e) => {
              setTipoRelacion(e.target.value);
              if (touched.tipoRelacion) validateForm();
            }}
            onBlur={() => handleBlur("tipoRelacion")}
            label="Tipo de relación"
            error={touched.tipoRelacion && Boolean(errors.tipoRelacion)}
            disabled={loading}
          >
            <MenuItem value="generico">Genérico</MenuItem>
            <MenuItem value="homologado">Homologado</MenuItem>
            <MenuItem value="similar">Similar</MenuItem>
          </Select>
          {touched.tipoRelacion && errors.tipoRelacion && (
            <Typography color="error" variant="caption">
              {errors.tipoRelacion}
            </Typography>
          )}
        </Grid>

        {/* Botón de envío */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            fullWidth
            size="large"
          >
            {loading ? "Creando relaciones..." : "Crear Relaciones"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CrearProductosSimilares;
